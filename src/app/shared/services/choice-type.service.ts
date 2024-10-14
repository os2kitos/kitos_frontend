import { Injectable } from '@angular/core';
import {
  ChoiceTypeTableItem,
  ChoiceTypeTableOption,
} from '../components/choice-type-table/choice-type-table.component';

@Injectable({
  providedIn: 'root',
})
export class ChoiceTypeService {
  public updateChoiceType(choiceTypeItem: ChoiceTypeTableItem, type: ChoiceTypeTableOption): void {
    console.log('Updating choice type item', choiceTypeItem, 'of type', type);
  }
}
