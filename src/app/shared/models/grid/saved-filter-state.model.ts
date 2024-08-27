import { CompositeFilterDescriptor, SortDescriptor } from "@progress/kendo-data-query";

export type SavedFilterState = {
  filter: CompositeFilterDescriptor | undefined;
  sort: SortDescriptor[] | undefined;
};
