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
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { BaseComponent } from '../../base/base.component';
import { BOUNDED_PAGINATION_QUERY_MAX_SIZE } from '../../constants';
import { TreeNodeModel } from '../../models/tree-node.model';
import { filterNullish } from '../../pipes/filter-nullish';

@Component({
  selector: 'app-org-unit-select',
  templateUrl: './org-unit-select.component.html',
  styleUrls: ['./org-unit-select.component.scss'],
})
export class OrgUnitSelectComponent extends BaseComponent implements OnInit {
  @Input() public disabledUnits?: string[] | null = null;
  @Input() public text = '';
  @Input() public showDescription = false;

  @Input() public formGroup!: FormGroup;
  @Input() public formName: string | null = null;

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public readonly nodes$ = this.store.select(selectOrganizationUnits).pipe(
    map((organizationUnits) => {
      let nodes = [] as TreeNodeModel[];
      organizationUnits
        .filter((x) => !x.parentOrganizationUnit)
        .forEach((x) => (nodes = nodes.concat(this.mapUnits(x, organizationUnits))));

      return nodes;
    })
  );
  public readonly isLoaded$ = this.store.select(selectOrganizationUnitHasValidCache);

  constructor(private readonly store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store
        .select(selectOrganizationUuid)
        .pipe(filterNullish())
        .subscribe((organizationUuid: string) =>
          this.store.dispatch(
            OrganizationUnitActions.getOrganizationUnits(organizationUuid, BOUNDED_PAGINATION_QUERY_MAX_SIZE)
          )
        )
    );
  }

  private mapUnits(
    currentUnit: APIOrganizationUnitResponseDTO,
    units: APIOrganizationUnitResponseDTO[],
    indent = 0
  ): TreeNodeModel[] {
    const node = this.createNode(currentUnit, indent);
    let newNodes = [node];
    units
      .filter((unit) => unit.parentOrganizationUnit?.uuid === currentUnit.uuid)
      .forEach((unit) => (newNodes = newNodes.concat(this.mapUnits(unit, units, indent + 1))));

    return newNodes;
  }

  private createNode(unit: APIOrganizationUnitResponseDTO, indent: number): TreeNodeModel {
    return {
      id: unit.uuid,
      name: unit.name,
      disabled: this.disabledUnits?.includes(unit.uuid),
      parentId: unit.parentOrganizationUnit?.uuid,
      indent: indent,
    } as TreeNodeModel;
  }
}
