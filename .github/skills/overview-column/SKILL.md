---
name: overview-column
description: Add or fix KITOS overview grid columns, choosing filter types and cell styles and wiring read models, OData queries, exports, saved preferences, and UI customization. Use for overview column implementation and review; not for general page layout or unrelated tables.
---

# Overview columns

Treat a column as a contract between the backend query, adapted row data, filter control, cell renderer, export, and UI customization. Choose filtering from the backend value and user search needs; choose style from how the value should be displayed. A style does not automatically configure its matching filter.

## Trace the existing overview

Paths below are relative to the KITOS frontend repository. Inspect current implementations before applying these conventions:

- `src/app/shared/models/grid-column.model.ts`: supported column properties.
- `src/app/shared/components/grid/grid.component.html`: filter dispatch and column visibility.
- `src/app/shared/components/grid/grid-cell/grid-cell.component.html` and `cell-types/`: rendering and required row shapes.
- `src/app/shared/services/grid-export.service.ts`: exported value conversion.
- `src/app/shared/services/ui-config-services/grid-ui-config.service.ts`: customization gating.
- For system usages: `src/app/modules/it-systems/it-system-usages/it-system-usages.component.ts`, `src/app/shared/constants/it-system-usage-grid-column-constants.ts`, `src/app/shared/models/it-system-usage/it-system-usage.model.ts`, and `src/app/store/it-system-usage/effects.ts`.

For another overview, find its corresponding definitions, adapter, query conversion, and configuration application. For a local grid, inspect `local-grid.component.html` and its filtering path; do not assume every server-grid feature is supported identically.

## Choose the filter

The base `filter` defaults to `text`. Specialized `extraFilter` controls generally require that text base. `extraData` has different meanings for different controls; it is not always an array of options.

| Data and user intent | Configuration | Contract and cautions |
| --- | --- | --- |
| Free text, person name, documentation title, URL, ordinary string identifier | `filter: 'text'`, no `extraFilter` | Uses trimmed `contains` on `field`; clearing removes the filter. A responsible user's display name normally gets this filter, even if accompanying ID/UUID fields exist. |
| Fixed domain enum, including Yes/No/Unknown choices | `extraFilter: 'enum'`, text base, `extraData: options` | Options contain `{ name, value }`; selection sends `eq` with the backend value. Labels are localized, values must match the OData enum representation. Reuse existing grid options where suitable. |
| Actual boolean | `filter: 'boolean'`, `extraData: booleanOptions` | The dropdown requires options with actual boolean values. Do not collapse a nullable or multivalued domain enum into a boolean. |
| Administrator-configurable option with UUID identity | `extraFilter: 'choice-type'`, `extraData: regularOptionTypeKey` | Filters `field` by selected UUID. Usually use the UUID field plus `dataField` pointing to its readable name and `style: 'uuid-to-name'`. Confirm the key is supported by the regular-option store and service. |
| Configurable option where the query contract requires the option name | `extraFilter: 'choice-type-by-name'`, `extraData: regularOptionTypeKey` | Sends equality with the selected name. Use only when name-based filtering is the existing backend contract; prefer UUID identity when available. |
| Organization unit selection | `extraFilter: 'organization-unit'` | Use the shared organization-unit picker. Check its emitted identifier and the overview's query conversion, especially for a collection of units. |
| Finite values supplied by an existing column-data service | `extraFilter: 'dropdown-from-column-data'`, `extraData: GridDataKey` | Confirm `ColumnFilterDataService` supports the key and returns the appropriate options. Use for data-derived choices, not as a substitute for an established enum or configurable choice type. |
| Date or timestamp | `filter: 'date'`, normally `style: 'date'` | Supports inclusive `gte` and `lte`; default is `gte`. Set `defaultDateFilterOperator: 'lte'` for fields where searching for a deadline up to a date is appropriate. Check date serialization and timezone semantics in the existing query path. |
| Quantity, count, monetary/numeric value | `filter: 'numeric'` | Use numeric comparisons supported by the shared numeric filter. A numeric-looking identifier is not automatically a quantity. |
| Action controls or a value without meaningful supported filtering | `noFilter: true` | Disable sorting separately with `sortable: false` when appropriate. Do not hide a filter merely to avoid implementing the required backend mapping. |

Collection displays need an explicit query decision: a text field containing joined names can use text filtering only if that matches the backend semantics. An array may require an OData `any(...)` expression. The renderer does not generate that expression.

## Choose the cell style

