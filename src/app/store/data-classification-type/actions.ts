import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIRegularOptionExtendedResponseDTO } from 'src/app/api/v2';

export const DataClassificationTypeActions = createActionGroup({
  source: 'DataClassificationType',
  events: {
    'Get data classification types': emptyProps(),
    'Get data classification types Success': (dataClassificationTypes: APIRegularOptionExtendedResponseDTO[]) => ({
      dataClassificationTypes,
    }),
    'Get data classification types Error': emptyProps(),
  },
});
