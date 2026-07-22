import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { SegmentComponent } from 'src/app/shared/components/segment/segment.component';
import {
  ItSystemUsageRelationSegmentOption,
  itSystemUsageRelationSegmentOptions,
} from 'src/app/shared/constants/it-system-usage-relations-segment-constants';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import {
  selectITSystemUsageHasModifyPermission,
  selectIsLoading,
  selectItSystemUsageName,
  selectItSystemUsageOutgoingSystemRelations,
  selectItSystemUsageUuid,
} from 'src/app/store/it-system-usage/selectors';
import {
  selectITSystemUsageEnableIncomingRelations,
  selectITSystemUsageEnableOutgoingRelations,
} from 'src/app/store/organization/ui-module-customization/selectors';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { CardHeaderComponent } from '../../../../../shared/components/card-header/card-header.component';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { CollectionExtensionButtonComponent } from '../../../../../shared/components/collection-extension-button/collection-extension-button.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { CreateRelationDialogComponent } from './create-relation-dialog/create-relation-dialog.component';
import { ItSystemUsageDetailsRelationsComponentStore } from './it-system-usage-details-relations.component-store';
import { RelationGridComponent } from './relation-table/relation-grid.component';

@Component({
  selector: 'app-it-system-usage-details-relations',
  templateUrl: './it-system-usage-details-relations.component.html',
  styleUrls: ['./it-system-usage-details-relations.component.scss'],
  providers: [ItSystemUsageDetailsRelationsComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    StandardVerticalContentGridComponent,
    RelationGridComponent,
    CollectionExtensionButtonComponent,
    LoadingComponent,
    AsyncPipe,
    SegmentComponent
],
})
export class ItSystemUsageDetailsRelationsComponent extends BaseComponent implements OnInit {
  public selected = ItSystemUsageRelationSegmentOption.Outgoing;
  public segmentOptions = itSystemUsageRelationSegmentOptions;
  public ItSystemUsageRelationSegmentOption = ItSystemUsageRelationSegmentOption;

  public readonly usageName$ = this.store.select(selectItSystemUsageName);
  public readonly usageRelations$ = this.store
    .select(selectItSystemUsageOutgoingSystemRelations)
    .pipe(
      map((outgoingRelations) =>
        outgoingRelations?.map((relation) =>
          this.componentStore.mapRelationResponseDTOToSystemRelationModel(relation, relation.toSystemUsage)
        )
      )
    );
  public readonly incomingRelations$ = this.componentStore.incomingRelations$;
  public readonly hasModifyPermission$ = this.store.select(selectITSystemUsageHasModifyPermission);

  public readonly isUsageLoading$ = this.store.select(selectIsLoading);
  public readonly isIncomingRelationsLoading$ = this.componentStore.isIncomingRelationsLoading$;

  public readonly outgoingRelationsEnabled$ = this.store.select(selectITSystemUsageEnableOutgoingRelations);
  public readonly incomingRelationsEnabled$ = this.store.select(selectITSystemUsageEnableIncomingRelations);

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsComponentStore,
    private readonly actions$: Actions,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    //get the incoming relations
    this.subscriptions.add(
      this.store
        .select(selectItSystemUsageUuid)
        .pipe(filterNullish())
        .subscribe((systemUsageUuid) => this.componentStore.getIncomingRelations(systemUsageUuid))
    );

    //on add/patch/remove success action, reload the outgoing relations
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITSystemUsageActions.addItSystemUsageRelationsSuccess,
            ITSystemUsageActions.patchItSystemUsageRelationSuccess,
            ITSystemUsageActions.removeItSystemUsageRelationSuccess
          )
        )
        .subscribe(({ itSystemUsageUuid }) => {
          this.store.dispatch(ITSystemUsageActions.getITSystemUsage(itSystemUsageUuid));
        })
    );
  }

  public onAddNew() {
    this.dialog.open(CreateRelationDialogComponent);
  }
}
