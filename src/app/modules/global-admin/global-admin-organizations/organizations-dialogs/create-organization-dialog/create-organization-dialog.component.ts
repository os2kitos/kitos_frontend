import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first } from 'rxjs';
import { APIOrganizationCreateRequestDTO } from 'src/app/api/v2';
import { mapOrgTypeToDtoType } from 'src/app/shared/helpers/organization-type.helpers';
import {
  defaultOrganizationType,
  OrganizationType,
  organizationTypeOptions,
} from 'src/app/shared/models/organization/organization-odata.model';
import { cvrValidator } from 'src/app/shared/validators/cvr.validator';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { OrganizationsDialogComponentStore } from '../organizations-dialog.component-store';
import { ShallowOptionType } from 'src/app/shared/models/options/option-type.model';
import { GlobalAdminOrganizationsDialogBaseComponent } from '../global-admin-organizations-dialog-base.component';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrl: './create-organization-dialog.component.scss',
  providers: [OrganizationsDialogComponentStore],
})
export class CreateOrganizationDialogComponent extends GlobalAdminOrganizationsDialogBaseComponent implements OnInit {
  public readonly organizationTypeOptions = organizationTypeOptions;
  public formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    cvr: new FormControl<string | undefined>(undefined, cvrValidator()),
    organizationType: new FormControl<OrganizationType>(defaultOrganizationType, Validators.required),
    foreignCountryCode: new FormControl<ShallowOptionType | undefined>(undefined),
  });

  public isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private dialogRef: MatDialogRef<CreateOrganizationDialogComponent>,
    private store: Store,
    private actions$: Actions,
    componentStore: OrganizationsDialogComponentStore
  ) {
    super(componentStore);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.componentStore.getCountryCodes();

    this.actions$
      .pipe(ofType(OrganizationActions.createOrganizationSuccess, OrganizationActions.createOrganizationError))
      .subscribe(() => {
        this.isLoading$.next(false);
      });
  }

  public onCreateOrganization(): void {
    this.actions$.pipe(ofType(OrganizationActions.createOrganizationSuccess), first()).subscribe(() => {
      this.onCancel();
    });

    const request = this.getRequest();
    this.isLoading$.next(true);
    this.store.dispatch(OrganizationActions.createOrganization(request));
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  private getRequest(): APIOrganizationCreateRequestDTO {
    const formValue = this.formGroup.value;
    const type = formValue.organizationType ? formValue.organizationType : defaultOrganizationType;
    return {
      name: formValue.name ?? '',
      cvr: formValue.cvr ?? undefined,
      type: mapOrgTypeToDtoType(type.value),
      foreignCountryCodeUuid: formValue.foreignCountryCode?.uuid ?? undefined,
    };
  }
}
