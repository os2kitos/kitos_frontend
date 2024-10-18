import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIStsOrganizationOrgUnitDTO } from 'src/app/api/v2';
import { ItSystemHierarchyTableComponentStore } from 'src/app/modules/it-systems/shared/it-system-hierarchy-table/it-system-hierarchy-table.component-store';
import { mapFkOrgSnapshotUnits } from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode } from 'src/app/shared/models/structure/entity-tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectHasSnapshotFailed,
  selectIsLoadingSnapshot,
  selectSnapshot,
} from 'src/app/store/local-admin/fk-org/selectors';

@Component({
  selector: 'app-fk-org-write-dialog',
  templateUrl: './fk-org-write-dialog.component.html',
  styleUrl: './fk-org-write-dialog.component.scss',
  providers: [ItSystemHierarchyTableComponentStore],
})
export class FkOrgWriteDialogComponent implements OnInit {
  @Input() isEdit: boolean = false;

  public readonly snapshot$ = this.store.select(selectSnapshot).pipe(filterNullish());
  public readonly snapshotTree$ = this.snapshot$.pipe(map((snapshot) => mapFkOrgSnapshotUnits([snapshot])));
  public readonly isLoading$ = this.store.select(selectIsLoadingSnapshot);
  public readonly hasFailed$ = this.store.select(selectHasSnapshotFailed);

  constructor(private readonly store: Store) {}

  public title = '';
  ngOnInit(): void {
    this.store.dispatch(FkOrgActions.getSnapshot());

    this.title = this.isEdit
      ? $localize`Redigér forbindelsen til FK Organisation`
      : $localize`Opret forbindelse til FK Organisation`;
  }

  nodeExpandClick(node: EntityTreeNode<APIStsOrganizationOrgUnitDTO>): void {
    console.log('node before');
    console.log(node.isExpanded);
    node.isExpanded = !node.isExpanded;
    console.log('node after');
    console.log(node.isExpanded);
  }
}
