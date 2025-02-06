export type BooleanChange<T> = {
  value: boolean;
  item: T;
};

export type RowReorderingEvent<T> = {
  from: Indexed<T>;
  to: Indexed<T>;
};

export type Indexed<T> = {
  item: T;
  index: number;
};

export type CheckboxChange = {
  value: boolean | undefined;
  rowEntityUuid: string | undefined;
};
