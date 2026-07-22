import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationOData } from 'src/app/shared/models/organization/organization-odata.model';
import { ClipboardService } from 'src/app/shared/services/clipboard.service';
import { ConfirmActionCategory, ConfirmActionService } from 'src/app/shared/services/confirm-action.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
import { CheckboxComponent } from '../../../../../shared/components/checkbox/checkbox.component';
import { DialogActionsComponent } from '../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ScrollbarDialogComponent } from '../../../../../shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { ParagraphComponent } from '../../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { DeleteOrganizationComponentStore } from './delete-organization.component-store';
import {
  RemovalConflict,
  RemovalConflictTableComponent,
  RemovalConflictType,
} from './removal-conflict-table/removal-conflict-table.component';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './delete-organization-dialog.component.html',
  styleUrl: './delete-organization-dialog.component.scss',
  providers: [DeleteOrganizationComponentStore],
  imports: [
    ScrollbarDialogComponent,
    LoadingComponent,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    RemovalConflictTableComponent,
    DialogActionsComponent,
    CheckboxComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class DeleteOrganizationDialogComponent extends BaseComponent implements OnInit {
  @Input() public organization!: OrganizationOData;

  public hasAcceptedConsequences: boolean = false;
  public isCopying: boolean = false;

  public readonly removalConflicts$ = this.componentStore.removalConflicts$;
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly usingOrganizations$ = this.componentStore.usingOrganizations$;
  public readonly simpleConflictTypeOptions: RemovalConflictType[] = [
    'contracts',
    'dprDataprocessor',
    'dprSubDataprocessor',
  ];
  public readonly otherConflictTypeOptions: RemovalConflictType[] = [
    'systemsRightsHolder',
    'systemsExposingInterfaces',
    'systemsParentSystem',
    'systemsUsages',
    'systemsArchiveSupplier',
    'interfaces',
  ];

  public readonly deletingOrganization$ = new BehaviorSubject<boolean>(false);
  public isSupplier = false;
  public hasNoUsingOrganizations$ = this.usingOrganizations$.pipe(
    map((usingOrganizations) => !this.isSupplier || usingOrganizations?.length === 0),
  );
  public readonly conflictContentId = 'conflict-content';

  constructor(
    private dialogRef: MatDialogRef<DeleteOrganizationDialogComponent>,
    private componentStore: DeleteOrganizationComponentStore,
    private confirmActionService: ConfirmActionService,
    private actions$: Actions,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private clipboardService: ClipboardService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.isSupplier = this.organization.IsSupplier ?? false;
    this.componentStore.getConsequences(of(this.organization.Uuid));
    if (this.isSupplier) this.componentStore.getUsingOrganizations(of(this.organization.Uuid));

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationActions.deleteOrganizationSuccess)).subscribe(() => {
        this.deletingOrganization$.next(false);
        this.onCancel();
      }),
    );

    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationActions.deleteOrganizationError)).subscribe(() => {
        this.deletingOrganization$.next(false);
      }),
    );
  }

  public onDelete(): void {
    this.confirmActionService.confirmAction({
      category: ConfirmActionCategory.Warning,
      message: $localize`Er du sikker på at du vil slette "${this.organization.Name}"?`,
      onConfirm: () => {
        this.deletingOrganization$.next(true);
        this.store.dispatch(OrganizationActions.deleteOrganization(this.organization.Uuid));
      },
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public hasAnyRemovalConflict(): Observable<boolean | undefined> {
    return this.componentStore.hasConflicts(this.simpleConflictTypeOptions.concat(this.otherConflictTypeOptions));
  }

  public hasOtherTypeConflicts(): Observable<boolean | undefined> {
    return this.componentStore.hasConflicts(this.otherConflictTypeOptions);
  }

  public getTitle(): string {
    return $localize`Slet "${this.organization.Name}"`;
  }

  public copyConflictsToClipboard(): void {
    this.isCopying = true;
    this.cdr.detectChanges();
    this.clipboardService.copyContentToClipBoardById(this.conflictContentId);
    this.isCopying = false;
    this.notificationService.showDefault($localize`Konsekvenserne er kopieret til udklipsholderen`);
  }

  public canSubmit(): Observable<boolean> {
    return this.hasAnyRemovalConflict().pipe(
      map((hasConflicts) => {
        return hasConflicts === false || this.hasAcceptedConsequences;
      }),
    );
  }

  public typeHasConflicts(conflicType: RemovalConflictType): Observable<boolean> {
    return this.componentStore.typeHasConflicts(conflicType);
  }

  public getSpecificConflicts(type: RemovalConflictType): Observable<RemovalConflict[]> {
    return this.componentStore.getSpecificConflicts(type);
  }
}
