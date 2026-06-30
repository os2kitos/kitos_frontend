# KITOS Frontend – Copilot Instructions

OS2 KITOS (Kommunernes IT OverbliksSystem) is a Danish municipal IT-oversight platform. It tracks IT system usages, contracts, data processing registrations (GDPR), and system integrations across public organisations.

## Scope (in priority order)

1. **Correctness & reliability:** Logic errors, race conditions, data loss, broken edge cases.
2. **Security & privacy:** Injection, auth/z, secret handling, unsafe deserialization, insecure defaults.
3. **Compatibility:** Breaking changes, backwards compatibility, input/output validation.
4. **Performance:** Changes that meaningfully impact latency, memory, or scale.
5. **Testing:** Gaps for critical paths; propose **minimal** test additions.
6. **Economic token spend:** Be concise. No explanations unless asked. Code only for generation tasks. Bullets over paragraphs.

## Commands

```bash
yarn start                  # Dev server at http://127.0.0.1:4200
yarn start:local            # Dev server proxied to local backend (localhost:44300)
yarn build                  # Build (dev config); append --configuration prod for production
yarn lint                   # Run ESLint
yarn swagger                # Regenerate API clients from OpenAPI spec (removes src/app/api/v1 and v2 first)
yarn swagger:local          # Same, but against local backend
yarn i18n                   # Extract i18n strings to src/locale/messages.xlf
```

**Testing is Cypress-only** – there are no Karma/Jasmine unit tests.

```bash
yarn e2e                    # Serve + run all Cypress E2E tests
yarn e2e:ci                 # E2E tests in CI mode
npx cypress run --component # Run component tests (src/app/component-tests/**/*.cy.ts)
npx cypress run --spec "cypress/e2e/path/to/spec.cy.ts"   # Run a single E2E spec
npx cypress open            # Open Cypress interactive runner
```

## Architecture

### Feature Modules

All features live under `src/app/modules/` and are **lazy-loaded** from `app-routing.module.ts`:

```typescript
{
  path: AppPath.itSystems,
  loadChildren: () =>
    import('./modules/it-systems/it-systems.routes').then(m => m.ITSystemsRouterModule),
  canActivate: [AuthGuardService],
}
```

Major modules: `frontpage`, `organization`, `it-systems`, `it-contracts`, `data-processing`, `notifications`, `local-admin`, `global-admin`, `layout`.

### State Management (NgRx)

All application state lives in NgRx feature stores under `src/app/store/`. There are 11+ feature stores (e.g. `userFeature`, `itSystemUsageFeature`, `itContractFeature`, `dataProcessingFeature`). State is partially synced to `localStorage` via `ngrx-store-localstorage`. Meta-reducers handle org-switch resets and grid-export state.

### API Layer

Two sets of auto-generated API clients live in `src/app/api/v1/` and `src/app/api/v2/`. **Never edit these files manually** – regenerate with `yarn swagger`. Models are prefixed with `API` (e.g. `APIUserResponseDTO`). Services are injected with the `@Inject()` decorator:

```typescript
constructor(
  @Inject(APIV2UsersInternalINTERNALService)
  private userService: APIV2UsersInternalINTERNALService
) {}
```

HTTP communication uses an XSRF interceptor (`HttpXSRF.interceptor.ts`). Authentication is cookie-based (`.ASPXAUTH` + XSRF token).

### Shared Components & Services

`src/app/shared/` contains 100+ reusable components, services, directives, and pipes. The central grid wrapper is `shared/components/grid/grid.component.ts` (Kendo Grid-backed). All overview/listing pages use this wrapper.

## Key Conventions

### Extend the Base Classes

| Base class              | Use when                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `BaseComponent`         | Every component – provides `subscriptions: Subscription` cleaned up on destroy |
| `BaseFormComponent<T>`  | Form-input components – emits `valueChange` / `validatedValueChange`           |
| `BaseOverviewComponent` | Grid/overview pages – handles row-click navigation, unclickable columns        |

### Component Structure

New components should be **standalone** (`standalone: true` with an `imports: []` array). Older components may use `standalone: false` inside an NgModule – match the pattern of the surrounding module. Default style extension is `.scss`, skip-tests is set to `true` in schematics config.

### Forms

Use **reactive forms** (`FormGroup` / `FormControl`). Form-input components extend `BaseFormComponent<T>`.

### Routing

Detail pages use a tab pattern: `/it-systems/usages/details/:id/frontpage`, `/it-systems/usages/details/:id/gdpr`, etc. Each feature module exports its own `RouterModule` from a `*.routes.ts` file.

### Internationalisation

Angular i18n with `$localize`. Danish (`da`) is the only active locale. Extract new strings with `yarn i18n`; translation file is `src/locale/messages.da.xlf`.

### TypeScript

Strict mode is fully enabled (`strict`, `noImplicitOverride`, `noImplicitReturns`, `strictTemplates`, `strictInjectionParameters`). Use constructor injection rather than the `inject()` function.

### Testing

- **E2E tests** live in `cypress/e2e/`.
- **Component tests** live alongside the component under `src/app/component-tests/`.
- No unit tests are generated or expected – Cypress covers both layers.

## UI Libraries

- **Kendo UI** (licensed via `telerik-license.txt` / env var) – grids, date pickers, dropdowns
- **Angular Material** (custom theme in `src/styles/material.scss`) – dialogs, form fields, icons
- **ng-select** – additional dropdown/select behaviour
- **TinyMCE** – rich-text fields
