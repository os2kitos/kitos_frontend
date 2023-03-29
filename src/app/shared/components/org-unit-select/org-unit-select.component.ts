import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { APIOrganizationUnitResponseDTO } from 'src/app/api/v2';
import { OrganizationUnitActions } from 'src/app/store/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization-unit/selectors';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { filterNullish } from '../../pipes/filter-nullish';
import { TreeNodeModel } from '../tree-node-select/tree-node-select.component';

@Component({
  selector: 'app-org-unit-select',
  templateUrl: './org-unit-select.component.html',
  styleUrls: ['./org-unit-select.component.scss'],
})
export class OrgUnitSelectComponent extends BaseComponent implements OnInit {
  @Input() public disabledUnits?: string[] | null = null;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public showDescription = false;

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public nodes: Array<TreeNodeModel> = [];

  private readonly organizationUnits$ = this.store.select(selectOrganizationUnits);

  constructor(private readonly store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(filterNullish())
        .subscribe((organizationUuid) =>
          this.store.dispatch(OrganizationUnitActions.getOrganizationUnits(organizationUuid))
        )
    );

    this.subscriptions.add(
      this.organizationUnits$.pipe(filterNullish()).subscribe((organizationUnits) => {
        this.nodes = [];
        const rootUnits = organizationUnits.filter((unit) => !unit.parentOrganizationUnit);

        rootUnits.forEach((root) => (this.nodes = this.nodes.concat(this.mapHierarchy(root, organizationUnits))));
      })
    );
  }

  private mapHierarchy(
    currentUnit: APIOrganizationUnitResponseDTO,
    units: Array<APIOrganizationUnitResponseDTO>
  ): TreeNodeModel {
    const newUnit = {
      id: currentUnit.uuid,
      text: currentUnit.name,
      disabled: this.disabledUnits?.find((x) => x === currentUnit.uuid) !== null,
    } as TreeNodeModel;

    let childrenResults = [] as Array<TreeNodeModel>;
    units
      .filter((x) => x.parentOrganizationUnit?.uuid === currentUnit.uuid)
      .forEach((newUnit) => {
        childrenResults = childrenResults.concat(this.mapHierarchy(newUnit, units));
      });

    newUnit.children = childrenResults;
    return newUnit;
  }
}
