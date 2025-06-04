/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, first, map, Observable } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  BulkActionButton,
  BulkActionOption,
  BulkActionResult,
  BulkActionSection,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { mapArray } from 'src/app/shared/helpers/observable-helpers';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { selectItContractUuid } from 'src/app/store/it-contract/selectors';
import { ItContractHierarchyComponentStore } from '../it-contract-hierarchy/it-contract-hierarchy.component-store';
import { NgIf, AsyncPipe } from '@angular/common';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-delete-contract-dialog',
  templateUrl: './delete-contract-dialog.component.html',
  styleUrl: './delete-contract-dialog.component.scss',
  providers: [ItContractHierarchyComponentStore],
  imports: [
    NgIf,
    DialogComponent,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class DeleteContractDialogComponent extends BaseComponent implements OnInit {
  public readonly subHierarchy$ = this.componentStore.subHierarchy$;
  public readonly contractUuid$ = this.store.select(selectItContractUuid).pipe(filterNullish());

  public isLoading = false;

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItContractHierarchyComponentStore,
    private readonly dialog: MatDialog,
    private readonly openerService: DialogOpenerService,
    private readonly actions$: Actions,
    private readonly confirmationService: ConfirmActionService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getSubHierarchy(this.contractUuid$);

    this.subscriptions.add(
      this.actions$.pipe(ofType(ITContractActions.deleteITContractError)).subscribe(() => {
        this.isLoading = false;
      }),
    );
  }

  public openTransferDialog(contractUuid: string): void {
    const dialogRef = this.setupDialog(contractUuid);

    this.subscriptions.add(
      this.subHierarchy$
        .pipe(
          filter((hierarchy) => hierarchy.length <= 1),
          first(),
        )
        .subscribe(() => dialogRef.close()),
    );
  }

  public getHierarchy$(contractUuid: string): Observable<BulkActionOption[]> {
    return this.subHierarchy$.pipe(
      map((hierarchy) =>
        hierarchy
          .filter((node) => node.node.uuid !== contractUuid)
          .map((node) => ({
            id: node.node.uuid,
            name: node.node.name,
            secondaryName: node.parent?.name,
          })),
      ),
    );
  }

  public cancel() {
    this.dialog.closeAll();
  }

  public confirm() {
    this.subHierarchy$.pipe(first()).subscribe((hierarchy) => {
      if (hierarchy?.length <= 1) {
        this.store.dispatch(ITContractActions.deleteITContract());
        return;
      }

      this.confirmationService.confirmAction({
        category: ConfirmActionCategory.Warning,
        message: $localize`Er du sikker på at du vil slette kontrakten, samt dens underordnede kontrakter?`,
        onConfirm: () => {
          this.isLoading = true;
          return this.store.dispatch(ITContractActions.deleteITContract());
        },
      });
    });
  }

  private transferSelectedContracts(result: BulkActionResult, contractUuid: string) {
    const request = {
      currentParentUuid: contractUuid,
      parentUuid: result.selectedEntityId,
      uuids: result.selectedOptions['it-contract'].map((option) => option.id.toString()),
    };

    this.componentStore.sendTransferRequest(request);
  }

  private setupDialog(contractUuid: string) {
    const dialogRef = this.openerService.openBulkActionDialog();

    const dialogActions = [
      {
        text: $localize`Overfør`,
        color: 'secondary',
        buttonStyle: 'secondary',
        callback: (result) => this.transferSelectedContracts(result, contractUuid),
      },
    ] as BulkActionButton[];

    const dialogSections = [
      {
        options$: this.getHierarchy$(contractUuid),
        entityType: 'it-contract',
        title: $localize`Underordnet kontrakter`,
        primaryColumnTitle: $localize`Kontrakt`,
        secondaryColumnTitle: $localize`Overordnet kontrakt`,
      },
    ] as BulkActionSection[];

    const instance = dialogRef.componentInstance;
    instance.title = $localize`Overfør kontrakter`;
    instance.emptyStateText = $localize`Der er ikke flere kontrakter at overføre`;
    instance.snackbarText = $localize`Vælg handling for kontrakter`;
    instance.sections = dialogSections;
    instance.actionButtons = dialogActions;
    instance.dropdownTitle = $localize`Overordnet kontrakt`;
    instance.dropdownDisabledUuids$ = this.subHierarchy$.pipe(mapArray((node) => node.node.uuid));
    instance.dropdownType = 'it-contract';
    instance.allowEmptyDropdownSelection = true;
    instance.requireConfirmation = true;
    instance.successActionTypes = ITContractActions.transferContractsSuccess;
    instance.errorActionTypes = ITContractActions.transferContractsError;

    return dialogRef;
  }
}
