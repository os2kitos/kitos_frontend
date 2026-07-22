import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, filter, first, map } from 'rxjs';
import { APIIdentityNamePairResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { MAX_INTEGER } from 'src/app/shared/constants/constants';
import { mapUnitsWithSelectedUnitsToTree } from 'src/app/shared/helpers/hierarchy.helpers';
import { EntityTreeNode } from 'src/app/shared/models/structure/entity-tree-node.model';
import { TreeNodeModel } from 'src/app/shared/models/tree-node.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectItSystemUsageIsPatching,
  selectItSystemUsageResponsibleUnit,
  selectItSystemUsageUsingOrganizationUnits,
} from 'src/app/store/it-system-usage/selectors';
import { OrganizationUnitActions } from 'src/app/store/organization/organization-unit/actions';
import { selectOrganizationUnits } from 'src/app/store/organization/organization-unit/selectors';
import { CheckboxButtonComponent } from '../../../../../shared/components/buttons/checkbox-button/checkbox-button.component';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { DragAndDropTreeComponent } from '../../../../../shared/components/drag-and-drop-tree/drag-and-drop-tree.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { NumericInputComponent } from '../../../../../shared/components/numeric-input/numeric-input.component';
import { OrgUnitSelectComponent } from '../../../../../shared/components/org-unit-select/org-unit-select.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { SectionComponent } from '../../../../../shared/components/section/section.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';

@Component({
  selector: 'app-it-system-usage-details-organization',
  templateUrl: './it-system-usage-details-organization.component.html',
  styleUrls: ['./it-system-usage-details-organization.component.scss'],
  imports: [
    CardComponent,
    CardHeaderComponent,
    ParagraphComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    StandardVerticalContentGridComponent,
    SectionComponent,
    OrgUnitSelectComponent,
    LoadingComponent,
    NumericInputComponent,
    CheckboxButtonComponent,
    DragAndDropTreeComponent,
    AsyncPipe
],
})
export class ItSystemUsageDetailsOrganizationComponent extends BaseComponent implements OnInit {
  public readonly responsibleUnit$ = this.store.select(selectItSystemUsageResponsibleUnit);
  public readonly usedByUnits$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(filterNullish());
  public readonly anyUsedByUnits$ = this.usedByUnits$.pipe(matchEmptyArray(), invertBooleanValue());

  public readonly usedUnitUuids$ = this.store.select(selectItSystemUsageUsingOrganizationUnits).pipe(
    filterNullish(),
    map((units) => {
      return units.map((x) => x.uuid);
    })
  );
  private expandedUnitUuids: string[] | undefined = undefined;

  public readonly hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);
  public readonly isPatching$ = this.store.select(selectItSystemUsageIsPatching);

  public readonly organizationUnits$ = this.store.select(selectOrganizationUnits);
  public readonly unitTree$ = this.organizationUnits$.pipe(
    combineLatestWith(this.usedUnitUuids$),
    map(([units, selectedUuids]) => mapUnitsWithSelectedUnitsToTree(units, selectedUuids, this.expandedUnitUuids))
  );

  public readonly rootUnitUuid$ = this.unitTree$.pipe(
    map((units) => units.filter((unit) => unit.isRoot)),
    filter((rootUnits) => rootUnits.length > 0),
    map((rootUnits) => rootUnits[0].uuid)
  );

  public readonly numberOfLevels$ = new BehaviorSubject<number | undefined>(undefined);

  public readonly responsibleUnitForm = new FormGroup({
    responsibleUnit: new FormControl<APIIdentityNamePairResponseDTO | undefined>(undefined),
  });

  public readonly relevantUnitsForm = new FormGroup({
    relevantUnit: new FormControl<TreeNodeModel | undefined>(undefined),
  });
  public includeParents = false;

  constructor(private readonly store: Store) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(OrganizationUnitActions.getOrganizationUnits());

    this.subscriptions.add(
      this.responsibleUnit$.pipe(combineLatestWith(this.usedByUnits$)).subscribe(([responsibleUnit, usedByUnits]) =>
        this.responsibleUnitForm.patchValue({
          responsibleUnit: usedByUnits.filter((unit) => unit.uuid === responsibleUnit?.uuid).pop(),
        })
      )
    );

    // Disable forms if user does not have rights to modify
    this.subscriptions.add(
      this.hasModifyPermission$.pipe(filter((hasModifyPermission) => hasModifyPermission === false)).subscribe(() => {
        this.responsibleUnitForm.disable();
        this.relevantUnitsForm.disable();
      })
    );

    this.subscriptions.add(
      this.unitTree$
        .pipe(
          filter((unitTree) => unitTree.length > 0),
          first()
        )
        .subscribe((unitTree) => {
          this.expandedUnitUuids = this.searchUnitTreeForExpandedUnits(unitTree);
        })
    );
  }

  public nodeExpandClick(node: EntityTreeNode<APIIdentityNamePairResponseDTO>): void {
    node.isExpanded = !node.isExpanded;

    const nodeUuid = node.uuid;
    if (node.isExpanded) {
      // Add the unitUuid if it's not already in the array
      if (!this.expandedUnitUuids?.includes(nodeUuid)) {
        this.expandedUnitUuids?.push(nodeUuid);
      }
    } else {
      // Remove the unitUuid if it exists in the array
      this.expandedUnitUuids = this.expandedUnitUuids?.filter((uuid) => uuid !== nodeUuid);
    }
  }

  public patchResponsibleUnit(uuid?: string) {
    this.store.dispatch(
      ITSystemUsageActions.patchITSystemUsage({
        organizationUsage: {
          responsibleOrganizationUnitUuid: uuid,
        },
      })
    );
  }

  public onUnitChange(unit: EntityTreeNode<APIIdentityNamePairResponseDTO>) {
    this.usedUnitUuids$.pipe(first()).subscribe((unitUuids) => {
      if (unitUuids.includes(unit.uuid)) {
        this.deleteUsedByUnit(unit);
        return;
      }

      this.onSave(unit.uuid);
    });
  }

  public patchRelevantUnits() {
    const uuid = this.relevantUnitsForm.controls.relevantUnit?.value?.id;
    if (!uuid) return;

    this.onSave(uuid);

    this.relevantUnitsForm.controls.relevantUnit.reset();
  }

  public levelChange(level: number | undefined) {
    if (level) {
      this.numberOfLevels$.next(level);
      return;
    }
    if (level === 0) {
      this.numberOfLevels$.next(1);
      return;
    }

    this.numberOfLevels$.next(MAX_INTEGER);
  }

  private onSave(selectedUnitUuid: string) {
    this.store.dispatch(ITSystemUsageActions.addITSystemUsageUsingUnit(selectedUnitUuid, this.includeParents));
  }

  private deleteUsedByUnit(unit: APIIdentityNamePairResponseDTO) {
    this.store.dispatch(ITSystemUsageActions.removeITSystemUsageUsingUnit(unit.uuid, this.includeParents));
  }

  private searchUnitTreeForExpandedUnits(unitTree: EntityTreeNode<never>[]): string[] {
    let expandedUuids: string[] = [];
    unitTree.forEach((unit) => {
      if (unit.isExpanded) {
        expandedUuids.push(unit.uuid);
      }

      if (unit.children.length > 0) {
        expandedUuids = expandedUuids.concat(this.searchUnitTreeForExpandedUnits(unit.children));
      }
    });

    return expandedUuids;
  }
}
