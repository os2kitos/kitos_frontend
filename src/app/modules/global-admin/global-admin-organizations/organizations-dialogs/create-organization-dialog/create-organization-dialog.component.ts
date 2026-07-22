import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first } from 'rxjs';
import { APIOrganizationCreateRequestDTO } from 'src/app/api/v2';
import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { TooltipComponent } from 'src/app/shared/components/tooltip/tooltip.component';
import { mapOrgTypeToDtoType } from 'src/app/shared/helpers/organization-type.helpers';
import { ShallowOptionType } from 'src/app/shared/models/options/option-type.model';
import {
  defaultOrganizationType,
  OrganizationType,
  OrganizationTypeEnum,
  organizationTypeOptions,
} from 'src/app/shared/models/organization/organization-odata.model';
import { cvrValidator } from 'src/app/shared/validators/cvr.validator';
import { OrganizationActions } from 'src/app/store/organization/actions';
import { ButtonComponent } from '../../../../../shared/components/buttons/button/button.component';
import { DialogActionsComponent } from '../../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../../shared/components/dialogs/dialog/dialog.component';
import { DropdownComponent } from '../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { StandardVerticalContentGridComponent } from '../../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxComponent } from '../../../../../shared/components/textbox/textbox.component';
import { GlobalAdminOrganizationsDialogBaseComponent } from '../global-admin-organizations-dialog-base.component';
import { OrganizationsDialogComponentStore } from '../organizations-dialog.component-store';

@Component({
  selector: 'app-create-organization-dialog',
  templateUrl: './create-organization-dialog.component.html',
  styleUrl: './create-organization-dialog.component.scss',
  providers: [OrganizationsDialogComponentStore],
  imports: [
    DialogComponent,
    LoadingComponent,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
    CheckboxComponent,
    TooltipComponent
],
})
export class CreateOrganizationDialogComponent extends GlobalAdminOrganizationsDialogBaseComponent implements OnInit {
  @Input() tooltipText: string = '';

  public readonly organizationTypeOptions = organizationTypeOptions;
  public formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    cvr: new FormControl<string | undefined>(undefined, cvrValidator()),
    organizationType: new FormControl<OrganizationType>(defaultOrganizationType, Validators.required),
    foreignCountryCode: new FormControl<ShallowOptionType | undefined>(undefined),
    isSupplier: new FormControl<boolean | undefined>(undefined),
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
    this.toggleIsSupplierField();
    this.formGroup.controls['organizationType'].valueChanges.subscribe(() => this.toggleIsSupplierField());
    this.componentStore.getCountryCodes();

    this.actions$
      .pipe(ofType(OrganizationActions.createOrganizationSuccess, OrganizationActions.createOrganizationError))
      .subscribe(() => {
        this.isLoading$.next(false);
      });
  }

  public enableISMSResponsibleField() {
    return this.formGroup.controls['organizationType'].value?.value === OrganizationTypeEnum.Company;
  }

  public toggleIsSupplierField() {
    const controls = this.formGroup.controls;
    const supplierStateControl = controls['isSupplier'];
    if (this.enableISMSResponsibleField()) {
      supplierStateControl.enable();
    } else {
      supplierStateControl.setValue(undefined);
      supplierStateControl.disable();
    }
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
    const isSupplierValue = formValue.isSupplier ?? undefined;
    return {
      name: formValue.name ?? '',
      cvr: formValue.cvr ?? undefined,
      type: mapOrgTypeToDtoType(type.value),
      foreignCountryCodeUuid: formValue.foreignCountryCode?.uuid ?? undefined,
      isSupplier: this.enableISMSResponsibleField() ? isSupplierValue : undefined,
    };
  }
}
