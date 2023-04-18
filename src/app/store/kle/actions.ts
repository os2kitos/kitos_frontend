import { createActionGroup, emptyProps } from '@ngrx/store';
import { APIKLEDetailsDTO } from 'src/app/api/v2';

export const KLEActions = createActionGroup({
  source: 'KLE',
  events: {
    'Get KLEs': emptyProps(),
    'Get KLEs Success': (kles: APIKLEDetailsDTO[]) => ({
      kles,
    }),
    'Get KLEs Error': emptyProps(),
  },
});
