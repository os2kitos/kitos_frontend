import { Injectable } from '@angular/core';
import { NO_TEXT, YES_TEXT } from '../constants/constants';
import { toCommaSeparatedString } from '../helpers/array.helpers';
import { validateHttpUrl } from '../helpers/link.helpers';
import { GridColumn } from '../models/grid-column.model';
import { OverviewAuditModel } from '../models/it-contract/audit-model';
import { AppDatePipe } from '../pipes/app-date.pipe';

@Injectable({
  providedIn: 'root',
})
export class GridExportService {
  constructor(private appDatePipe: AppDatePipe) {}

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleChipField(column: GridColumn, transformedItem: any) {
    const isReverse = column.style === 'reverse-chip';
    const trueIndex = isReverse ? 1 : 0;
    const falseIndex = isReverse ? 0 : 1;
    return transformedItem[column.field] ? column.extraData[trueIndex].name : column.extraData[falseIndex].name;
  }
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
              transformedItem[field] = this.handleChipField(column, transformedItem);
            }
            break;
          case 'reverse-chip':
            if (typeof transformedItem[field] === 'boolean') {
              transformedItem[field] = this.handleChipField(column, transformedItem);
            }
            break;
          case 'enum':
            if (typeof transformedItem[field] === 'object') {
              const enumValue = transformedItem[field];
              transformedItem[field] = enumValue.name;
            }
            break;
          case 'enum-array':
            if (Array.isArray(transformedItem[field])) {
              const enumArray = transformedItem[field];
              const enumNamesCsv = toCommaSeparatedString(enumArray.map((enumItem) => enumItem.name));
              transformedItem[field] = enumNamesCsv;
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
          case 'role-excel-only': {
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
              const excelValue = toCommaSeparatedString(array.map((item: { value: string }) => item.value));
              transformedItem[field] = excelValue;
            }
            break;
          case 'usages':
            {
              const usages = transformedItem[column.field as string];
              // Set the count for the main field
              transformedItem[field] = usages.length;

              // Create a separate field for the names
              const namesField = `${field}Names`;
              const usageNames = toCommaSeparatedString(usages.map((usage: any) => usage.name));
              transformedItem[namesField] = usageNames;
            }
            break;
          case 'title-link':
            {
              const url = transformedItem[column.idField ?? ''];
              const exportValue = validateHttpUrl(url) ? url : transformedItem[field];
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
