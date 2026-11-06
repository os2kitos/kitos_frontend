---
name: testing
description: Choose proportionate validation for KITOS frontend changes. Use when planning, adding, or updating Cypress tests; reserve automated browser coverage for the most crucial app flows.
---

# Frontend testing

For now, add Cypress coverage only for the most crucial user flows. A new feature does not automatically need new Cypress tests.

- Identify the concrete user impact of a regression before adding a test. Prioritize essential workflows, destructive actions, and access restrictions with significant consequences.
- Reuse or extend an existing test when it already exercises the affected critical flow. Keep additions to the smallest useful set.
- Do not create a test per field, dropdown option, CRUD operation, administration screen, or overview filter. Avoid exhaustive combinations and duplicated component/E2E coverage.
- For a form with dependent fields, one representative save-and-clear flow may be sufficient if data integrity makes it critical. Routine labels, field wiring, and configuration variants can be checked through compilation, lint, and focused manual verification.
- Do not replace omitted Cypress tests with a large new suite in another framework. This frontend uses Cypress for component and E2E tests; do not introduce Karma/Jasmine tests.
- Run the relevant existing tests and necessary build/lint checks. Broaden the test run only when a failure or a concrete regression risk warrants it.

Explicit user requests for broader coverage override this default. Do not delete existing tests merely to enforce this policy unless the task calls for test cleanup.
