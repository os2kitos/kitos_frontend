import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first } from 'rxjs';
import { APIOrganizationUpdateRequestDTO } from 'src/app/api/v2';
import { mapOrgTypeToDtoType } from 'src/app/shared/helpers/organization-type.helpers';
import {
  defaultOrganizationType,
  getOrganizationType,
  Organization,
  OrganizationType,
  organizationTypeOptions,
} from 'src/app/shared/models/organization/organization.model';
import { cvrValidator } from 'src/app/shared/validators/cvr.validator';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { CreateOrganizationDialogComponent } from '../create-organization-dialog/create-organization-dialog.component';

@Component({
  selector: 'app-edit-organization-unit-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.scss',
})
export class EditOrganizationDialogComponent implements OnInit {
  @Input() organization!: Organization;

  public isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly organizationTypeOptions = organizationTypeOptions;
  public formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    cvr: new FormControl<string | undefined>(undefined, cvrValidator()),
    organizationType: new FormControl<OrganizationType>(defaultOrganizationType, Validators.required),
    foreignCvr: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<CreateOrganizationDialogComponent>,
    private store: Store,
    private actions$: Actions
  ) {}

  public ngOnInit(): void {
    this.formGroup.patchValue({
      name: this.organization.Name,
      cvr: this.organization.Cvr,
      foreignCvr: this.organization.ForeignBusiness,
      organizationType: getOrganizationType(this.organization.OrganizationType) ?? defaultOrganizationType,
    });

    this.actions$
      .pipe(ofType(OrganizationActions.patchOrganizationSuccess, OrganizationActions.patchOrganizationError))
      .subscribe(() => {
        this.isLoading$.next(false);
      });
  }

  public onEditOrganization(): void {
    this.actions$.pipe(ofType(OrganizationActions.patchOrganizationSuccess), first()).subscribe(() => {
      this.onCancel();
    });

    const request = this.getRequest();
    this.isLoading$.next(true);
    this.store.dispatch(OrganizationActions.patchOrganization(request, this.organization.Uuid));
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public canSubmit(): boolean {
    return this.formGroup.valid && this.hasAnythingChanged();
  }

  private getRequest(): APIOrganizationUpdateRequestDTO {
    const formValue = this.formGroup.value;
    return {
      name: formValue.name ?? undefined,
      cvr: formValue.cvr ?? undefined,
      type: formValue.organizationType ? mapOrgTypeToDtoType(formValue.organizationType.value) : undefined,
      foreignCountryCodeUuid: formValue.foreignCvr ?? undefined,
    };
  }
  private hasAnythingChanged(): boolean {
    const formValue = this.formGroup.value;
    const org = this.organization;

    return (
      this.hasChange(formValue.name, org.Name) ||
      this.hasChange(formValue.cvr, org.Cvr) ||
      this.hasChange(formValue.foreignCvr, org.ForeignBusiness) ||
      this.hasChange(formValue.organizationType?.name, org.OrganizationType)
    );
  }

  private hasChange<T>(formValue: T | null | undefined, orginialValue: T | undefined): boolean {
    return this.mapFormValue(formValue) !== orginialValue;
  }

  private mapFormValue<T>(value: T | null | undefined): T | undefined {
    return value ?? undefined;
  }
}
