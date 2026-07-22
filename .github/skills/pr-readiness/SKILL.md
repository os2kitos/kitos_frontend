---
name: pr-readiness
description: Runs the KITOS frontend PR readiness checklist — lint, build, i18n extraction check, and untranslated string detection. Use before opening a pull request or when asked to verify PR readiness.
allowed-tools: shell
---

# PR Readiness Skill

Run all automated checks from the KITOS PR checklist and report results clearly.

## Steps to Execute

Run these steps in order. Stop and report clearly if any step fails.

### Step 1 — Lint

```bash
yarn lint
```

Report any lint errors with file and line. A clean run should print no errors.

### Step 2 — Build

```bash
yarn build
```

This runs a development build. Report any TypeScript compilation errors or build failures.

### Step 3 — i18n extraction and untranslated string check

```bash
yarn i18n
```

Then check for newly extracted but untranslated strings:

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/locale/messages.da.xlf', 'utf8');
const newMatches = [...content.matchAll(/<target[^>]*state=[\"']new[\"'][^>]*>/g)];
if (newMatches.length === 0) {
  console.log('✅ No untranslated strings found.');
} else {
  console.log('❌ ' + newMatches.length + ' untranslated string(s) found (state=\"new\").');
  console.log('Add Danish translations to src/locale/messages.da.xlf for these entries.');
}
"
```

If untranslated strings are found, also show the surrounding context so the developer knows which strings need translation:

```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('src/locale/messages.da.xlf', 'utf8');
const units = [...content.matchAll(/<trans-unit[^>]*id=\"([^\"]+)\"[\s\S]*?<\/trans-unit>/g)];
const newUnits = units.filter(m => m[0].includes('state=\"new\"'));
newUnits.slice(0, 10).forEach(m => {
  const sourceMatch = m[0].match(/<source>([\s\S]*?)<\/source>/);
  const source = sourceMatch ? sourceMatch[1].trim() : '(no source)';
  console.log('- ID: ' + m[1]);
  console.log('  Source: ' + source);
});
if (newUnits.length > 10) console.log('... and ' + (newUnits.length - 10) + ' more.');
"
```

## Report Format

After running all steps, produce a summary in this format:

```
## PR Readiness Report

| Check | Status | Notes |
|---|---|---|
| Lint | ✅ Pass / ❌ Fail | Error count or "Clean" |
| Build | ✅ Pass / ❌ Fail | Error count or "Clean" |
| i18n extraction | ✅ Pass / ❌ Fail | N untranslated strings or "Clean" |

### Manual checks (cannot be automated)
- [ ] UI validated against Figma designs
- [ ] Tested the PR locally (yarn start or yarn start:local)
- [ ] Cypress tests pass (yarn e2e:ci) — run if you changed routing, grids, or overview pages
- [ ] Rebased/merged latest master
- [ ] Self-review completed
- [ ] PR description added
- [ ] Reviewer requested
```

## On Failure

- **Lint failures:** Show the exact errors with file path and line number. Do NOT attempt to auto-fix unless asked.
- **Build failures:** Show the TypeScript error messages in full. Identify whether the issue is in generated API code (do NOT fix — regenerate with `yarn swagger` instead) or in application code.
- **Untranslated strings:** List each untranslated string's ID and source text. Remind the developer to add Danish translations in `src/locale/messages.da.xlf`.
