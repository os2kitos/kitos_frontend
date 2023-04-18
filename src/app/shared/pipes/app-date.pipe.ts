import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DEFAULT_DATE_FORMAT } from '../constants';

@Pipe({
  name: 'appDate',
})
export class AppDatePipe extends DatePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override transform(value: any): any {
    return super.transform(value, DEFAULT_DATE_FORMAT);
  }
}
