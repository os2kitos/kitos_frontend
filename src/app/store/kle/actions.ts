import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIKLEDetailsDTO, APIKLEStatusResponseDTO } from 'src/app/api/v2';

export const KLEActions = createActionGroup({
  source: 'KLE',
  events: {
    'Get KLEs': emptyProps(),
    'Get KLEs Success': (kles: APIKLEDetailsDTO[]) => ({
      kles,
    }),
    'Get KLEs Error': emptyProps(),

    'Get Admin KLE Status': emptyProps(),
    'Get Admin KLE Status Success': (status: APIKLEStatusResponseDTO) => ({
      status,
    }),
    'Get Admin KLE Status Error': emptyProps(),
    'Update Admin KLE': emptyProps(),
    'Update Admin KLE Success': emptyProps(),
    'Update Admin KLE Error': emptyProps(),
    'Get Admin KLE file': emptyProps(),
    'Get Admin KLE file Success': emptyProps(),
    'Get Admin KLE file Error': emptyProps(),
  },
});
