import { APIRiskAssessmentConductedChoice } from 'src/app/api/v2';

export interface RiskAssessmentConductedOption {
  name: string;
  value: APIRiskAssessmentConductedChoice | string;
}

export enum RiskAssessmentConductedEnum {
  Yes = 'Yes',
  No = 'No',
  NoMustBePrepared = 'NoMustBePrepared',
  NoMustNotBePrepared = 'NoMustNotBePrepared',
  DontKnow = 'DontKnow',
  Irrelevant = 'Irrelevant',
  Undecided = 'Undecided',
}

export const riskAssessmentConductedOptions: RiskAssessmentConductedOption[] = [
  { name: $localize`Ja`, value: RiskAssessmentConductedEnum.Yes },
  { name: $localize`Nej`, value: RiskAssessmentConductedEnum.No },
  { name: $localize`Nej, skal udarbejdes`, value: RiskAssessmentConductedEnum.NoMustBePrepared },
  { name: $localize`Nej, skal ikke udarbejdes`, value: RiskAssessmentConductedEnum.NoMustNotBePrepared },
  { name: $localize`Ved ikke`, value: RiskAssessmentConductedEnum.DontKnow },
  { name: $localize`Ikke relevant`, value: RiskAssessmentConductedEnum.Irrelevant },
];

export interface RiskAssessmentConductedGridOption {
  name: string;
  value: string;
}

export const riskAssessmentConductedOptionsGrid: RiskAssessmentConductedGridOption[] = [
  { name: $localize`Ja`, value: 'YES' },
  { name: $localize`Nej`, value: 'NO' },
  { name: $localize`Nej, skal udarbejdes`, value: 'NOMUSTBEPREPARED' },
  { name: $localize`Nej, skal ikke udarbejdes`, value: 'NOMUSTNOTBEPREPARED' },
  { name: $localize`Ved ikke`, value: 'DONTKNOW' },
  { name: $localize`Ikke relevant`, value: 'IRRELEVANT' },
];

export const mapGridRiskAssessmentConductedEnum = (value?: string): RiskAssessmentConductedGridOption | undefined => {
  return riskAssessmentConductedOptionsGrid.find((option) => option.value === value);
};

export const mapToRiskAssessmentConductedEnum = (
  value?: APIRiskAssessmentConductedChoice,
): RiskAssessmentConductedOption | undefined => {
  return riskAssessmentConductedOptions.find((option) => option.value === value);
};
