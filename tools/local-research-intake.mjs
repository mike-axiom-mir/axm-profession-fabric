import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const SOURCE_VERSIONS = {
  'onet-31.0': '31.0 (August 2026)',
  'esco-1.2.1': 'v1.2.1 / release v5.7.0 (10 Dec 2025)'
};

const ONET_FILES = [
  ['occupation_data.json', 'occupation'],
  ['task_statements.json', 'task'],
  ['tasks_to_dwas.json', 'detailed-work-activity'],
  ['knowledge.json', 'knowledge'],
  ['work_activities.json', 'work-activity'],
  ['work_context.json', 'work-context'],
  ['software_skills.json', 'software-skill'],
  ['job_titles.json', 'job-title'],
  ['sample_of_reported_titles.json', 'reported-job-title']
];

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function normalizeKey(value) {
  return String(value ?? '').replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function normalizedRow(row) {
  const out = {};
  for (const [key, value] of Object.entries(row)) out[normalizeKey(key)] = value;
  return out;
}

function value(row, ...aliases) {
  for (const alias of aliases) {
    const key = normalizeKey(alias);
    if (Object.hasOwn(row, key) && row[key] !== '' && row[key] != null) return row[key];
  }
  return '';
}

function loadJsonRows(file) {
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  for (const candidate of Object.values(parsed)) if (Array.isArray(candidate)) return candidate;
  throw new Error(`No row array found in ${file}`);
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  if (rows.length === 0) return [];
  const headers = rows.shift().map(normalizeKey);
  return rows.filter(r => r.some(cell => cell !== '')).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

function sourceFiles(dir, names) {
  return names.filter(name => fs.existsSync(path.join(dir, name))).sort().map(name => {
    const bytes = fs.readFileSync(path.join(dir, name));
    return { file: name, sha256: sha256(bytes) };
  });
}

function onetRecord(kind, raw) {
  const row = normalizedRow(raw);
  const code = String(value(row, 'onetsoc_code', 'O*NET-SOC Code'));
  if (kind === 'occupation') return {
    record_type: kind, record_id: code, concept_type: 'occupation',
    label: String(value(row, 'title') || code), text: String(value(row, 'description')),
    method: { onetsoc_code: code }
  };
  if (kind === 'task') return {
    record_type: kind, record_id: `task:${value(row, 'task_id')}`, concept_type: 'task',
    label: String(value(row, 'task') || `Task ${value(row, 'task_id')}`), text: String(value(row, 'task')),
    method: { task_type: value(row, 'task_type'), incumbents_responding: value(row, 'incumbents_responding'), date: value(row, 'date'), domain_source: value(row, 'domain_source') }
  };
  if (kind === 'detailed-work-activity') return {
    record_type: kind, record_id: `dwa:${value(row, 'dwa_element_id')}:${value(row, 'task_id')}`, concept_type: 'detailed-work-activity',
    label: String(value(row, 'dwa_element_name') || value(row, 'task')), text: String(value(row, 'task')),
    method: { task_id: value(row, 'task_id'), date: value(row, 'date'), domain_source: value(row, 'domain_source') }
  };
  if (kind === 'software-skill') return {
    record_type: kind, record_id: `software:${value(row, 'workplace_example')}:${value(row, 'element_id')}`, concept_type: 'software-skill',
    label: String(value(row, 'workplace_example') || value(row, 'element_name')), text: String(value(row, 'element_name')),
    method: { element_id: value(row, 'element_id'), hot_technology: value(row, 'hot_technology'), in_demand: value(row, 'in_demand') }
  };
  if (kind === 'job-title' || kind === 'reported-job-title') {
    const label = String(value(row, kind === 'job-title' ? 'job_title' : 'reported_job_title'));
    return { record_type: kind, record_id: `${kind}:${label}`, concept_type: 'job-title', label, text: '', method: { sources: value(row, 'sources'), shown_in_my_next_move: value(row, 'shown_in_my_next_move') } };
  }
  const elementId = String(value(row, 'element_id'));
  const elementName = String(value(row, 'element_name') || elementId);
  return {
    record_type: kind, record_id: `${kind}:${elementId}:${value(row, 'scale_id') || 'na'}`, concept_type: kind,
    label: elementName, text: '',
    method: { element_id: elementId, scale_id: value(row, 'scale_id'), scale_name: value(row, 'scale_name'), data_value: value(row, 'data_value'), n: value(row, 'n'), date: value(row, 'date'), domain_source: value(row, 'domain_source') }
  };
}

function stableSort(records) {
  return records.sort((a, b) => `${a.record_type}\u0000${a.record_id}\u0000${a.label}`.localeCompare(`${b.record_type}\u0000${b.record_id}\u0000${b.label}`));
}

export function buildOnetSlice(dir, onetsocCode) {
  const records = [];
  const present = [];
  for (const [name, kind] of ONET_FILES) {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) continue;
    present.push(name);
    for (const raw of loadJsonRows(file)) {
      const row = normalizedRow(raw);
      if (String(value(row, 'onetsoc_code', 'O*NET-SOC Code')) !== onetsocCode) continue;
      const record = onetRecord(kind, raw);
      if (record.label) records.push(record);
    }
  }
  if (!records.some(record => record.record_type === 'occupation')) throw new Error(`O*NET occupation not found: ${onetsocCode}`);
  return {
    schema_version: '0.1', source_id: 'onet-31.0', source_version: SOURCE_VERSIONS['onet-31.0'],
    query: { concept_type: 'occupation', external_id: onetsocCode },
    source_files: sourceFiles(dir, present), records: stableSort(records),
    attribution: 'O*NET 31.0 Database; U.S. Department of Labor/Employment and Training Administration; adapted under CC BY 4.0 with modifications identified by AXM.',
    truth_boundary: 'An O*NET occupation slice is occupational evidence. Field methods remain distinct; it is not automatically an AXM profession, practice standard, authorization, or complete Professional Body.'
  };
}

function findOne(dir, regex) {
  const names = fs.readdirSync(dir).filter(name => regex.test(name)).sort();
  if (!names.length) throw new Error(`Required ESCO file not found for ${regex}`);
  return names[0];
}

function readCsvFile(dir, name) {
  return parseCsv(fs.readFileSync(path.join(dir, name), 'utf8'));
}

function escoId(row) { return String(value(row, 'concepturi', 'uri') || value(row, 'conceptid', 'id')); }
function escoLabel(row) { return String(value(row, 'preferredlabel', 'preflabel', 'title') || escoId(row)); }

export function buildEscoSlice(dir, occupationId) {
  const occFile = findOne(dir, /^occupations.*\.csv$/i);
  const skillFile = findOne(dir, /^skills.*\.csv$/i);
  const relFile = findOne(dir, /occupationskillrelations.*\.csv$/i);
  const occupations = readCsvFile(dir, occFile);
  const skills = readCsvFile(dir, skillFile);
  const relations = readCsvFile(dir, relFile);
  const occupation = occupations.find(row => [escoId(row), String(value(row, 'conceptid', 'id')), escoLabel(row)].some(v => v.toLowerCase() === occupationId.toLowerCase()));
  if (!occupation) throw new Error(`ESCO occupation not found: ${occupationId}`);
  const occUri = String(value(occupation, 'concepturi', 'uri') || escoId(occupation));
  const skillByUri = new Map(skills.map(row => [String(value(row, 'concepturi', 'uri') || escoId(row)), row]));
  const records = [{ record_type: 'occupation', record_id: escoId(occupation), concept_type: 'occupation', label: escoLabel(occupation), text: String(value(occupation, 'description', 'definition', 'scopenote')), method: { concept_uri: occUri, isco_group: value(occupation, 'iscogroup'), status: value(occupation, 'status'), modified: value(occupation, 'modifieddate', 'modified') } }];
  for (const relation of relations) {
    const relationOcc = String(value(relation, 'occupationuri', 'occupation'));
    if (relationOcc !== occUri) continue;
    const skillUri = String(value(relation, 'skilluri', 'skill'));
    const skill = skillByUri.get(skillUri) ?? {};
    records.push({
      record_type: 'occupation-skill-relation', record_id: `relation:${skillUri}`, concept_type: 'skill-relation',
      label: escoLabel(skill) || skillUri, text: String(value(skill, 'description', 'definition', 'scopenote')),
      method: { occupation_uri: occUri, skill_uri: skillUri, relation_type: value(relation, 'relationtype', 'relation'), skill_type: value(relation, 'skilltype'), skill_reuse_level: value(skill, 'reuselevel') }
    });
  }
  return {
    schema_version: '0.1', source_id: 'esco-1.2.1', source_version: SOURCE_VERSIONS['esco-1.2.1'],
    query: { concept_type: 'occupation', external_id: occupationId },
    source_files: sourceFiles(dir, [occFile, skillFile, relFile]), records: stableSort(records),
    attribution: 'European Commission ESCO v1.2.1; AXM-created normalized slice; modifications are identified and ESCO is acknowledged.',
    truth_boundary: 'ESCO relations are classification evidence about occupation/skill relevance. They are not measured task frequency, execution authority, or proof that one ESCO concept equals an AXM profession.'
  };
}

function tokens(text) {
  return new Set(String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean));
}

