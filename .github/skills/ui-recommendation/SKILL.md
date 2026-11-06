---
name: ui-recommendation
description: Implement or fix KITOS UI customization across detail fields, overview columns, recommendation badges, accordions, and sub-menu tabs. Use when propagating enabled/recommended settings, adding configurable overview fields, or correcting badge state; not for general UI design advice.
---

# UI recommendation

Treat recommendation changes as a connected behavior across field badges, section/accordion badges, and navigation badges. Updating only the section template can leave the sub-menu showing complete while recommended details remain empty.

## Trace the existing flow

Find the UI configuration blueprint and enabled/recommended selector, the section template, and the navigation aggregate consuming the same data. Follow references from the menu's `recommendedBadge$` binding rather than assuming the accordion drives it.

In KITOS system usages, useful entry points are:
- `src/app/store/organization/ui-module-customization/selectors.ts`
- `src/app/shared/helpers/observable-helpers.ts` (`mapUIConfigStatusToRecommended`, `combineRecommendedBadgeState`)
- `src/app/shared/helpers/registration-recommended-badges.helper.ts` (`recommendedField`, value predicates)
- `src/app/modules/it-systems/it-system-usages/it-system-usage-details/it-system-usage-recommended-tabs.helper.ts`
- `src/app/component-tests/modules/it-system-usage-recommended-tabs.cy.ts`

These paths are relative to the KITOS frontend repository. Inspect adjacent sections and shared control inputs to confirm current conventions before editing.

## Keep completion consistent

Propagate the section's recommendation setting to every applicable field, including dropdowns, dates, and documentation links. Preserve enabled/recommended gating: disabled or non-recommended configuration must not create an outstanding navigation recommendation.

Use `recommendedFilled` overrides for conditionally inapplicable details. In existing GDPR controls, `undefined` delegates to the control's own value check; `true` marks an inapplicable field satisfied. Do not equate read-only permission with inapplicability: read-only registrations still need accurate completion badges.

The accordion and navigation aggregate should require the controlling choice and all applicable dependent values. Match the established value semantics for strings, dates, options, and link objects; verify whether a particular link requires an object or a nonempty URL. Navigation reads persisted DTO values while templates often read form controls, so map the corresponding properties explicitly.

Personal-data-deletion example: an unanswered capability is incomplete. `No` satisfies the section without details. Both `IndividualRecords` and `BulkDeletion` require method, deadline type, procedure documentation, responsible user, verified date, and verification documentation. This enum is not a Yes/No enum; do not pass it through a helper that only recognizes `Yes` as the dependent-fields case.

Keep badge subscriptions reactive to existing store updates. Do not add network fetches merely to calculate a badge. Prefer the repository's existing aggregate/helper pattern, extracting cohesive rules when useful without refactoring unrelated sections.

## Apply customization to overviews

When adding or changing a configurable field, trace its corresponding overview columns as well as its detail controls. In `src/app/shared/services/ui-config-services/grid-ui-config.service.ts`, register every related column field with the appropriate enabled/recommended selector, using `mapUIConfigStatusToEnabled()` and `shouldEnable(...)`. Match the column's `field` key, including UUID keys used for choice-type filters; separately exposed documentation name and URL columns both need registration.

For system usages, check `src/app/modules/it-systems/it-system-usages/it-system-usages.component.ts` and its template. Verify that the overview grid and column chooser consume the UI configuration applications. A column's `hidden: true` is only its default visibility and does not replace customization gating. Recommended status controls detail completion; enabled status controls overview availability.

Verify that disabling the setting removes the affected columns from the overview and column chooser and excludes them from export, including when saved column preferences previously selected them. Re-enabling should make them available according to the existing column preferences. For personal data deletion, cover capability, method, deadline type, responsible user, verified date, and both documentation names and URLs.

## Verify the behavior

For a changed aggregate, exercise no controlling choice, an inapplicable choice, every applicable choice with missing details, complete details, and clearing each dependent value. Check disabled and non-recommended configuration. Verify the observable updates after store changes; compilation alone cannot catch a missing navigation rule.

Use the existing recommendation component tests where available. Run the focused spec and appropriate compiler checks, and report any validation that could not run. Inspect field, accordion, and navigation calculations together before declaring propagation complete.