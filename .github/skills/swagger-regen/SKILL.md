---
name: swagger-regen
description: Regenerates the auto-generated v1/v2 API clients from the OpenAPI spec, then reports added services, removed services, and changed DTOs. Use when the backend API has changed or when asked to refresh the API clients.
allowed-tools: shell
---

# Swagger Regen Skill

Safely regenerate the KITOS API clients and produce a clear change summary.

## Steps to Execute

### Step 1 — Check for manual edits in generated files

Before wiping the generated code, warn the developer if any generated files have been manually edited:

```bash
git diff --name-only HEAD -- src/app/api/
```

If any files are listed, **stop and warn**:

> ⚠️ The following generated API files have uncommitted manual changes. Running `yarn swagger` will permanently delete them. Either revert these changes or document the intent as comments in the consuming effects/services before proceeding.
>
> List the affected files.

Ask the developer to confirm before continuing.

### Step 2 — Snapshot current API surface

Capture the current service and model exports before regeneration so we can diff them:

```bash
node -e "
const fs = require('fs');
const glob = require('glob');

// Collect all service class names from v1 and v2
const files = [
  ...glob.sync('src/app/api/v1/api/*.service.ts'),
  ...glob.sync('src/app/api/v2/api/*.service.ts'),
];
const services = files.map(f => f.replace(/.*\//, '').replace('.service.ts', ''));
fs.writeFileSync('/tmp/kitos-api-before.json', JSON.stringify(services.sort(), null, 2));
console.log('Captured ' + services.length + ' services before regeneration.');
" 2>/dev/null || powershell -Command "
\$v1 = Get-ChildItem src/app/api/v1/api/*.service.ts -ErrorAction SilentlyContinue | ForEach-Object { \$_.BaseName -replace '\.service$', '' }
\$v2 = Get-ChildItem src/app/api/v2/api/*.service.ts -ErrorAction SilentlyContinue | ForEach-Object { \$_.BaseName -replace '\.service$', '' }
(\$v1 + \$v2) | Sort-Object | ConvertTo-Json | Set-Content '\$env:TEMP/kitos-api-before.json'
Write-Host ('Captured ' + ((\$v1 + \$v2).Count) + ' services before regeneration.')
"
```

### Step 3 — Run regeneration

```bash
yarn swagger
```

This will:
1. Delete `src/app/api/v1/` and `src/app/api/v2/`
2. Fetch the OpenAPI spec from `kitos-dev.strongminds.dk`
3. Regenerate all clients using OpenAPI Generator v6.2.1

If you need to regenerate against a local backend instead:
```bash
yarn swagger:local
```

### Step 4 — Capture new API surface and produce diff

```bash
node -e "
const fs = require('fs');
const glob = require('glob');

const before = JSON.parse(fs.readFileSync('/tmp/kitos-api-before.json', 'utf8'));
const files = [
  ...glob.sync('src/app/api/v1/api/*.service.ts'),
  ...glob.sync('src/app/api/v2/api/*.service.ts'),
];
const after = files.map(f => f.replace(/.*\//, '').replace('.service.ts', '')).sort();

const added = after.filter(s => !before.includes(s));
const removed = before.filter(s => !after.includes(s));

console.log('=== API Change Summary ===');
console.log('Services before: ' + before.length);
console.log('Services after:  ' + after.length);
if (added.length) { console.log('\nAdded (' + added.length + '):'); added.forEach(s => console.log('  + ' + s)); }
if (removed.length) { console.log('\nRemoved (' + removed.length + '):'); removed.forEach(s => console.log('  - ' + s)); }
if (!added.length && !removed.length) console.log('\nNo services added or removed.');
" 2>/dev/null || git diff --stat src/app/api/
```

### Step 5 — Check for DTO changes affecting application code

Look for TypeScript errors caused by changed DTO shapes:

```bash
npx tsc --noEmit 2>&1 | head -60
```

Report any errors. Errors in `src/app/api/` are expected during generation and can be ignored. Errors in `src/app/` (outside `api/`) indicate that a DTO field was renamed or removed.

## Report Format

After completing all steps, produce a summary:

```
## Swagger Regeneration Report

**Source:** kitos-dev.strongminds.dk (or local backend)

### Service Changes
- **Added:** N services — [list them]
- **Removed:** N services — [list them, and which effects/components import them]
- **Unchanged:** N services

### DTO Impact
- TypeScript errors: N (outside src/app/api/)
  - [list files and errors if any]
- All clear: No application code broken

### Next Steps
- [ ] Fix any TypeScript errors in application code (removed/renamed DTO fields)
- [ ] Update imports for any removed services — find alternatives in the new API
- [ ] Consider using newly added services where they replace v1 OData queries
- [ ] Run `yarn lint` to verify no linting issues introduced
- [ ] Commit the regenerated files as a standalone commit: "chore: regenerate API clients"
```

## Important Reminders

- Commit regenerated API clients as a dedicated commit with no other changes mixed in
- If a service was removed, search for its usage: `grep -r "RemovedServiceName" src/app/ --include="*.ts"`
- New `INTERNAL` services often replace direct `HttpClient` OData queries — evaluate if existing v1 usage can be migrated
- The `allowed-tools: shell` in this skill's frontmatter means shell commands run without individual confirmation — review this skill before trusting it in new environments