| Style | When to use it and required data |
| --- | --- |
| `default` or omitted | Plain text. The usual choice for names, notes, and identifiers that do not navigate. |
| `default-wrap` | Text requiring wrapping. Check compatibility with the grid's row height and virtualization before using it for long descriptions. |
| `primary` | The overview's main identifying cell. Follow the existing primary-cell implementation and neighboring overview conventions; do not use merely for emphasis. |
| `enum` | One localized enum label. The adapted row field must contain an object with `name` (normally `{ name, value }`), not the raw enum string. Use the same domain mapping as the dropdown. |
| `enum-array` | Multiple enum option objects. Adapt each item to the expected named option shape; define collection filtering separately. |
| `uuid-to-name` | Filter by UUID while displaying `dataField`. Preserve both fields in the adapter. Useful with choice-type and organization-unit filters when their contracts match. |
| `date` | Date presentation through the shared date renderer. Pair with a date filter explicitly. Preserve the repository's date adaptation convention and handle missing dates. |
| `integer-with-thousands-separator` | Readable integer quantities. Pair with numeric filtering; do not apply to identifiers or fractional values without checking the renderer. |
| `boolean` | Plain boolean presentation. Use only for actual boolean data and confirm the desired handling of nulls. |
| `chip` / `reverse-chip` | Existing status semantics with `entityType` or `booleanValueDisplay`. Reverse changes the displayed status interpretation; it does not reverse the stored value or query. Verify option ordering used by chip export. |
| `link` | An external URL is the field's value and should itself be shown as a link. Text filtering searches that URL. |
| `title-link` | An external document has a title and URL: `field` is the title, `idField` is the URL. Text filtering searches the title only. Export currently prefers a valid URL, otherwise the title. |
| `page-link` | A related KITOS entity: `field` supplies display text, `idField` supplies its identifier, and `entityType` supplies the destination kind. Do not use for external URLs. |
| `page-link-array` | Multiple related entities: `dataField` supplies items with `{ id, value }`, and `entityType` supplies the destination. `field` remains the query field. Optional `linkArraySeparator` and `itemTooltipField` customize presentation. |
| `page-link-array-with-submodules` | Related-item paths already include submodule routing. Verify the link component and export behavior; do not assume every array variant shares the same export case. |
| `checkbox` / `action-buttons` | Interactive operations with existing events and permissions. Usually disable filtering and sorting. Do not use an editable checkbox just to display a boolean. |
| `usages`, `contract-audit`, `contract-status-chip` | Domain-specific renderers. Reuse only with their existing expected row models and semantics; inspect the component and export conversion first. |
| `excel-only`, `role-excel-only` | Existing export-only conventions. Check how the overview excludes these from on-screen selection and how the export obtains their values; they have no ordinary grid-cell renderer. |

A documentation name and URL normally form one `title-link` column. Add a separate `link` column when the requested overview needs the raw URL visible or independently searchable. Backend ID/UUID companion properties do not each require a visible column. Never assume a title filter also searches the URL; implement and verify combined query behavior if that is requested.

## Wire the column end to end

1. Confirm exact backend property names, nullability, enum members, and scalar versus collection shapes. Add/reuse field constants and map all rendering dependencies in the overview adapter. Preserve missing data without inventing labels or dates; map absent enum values safely rather than leaving raw null objects for export.
2. Define a localized title, appropriate section, default visibility, and stable unique `persistId` following that overview's persistence conventions. Preserve existing IDs when changing a column. Set widths only when the existing defaults are inadequate.
3. Inspect the overview's OData conversion. Choice UUID equality may need conversion from a quoted string into a GUID literal; arrays may need `any(...)`; displayed enum names must never replace wire values. Reuse established helpers and narrowly scoped conversions. Check sort behavior too: use the supported `sortField` path when a display-name column should sort by name instead of UUID, and verify the overview actually honors it.
4. Register every configurable column's exact `field` in `GridUIConfigService` under the correct selector via `mapUIConfigStatusToEnabled()` and `shouldEnable(...)`. Include separate name/URL columns and UUID filter fields. Confirm the grid and chooser receive configuration applications. `hidden: true` is a default preference, not customization gating. The `ui-recommendation` skill covers the related detail/badge propagation when needed.
5. Check exported values and null handling against `GridExportService`; cell rendering alone does not establish correct exports. Keep supporting IDs internal unless users need them as columns.

## Worked selection: personal data deletion

- Capability and method: enum filters and enum styles, with the backend enum values mapped to localized option objects.
- Deadline type: choice-type filter on `PersonalDataDeletionDeadlineTypeUuid`, `uuid-to-name` style using `PersonalDataDeletionDeadlineTypeName`, and the registered deletion-deadline option key.
- Responsible user: text filter on `PersonalDataDeletionResponsibleUserName`; ID and UUID are supporting properties.
- Verified date: date filter and date style.
- Procedure and verification documentation: title-link columns using the respective name and URL pairs; any independently exposed URL columns use link style and text filters.
- All exposed columns follow the personal-data-deletion customization setting.

## Validate the actual behavior

Use existing focused tests and checks appropriate to the change. For nontrivial mapping or query changes, verify representative populated and missing values, generated filter requests, filter clearing, and saved-filter restoration. Test enum wire values, UUID literals, collection expressions, and date boundaries where affected. Confirm sorting, link destinations, and meaningful exported values.

Verify that disabling customization excludes affected columns from the grid, chooser, and export even when saved preferences selected them. Re-enabling should follow the established preferences. Run appropriate TypeScript/lint checks, and report any browser, backend, or export behavior that could not be exercised. Do not add tests that merely restate static column configuration.
