import { Injectable } from '@angular/core';
import {
  ChoiceTypeTableItem,
  ChoiceTypeTableOption,
} from '../components/choice-type-table/choice-type-table.component';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';

@Injectable({
  providedIn: 'root',
})
export class ChoiceTypeService {
  public updateChoiceType(choiceTypeItem: ChoiceTypeTableItem, type: ChoiceTypeTableOption): void {
    console.log('Updating choice type item', choiceTypeItem, 'of type', type);
  }

  public getItemsSuccessAction(type: ChoiceTypeTableOption) {
    switch (type) {
      case 'organization-unit':
        return OrganizationUnitActions.addOrganizationUnitRoleSuccess; //TODO
      default:
        throw new Error(`This component does not support entity type: ${type}`);
    }
  }
}
