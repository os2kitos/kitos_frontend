export interface Active {
  name: string;
  value: boolean;
}

export const activeOptions: Active[] = [
  {
    name: $localize`Aktiv`,
    value: true,
  },
  {
    name: $localize`Ikke aktiv`,
    value: false,
  },
];

export const mapActive = (source?: boolean): Active | undefined => {
  return activeOptions.find((option) => option.value === source);
};
