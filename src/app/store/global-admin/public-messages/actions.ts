import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIPublicMessageRequestDTO, APIPublicMessageResponseDTO } from 'src/app/api/v2';

export const GlobalAdminPublicMessageActions = createActionGroup({
  source: 'GlobalAdminPublicMessage',
  events: {
    'Edit Public Messages': (messageUuid: string, request: APIPublicMessageRequestDTO) => ({ messageUuid, request }),
    'Edit Public Messages Success': (response: APIPublicMessageResponseDTO) => ({ response }),
    'Edit Public Messages Error': () => emptyProps(),
  },
});
