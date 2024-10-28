import { createActionGroup, emptyProps } from '@ngrx/store';
import { ExcelImportTypes } from 'src/app/shared/models/excel/excel-import-types.model';

export const ExcelImportActions = createActionGroup({
  source: 'ExcelImport',
  events: {
    'Excel Import': (file: FormData, importType: ExcelImportTypes) => ({ file, importType }),
    'Excel Import Success ': emptyProps(),
    'Excel Import Error': emptyProps(),
  },
});
