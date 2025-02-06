import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIPublicMessagesRequestDTO, APIPublicMessagesResponseDTO } from 'src/app/api/v2';

export const GlobalAdminPublicMessageActions = createActionGroup({
  source: 'GlobalAdminPublicMessage',
  events: {
    'Edit Public Messages': (request: APIPublicMessagesRequestDTO) => ({ request }),
    'Edit Public Messages Success': (response: APIPublicMessagesResponseDTO) => ({ response }),
    'Edit Public Messages Error': () => emptyProps(),
  },
});
