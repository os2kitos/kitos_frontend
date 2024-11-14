import { APIHelpTextResponseDTO } from 'src/app/api/v2/model/helpTextResponseDTO';

export interface HelpText {
  Description: string | undefined;
  Key: string;
  Title: string | undefined;
}

export const defaultHelpText: HelpText = {
  Description: $localize`<p>Ingen hjælpetekst defineret.</p>`,
  Key: '',
  Title: $localize`Ingen hjælpetekst`,
};

export function adaptHelpText(apiHelpText: APIHelpTextResponseDTO): HelpText {
  if (!apiHelpText.key) throw new Error('Could not adapt help text');

  return {
    Description: apiHelpText.description,
    Key: apiHelpText.key,
    Title: apiHelpText.title,
  };
}

