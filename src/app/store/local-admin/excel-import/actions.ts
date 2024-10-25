import { createActionGroup, emptyProps } from '@ngrx/store';

export const ExcelImportActions = createActionGroup({
  source: 'ExcelImport',
  events: {
    'Excel Import': (file: FormData) => ({ file }),
    'Excel Import Success ': emptyProps(),
    'Excel Import Error': emptyProps(),
  },
});
