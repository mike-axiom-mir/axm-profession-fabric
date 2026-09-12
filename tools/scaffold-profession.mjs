import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

export function findTarget(professionId) {
  const targets = readJson('registry/profession-targets.json');
  for (const [domain, entries] of Object.entries(targets.domains)) {
    for (const [id, displayName] of entries) {
      if (id === professionId) return { domain, professionId: id, displayName };
    }
  }
  return null;
}

export function buildDraft(professionId) {
  const target = findTarget(professionId);
  if (!target) throw new Error(`unknown profession target: ${professionId}`);

  const registry = readJson('registry/professions.json');
  if (registry.professions.some(p => p.profession_id === professionId)) {
    throw new Error(`profession already registered: ${professionId}`);
  }

  const packageTemplate = readJson('templates/profession-package.template.json');
  const bodyTemplate = readJson('templates/professional-body.template.json');
  const packageRoot = `professions/${target.domain}/${professionId}`;

  const manifest = structuredClone(packageTemplate);
  Object.assign(manifest, {
    package_id: professionId,
    profession_id: professionId,
    domain: target.domain,
    display_name: target.displayName,
    status: 'DRAFT'
  });
  manifest.components.documentation = ['README.md', 'RESEARCH_REQUIRED.md'];

  const body = structuredClone(bodyTemplate);
  body.profession_id = professionId;
  body.display_name = target.displayName;
  body.status = 'DRAFT';
  body.purpose = `DRAFT reconstruction target for ${target.displayName}. Replace this placeholder purpose through profession mapping and evidence before registration.`;

  const readme = `# ${target.displayName} — DRAFT\n\nGenerated Profession Fabric scaffold. This is not registered capability and does not count toward the usable-profession milestone.\n`;
  const research = `# Research required\n\nBefore registration: map real work structure; identify authoritative/observed sources; define ownership/non-ownership; build knowledge/tool/procedure maps; add failure library and handoffs; create representative/adversarial fixtures; state known gaps; run validators; preserve DRAFT/EXPERIMENTAL truth boundary.\n`;

  return { target, packageRoot, files: { 'package.json': manifest, 'body.json': body, 'README.md': readme, 'RESEARCH_REQUIRED.md': research } };
}

export function writeDraft(draft) {
  const absoluteRoot = path.join(root, draft.packageRoot);
  if (fs.existsSync(absoluteRoot)) throw new Error(`draft/package path already exists: ${draft.packageRoot}`);
  fs.mkdirSync(absoluteRoot, { recursive: true });
  for (const [name, value] of Object.entries(draft.files)) {
    const content = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`;
    fs.writeFileSync(path.join(absoluteRoot, name), content);
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const professionId = process.argv[2];
  if (!professionId) throw new Error('usage: node tools/scaffold-profession.mjs <profession-id> [--dry-run|--write]');
  const draft = buildDraft(professionId);
  const mode = process.argv[3] ?? '--dry-run';
  if (mode === '--write') {
    writeDraft(draft);
    console.log(`Created unregistered DRAFT at ${draft.packageRoot}`);
  } else if (mode === '--dry-run') {
    console.log(JSON.stringify({ target: draft.target, packageRoot: draft.packageRoot, files: Object.keys(draft.files) }, null, 2));
  } else {
    throw new Error(`unknown mode: ${mode}`);
  }
}