function scoreText(query, texts) {
  const q = tokens(query);
  if (!q.size) return 0;
  const joined = texts.filter(Boolean).join(' ').toLowerCase();
  const t = tokens(joined);
  let intersection = 0;
  for (const token of q) if (t.has(token)) intersection += 1;
  const union = new Set([...q, ...t]).size || 1;
  let score = intersection / union;
  if (texts.some(text => String(text).toLowerCase() === query.toLowerCase())) score = Math.max(score, 1);
  else if (joined.includes(query.toLowerCase())) score = Math.max(score, 0.85);
  return Number(score.toFixed(6));
}

export function discoverOnetCandidates(dir, query, limit = 10) {
  const occupations = loadJsonRows(path.join(dir, 'occupation_data.json')).map(normalizedRow);
  const aliasFiles = ['job_titles.json', 'sample_of_reported_titles.json'].filter(name => fs.existsSync(path.join(dir, name)));
  const aliases = new Map();
  for (const name of aliasFiles) for (const raw of loadJsonRows(path.join(dir, name))) {
    const row = normalizedRow(raw); const code = String(value(row, 'onetsoc_code'));
    const label = String(value(row, 'job_title', 'reported_job_title'));
    if (!aliases.has(code)) aliases.set(code, []);
    if (label) aliases.get(code).push(label);
  }
  return occupations.map(row => {
    const external_id = String(value(row, 'onetsoc_code'));
    const label = String(value(row, 'title'));
    const candidateAliases = [...new Set(aliases.get(external_id) ?? [])].sort();
    return { source_id: 'onet-31.0', external_id, label, concept_type: 'occupation', score: scoreText(query, [label, ...candidateAliases]), matched_aliases: candidateAliases.filter(alias => scoreText(query, [alias]) > 0).slice(0, 5), relation: 'CANDIDATE_ONLY' };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.external_id.localeCompare(b.external_id)).slice(0, limit);
}

export function discoverEscoCandidates(dir, query, limit = 10) {
  const occFile = findOne(dir, /^occupations.*\.csv$/i);
  return readCsvFile(dir, occFile).map(row => {
    const aliases = String(value(row, 'altlabels', 'alternativelabels')).split(/[;|\n]/).map(x => x.trim()).filter(Boolean);
    const external_id = escoId(row); const label = escoLabel(row);
    return { source_id: 'esco-1.2.1', external_id, label, concept_type: 'occupation', score: scoreText(query, [label, ...aliases]), matched_aliases: aliases.filter(alias => scoreText(query, [alias]) > 0).slice(0, 5), relation: 'CANDIDATE_ONLY' };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.external_id.localeCompare(b.external_id)).slice(0, limit);
}

function emit(valueToEmit, out) {
  const text = `${JSON.stringify(valueToEmit, null, 2)}\n`;
  if (out) fs.writeFileSync(out, text); else process.stdout.write(text);
}

function usage() {
  throw new Error('Usage: local-research-intake.mjs <onet-slice|esco-slice|discover-onet|discover-esco> <source-dir> <id-or-query> [out.json]');
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const [command, dir, key, out] = process.argv.slice(2);
  if (!command || !dir || !key) usage();
  if (command === 'onet-slice') emit(buildOnetSlice(dir, key), out);
  else if (command === 'esco-slice') emit(buildEscoSlice(dir, key), out);
  else if (command === 'discover-onet') emit({ schema_version: '0.1', query: key, candidates: discoverOnetCandidates(dir, key) }, out);
  else if (command === 'discover-esco') emit({ schema_version: '0.1', query: key, candidates: discoverEscoCandidates(dir, key) }, out);
  else usage();
}
