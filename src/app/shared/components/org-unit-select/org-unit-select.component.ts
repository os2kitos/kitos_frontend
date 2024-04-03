import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import {
  selectOrganizationUnitHasValidCache,
  selectOrganizationUnits,
} from 'src/app/store/organization-unit/selectors';
import { BaseComponent } from '../../base/base.component';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from '../../constants';
import { TreeNodeModel } from '../../models/tree-node.model';

@Component({
  selector: 'app-org-unit-select[formGroup][formName]',
  templateUrl: './org-unit-select.component.html',
  styleUrls: ['./org-unit-select.component.scss'],
})
export class OrgUnitSelectComponent extends BaseComponent implements OnInit {
  @Input() public disabledUnitsUuids?: string[] = [];
  @Input() public text = '';
  @Input() public showDescription = false;

  @Input() public formGroup!: FormGroup;
  @Input() public formName!: string;

  @Output() public filterChange = new EventEmitter<string | undefined>();
  @Output() public valueChange = new EventEmitter<string | undefined>();

  public readonly nodes$ = this.store
    .select(selectOrganizationUnits)
    .pipe(map((organizationUnits) => organizationUnits.map((unit) => this.createNode(unit))));
  public readonly isLoaded$ = this.store.select(selectOrganizationUnitHasValidCache);

  constructor(private readonly store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(BOUNDED_PAGINATION_QUERY_MAX_SIZE))
    );
  }

  public onSelectionChange(selectedValue: TreeNodeModel | null | undefined): void {
    this.valueChange.emit(selectedValue as string | undefined);
  }

  private createNode(unit: APIOrganizationUnitResponseDTO): TreeNodeModel {
    return {
      id: unit.uuid,
      name: unit.name,
      disabled: this.disabledUnitsUuids?.includes(unit.uuid),
      parentId: unit.parentOrganizationUnit?.uuid,
    } as TreeNodeModel;
  }
}
