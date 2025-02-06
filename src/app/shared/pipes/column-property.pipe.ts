import { Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
  name: 'searchProperty',
  pure: true,
})
export class SearchPropertyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(object: any, property: string): any {
    return get(object, property);
  }
}
