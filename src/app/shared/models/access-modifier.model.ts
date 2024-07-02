export type AccessModifierEnum = 'Local' | 'Public';
export const AccessModifierEnum = {
  Local: 'Local' as AccessModifierEnum,
  Public: 'Public' as AccessModifierEnum,
};

export interface AccessModifierChoice {
  name: string;
  value: AccessModifierEnum;
}

export const accessModifierOptions: AccessModifierChoice[] = [
  {
    name: $localize`Lokal`,
    value: AccessModifierEnum.Local,
  },
  {
    name: $localize`Offentlig`,
    value: AccessModifierEnum.Public,
  },
];

export const mapAccessModifierEnumToAccessModifierChoice = (
  value: AccessModifierEnum
): AccessModifierChoice | undefined => {
  return accessModifierOptions.find((option) => option.value === value);
};
