import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import {
  selectPagedOrganizationUnitHasValidCache,
  selectPagedOrganizationUnits,
} from 'src/app/store/organization/organization-unit/selectors';
import { BaseComponent } from '../../base/base.component';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from '../../constants/constants';
import { createNode, TreeNodeModel } from '../../models/tree-node.model';
import { filterNullish } from '../../pipes/filter-nullish';

@Component({
  selector: 'app-org-unit-select',
  templateUrl: './org-unit-select.component.html',
  styleUrls: ['./org-unit-select.component.scss'],
})
export class OrgUnitSelectComponent extends BaseComponent implements OnInit {
  @Input() public disabledUnitsUuids?: string[] = [];
  @Input() public text = '';
  @Input() public showDescription = false;
  @Input() public clearable = true;
  @Input() public disableLoading = false;

  @Input() public formGroup?: FormGroup;
  @Input() public formName?: string;
  @Input() public appendTo: string = '';
  @Input() public value?: TreeNodeModel;

  @Output() public filterChange = new EventEmitter<string | undefined>();
  @Output() public valueChange = new EventEmitter<string | undefined>();

  public readonly nodes$ = this.store.select(selectPagedOrganizationUnits).pipe(
    filterNullish(),
    map((organizationUnits) => organizationUnits.map((unit) => createNode(unit, this.disabledUnitsUuids)))
  );
  public readonly isLoaded$ = this.store
    .select(selectPagedOrganizationUnitHasValidCache)
    .pipe(map((hasValidCache) => this.disableLoading || hasValidCache));
  constructor(private readonly store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnitsPaged(BOUNDED_PAGINATION_QUERY_MAX_SIZE));
  }

  public onSelectionChange(selectedValue: TreeNodeModel | null | undefined): void {
    this.valueChange.emit(selectedValue as string | undefined);
  }
}
