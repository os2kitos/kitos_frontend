import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DataProcessingActions } from 'src/app/store/data-processing/actions';
import { ITContractActions } from 'src/app/store/it-contract/actions';
import { ITInterfaceActions } from 'src/app/store/it-system-interfaces/actions';
import { ITSystemActions } from 'src/app/store/it-system/actions';
import { BaseComponent } from '../../base/base.component';
import { AppPath } from '../../enums/app-path';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { CreateEntityDialogComponentStore } from './create-entity-dialog.component-store';

@Component({ template: '' })
export class BaseCreateEntityDialogComponent extends BaseComponent implements OnInit {
  @Input() public entityType!: RegistrationEntityTypes;
  @Input() public title!: string;

  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;

  constructor(
    protected store: Store,
    protected actions$: Actions,
    protected router: Router,
    protected dialogRef: MatDialogRef<BaseCreateEntityDialogComponent>,
    protected componentStore: CreateEntityDialogComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$
        .pipe(
          ofType(
            ITContractActions.createItContractSuccess,
            ITSystemActions.createItSystemSuccess,
            ITInterfaceActions.createITInterfaceSuccess,
            DataProcessingActions.createDataProcessingSuccess
          )
        )
        .subscribe(({ uuid, openAfterCreate }) => {
          if (openAfterCreate) {
            this.navigateToRoute(uuid);
          }
          this.onCancel();
        })
    );
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private navigateToRoute(uuid: string): void {
    switch (this.entityType) {
      case 'it-contract':
        this.router.navigate([`${AppPath.itContracts}/${uuid}`]);
        break;
      case 'it-system':
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itSystemCatalog}/${uuid}`]);
        break;
      case 'it-interface':
        this.router.navigate([`${AppPath.itSystems}/${AppPath.itInterfaces}/${uuid}`]);
        break;
      case 'data-processing-registration':
        this.router.navigate([`${AppPath.dataProcessing}/${uuid}`]);
        break;
      default:
        throw `Navigate to entity after creation of type: ${this.entityType} is not implemented`;
    }
  }
}
