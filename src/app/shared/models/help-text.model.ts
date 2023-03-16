export interface HelpText {
  Id: number;
  Description: string;
  Key: string;
  Title: string;
}

export const defaultHelpText: HelpText = {
  Id: 0,
  Description: $localize`<p>Ingen hjælpetekst defineret.</p>`,
  Key: '',
  Title: $localize`Ingen hjælpetekst`,
};
