import { Injectable } from '@angular/core';
import { NO_TEXT, YES_TEXT } from '../constants/constants';
import { validateUrl } from '../helpers/link.helpers';
import { GridColumn } from '../models/grid-column.model';
import { OverviewAuditModel } from '../models/it-contract/audit-model';
import { AppDatePipe } from '../pipes/app-date.pipe';

@Injectable({
  providedIn: 'root',
})
export class GridExportService {
  constructor(private appDatePipe: AppDatePipe) {}

  /**
   * @param item An item representing a row in the grid
   * @param exportColumns The columns to be exported
   * @returns The row with the column values transformed into something appropriate for the export
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  public transformRow(item: any, exportColumns: GridColumn[]): any {
    const transformedItem = { ...item };
    exportColumns.forEach((column) => {
      const field = column.field;
      if (field) {
        switch (column.style) {
          case 'chip':
            if (typeof transformedItem[field] === 'boolean') {
              const boolValue = transformedItem[field] ? 0 : 1;
              transformedItem[field] = column.extraData[boolValue].name;
            }
            break;
          case 'enum':
            if (typeof transformedItem[field] === 'object') {
              const enumValue = transformedItem[field];
              transformedItem[field] = enumValue.name;
            }
            break;
          case 'boolean':
            {
              transformedItem[field] = transformedItem[field] ? YES_TEXT : NO_TEXT;
            }
            break;
          case 'uuid-to-name':
            transformedItem[field] = transformedItem[`${column.dataField}`];
            break;
          case 'excel-only': {
            if (transformedItem.RoleEmails) {
              const roleEmailKeys: string[] = Object.keys(transformedItem.RoleEmails);
              roleEmailKeys.forEach((key) => {
                const prefixedKey = `Roles.${key}`;
                if (prefixedKey === field) {
                  transformedItem[`${column.title}`] = transformedItem.RoleEmails[key];
                }
              });
            }
            break;
          }
          case 'page-link-array':
            {
              const array = transformedItem[column.dataField as string];
              const excelValue = array.map((item: { value: string }) => item.value).join(', ');
              transformedItem[field] = excelValue;
            }
            break;
          case 'usages':
            {
              const usages = transformedItem[column.field as string];
              transformedItem[field] = usages.length;
            }
            break;
          case 'title-link':
            {
              const url = transformedItem[column.idField ?? ''];
              const exportValue = validateUrl(url) ? url : transformedItem[field];
              transformedItem[field] = exportValue;
            }
            break;
          case 'date':
            {
              const date = transformedItem[field] as Date;
              transformedItem[field] = this.appDatePipe.transform(date) ?? '';
            }
            break;
          case 'contract-audit':
            {
              const audit = transformedItem[field] as OverviewAuditModel;

              transformedItem[field] =
                audit.total === 0
                  ? ''
                  : $localize`Hvid: ${audit.white}, Rød: ${audit.red}, Gul: ${audit.yellow}, Grøn: ${audit.green}, Max: ${audit.total}`;
            }
            break;
          default:
            break;
        }
      }
    });
    return transformedItem;
  }
}
