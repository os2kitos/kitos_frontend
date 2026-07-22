import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { first, Observable } from 'rxjs';
import { APIIdentityNamePairResponseDTO, APIRegularOptionResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { addExpiredText } from 'src/app/shared/helpers/option-type.helper';
import { createGridActionColumn } from 'src/app/shared/models/grid-action-column.model';
import { GridColumn } from 'src/app/shared/models/grid-column.model';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { RegularOptionTypeActions } from 'src/app/store/regular-option-type-store/actions';
import { selectRegularOptionTypesDictionary } from 'src/app/store/regular-option-type-store/selectors';
import { EmptyStateComponent } from '../../../../../../shared/components/empty-states/empty-state.component';
import { LocalGridComponent } from '../../../../../../shared/components/local-grid/local-grid.component';
import { StandardVerticalContentGridComponent } from '../../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ModifyRelationDialogComponent } from '../modify-relation-dialog/modify-relation-dialog.component';

export interface SystemRelationModel {
  uuid: string;
  systemUsage: APIIdentityNamePairResponseDTO;
  relationInterface?: APIIdentityNamePairResponseDTO;
  associatedContract?: APIIdentityNamePairResponseDTO;
  relationFrequency?: APIIdentityNamePairResponseDTO;
  description?: string;
  urlReference?: string;
}

@Component({
  selector: 'app-relation-grid[relations][emptyText]',
  templateUrl: './relation-grid.component.html',
  styleUrls: ['./relation-grid.component.scss'],
  imports: [StandardVerticalContentGridComponent, CommonModule, LocalGridComponent, EmptyStateComponent],
})
export class RelationGridComponent extends BaseComponent implements OnInit {
  @Input() public relations!: Array<SystemRelationModel>;
  @Input() public isOutgoing = false;
  @Input() public emptyText!: string;
  @Input() public modifyPermissions$!: Observable<boolean | undefined>;
  @Input() public hasModifyPermissions = false;

  public isLoading = true;
  public processedRelations: Array<SystemRelationModel> = [];
  public columns: GridColumn[] = [
    {
      field: 'systemUsage.name',
      idField: 'systemUsage.uuid',
      title: $localize`It System`,
      hidden: false,
      entityType: 'it-system-usage',
      style: 'page-link',
      width: 200,
      extraData: 'system-relations',
    },
    {
      field: 'relationInterface.name',
      idField: 'relationInterface.uuid',
      title: $localize`Snitflade`,
      hidden: false,
      entityType: 'it-interface',
      style: 'page-link',
      width: 150,
    },
    {
      field: 'description',
      title: $localize`Beskrivelse`,
      hidden: false,
      width: 200,
    },
    {
      field: 'urlReference',
      title: $localize`Reference`,
      hidden: false,
      style: 'link',
      width: 150,
    },
    {
      field: 'associatedContract.name',
      idField: 'associatedContract.uuid',
      title: $localize`Kontrakt`,
      hidden: false,
      entityType: 'it-contract',
      style: 'page-link',
      width: 150,
    },
    {
      field: 'relationFrequency.uuid',
      dataField: 'relationFrequency.name',
      title: $localize`Frekvens`,
      hidden: false,
      style: 'uuid-to-name',
      extraFilter: 'choice-type',
      extraData: 'it-system_usage-relation-frequency-type',
      width: 150,
    },
    createGridActionColumn(['edit', 'delete']),
  ];

  private readonly availableReferenceFrequencyTypes$ = this.store
    .select(selectRegularOptionTypesDictionary('it-system_usage-relation-frequency-type'))
    .pipe(filterNullish());

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.store.dispatch(RegularOptionTypeActions.getOptions('it-system_usage-relation-frequency-type'));

    this.subscriptions.add(
      this.availableReferenceFrequencyTypes$.subscribe(() => {
        this.processExpiredFrequencyTypes();
      }),
    );
  }

  private processExpiredFrequencyTypes(): void {
    this.subscriptions.add(
      this.availableReferenceFrequencyTypes$.subscribe((availableReferenceFrequencyTypes) => {
        if (availableReferenceFrequencyTypes && this.relations) {
          this.processedRelations = this.mapRelationNames(availableReferenceFrequencyTypes);
        } else {
          this.processedRelations = this.relations || [];
        }
      }),
    );
  }

  public onModify(relation: SystemRelationModel) {
    const modifyDialogRef = this.dialog.open(ModifyRelationDialogComponent);
    const modifyDialogInstance = modifyDialogRef.componentInstance as ModifyRelationDialogComponent;
    modifyDialogInstance.relationModel = relation;
  }

  public onDelete(relation: SystemRelationModel) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogInstance = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogInstance.bodyText = $localize`Er du sikker på at du vil fjerne denne relation`;
    confirmationDialogInstance.confirmColor = 'warn';

    confirmationDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result === true) {
          this.store.dispatch(ITSystemUsageActions.removeItSystemUsageRelation(relation.uuid));
        }
      });
  }

  private mapRelationNames(availableReferenceFrequencyTypes: Dictionary<APIRegularOptionResponseDTO>) {
    return this.relations.map((relation) => {
      if (relation.relationFrequency) {
        const availableTypes = Object.values(availableReferenceFrequencyTypes);
        const isAvailable = availableTypes.some((type) => type?.uuid === relation.relationFrequency?.uuid);

        if (!isAvailable && relation.relationFrequency.name) {
          return {
            ...relation,
            relationFrequency: {
              ...relation.relationFrequency,
              name: addExpiredText(relation.relationFrequency.name),
            },
          };
        }
      }
      return relation;
    });
  }
}
