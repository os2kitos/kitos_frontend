import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIHelpTextCreateRequestDTO } from 'src/app/api/v2/model/helpTextCreateRequestDTO';
import { APIHelpTextUpdateRequestDTO } from 'src/app/api/v2/model/helpTextUpdateRequestDTO';
import { HelpText } from 'src/app/shared/models/help-text.model';

export const HelpTextActions = createActionGroup({
  source: 'HelpText',
  events: {
    'Get Help Texts': emptyProps(),
    'Get Help Texts success': (helpTexts: HelpText[]) => ({ helpTexts }),
    'Get Help Texts error': emptyProps(),

    'Update Help Text': (key: string, request: APIHelpTextUpdateRequestDTO) => ({ key, request }),
    'Update Help Text Success': (helpText: HelpText) => ({ helpText }),
    'Update Help Text Error': () => emptyProps(),

    'Create Help Text': (request: APIHelpTextCreateRequestDTO) => ({ request }),
    'Create Help Text Success': (helpText: HelpText) => ({ helpText }),
    'Create Help Text Error': () => emptyProps(),

    'Delete Help Text': (key: string) => ({ key }),
    'Delete Help Text Success': () => emptyProps(),
    'Delete Help Text Error': () => emptyProps(),
  },
});
