import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, first } from 'rxjs';
import { APIOrganizationUpdateRequestDTO } from 'src/app/api/v2';
import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { InfoIconComponent } from 'src/app/shared/components/icons/info-icon.component';
import { TooltipComponent } from 'src/app/shared/components/tooltip/tooltip.component';
import { mapOrgTypeToDtoType } from 'src/app/shared/helpers/organization-type.helpers';
import { adaptShallowOptionTypeFromOData, ShallowOptionType } from 'src/app/shared/models/options/option-type.model';
import {
  defaultOrganizationType,
  getOrganizationType,
  OrganizationOData,
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
  selector: 'app-edit-organization-unit-dialog',
  templateUrl: './edit-organization-dialog.component.html',
  styleUrl: './edit-organization-dialog.component.scss',
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
    TooltipComponent,
    InfoIconComponent
],
})
export class EditOrganizationDialogComponent extends GlobalAdminOrganizationsDialogBaseComponent implements OnInit {
  @Input() organization!: OrganizationOData;
  @Input() tooltipText: string = '';

  public isLoading$ = new BehaviorSubject<boolean>(false);
  public readonly organizationTypeOptions = organizationTypeOptions;
  public formGroup = new FormGroup({
    name: new FormControl<string | undefined>(undefined, Validators.required),
    cvr: new FormControl<string | undefined>(undefined, cvrValidator()),
    organizationType: new FormControl<OrganizationType>(defaultOrganizationType, Validators.required),
    foreignCountryCode: new FormControl<ShallowOptionType | undefined>(undefined),
    isSupplier: new FormControl<boolean | undefined>(undefined),
  });

  constructor(
    private dialogRef: MatDialogRef<EditOrganizationDialogComponent>,
    private store: Store,
    private actions$: Actions,
    componentStore: OrganizationsDialogComponentStore
  ) {
    super(componentStore);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.formGroup.controls['organizationType'].valueChanges.subscribe(() => this.toggleIsSupplierField());

    this.formGroup.patchValue({
      name: this.organization.Name,
      cvr: this.organization.Cvr,
      foreignCountryCode: this.getInitialForeignCountryCodeValue(this.organization.ForeignCountryCode),
      organizationType: getOrganizationType(this.organization.OrganizationType) ?? defaultOrganizationType,
      isSupplier: this.organization.IsSupplier,
    });

    this.actions$
      .pipe(ofType(OrganizationActions.patchOrganizationSuccess, OrganizationActions.patchOrganizationError))
      .subscribe(() => {
        this.isLoading$.next(false);
      });
  }

  public toggleIsSupplierField() {
    const controls = this.formGroup.controls;
    const supplierStateControl = controls['isSupplier'];
    if (this.enableISMSResponsibleField()) {
      supplierStateControl.setValue(this.organization.IsSupplier);
      supplierStateControl.enable();
    } else {
      supplierStateControl.setValue(undefined);
      supplierStateControl.disable();
    }
  }

  public enableISMSResponsibleField() {
    return this.formGroup.controls['organizationType'].value?.value === OrganizationTypeEnum.Company;
  }

  public onEditOrganization(): void {
    this.actions$.pipe(ofType(OrganizationActions.patchOrganizationSuccess), first()).subscribe(() => {
      this.closeDialog();
    });

    const request = this.getRequest();
    this.isLoading$.next(true);
    this.store.dispatch(OrganizationActions.patchOrganization(request, this.organization.Uuid));
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public canSubmit(): boolean {
    return this.formGroup.valid && this.hasAnythingChanged();
  }

  private getRequest(): APIOrganizationUpdateRequestDTO {
    const formValue = this.formGroup.value;
    const isSupplierValue = formValue.isSupplier ?? undefined;
    return {
      name: formValue.name ?? undefined,
      cvr: formValue.cvr ?? undefined,
      type: formValue.organizationType ? mapOrgTypeToDtoType(formValue.organizationType.value) : undefined,
      foreignCountryCodeUuid: formValue.foreignCountryCode?.uuid ?? undefined,
      updateForeignCountryCode: this.foreignCountryCodeHasChange(),
      isSupplier: this.enableISMSResponsibleField() ? isSupplierValue : undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getInitialForeignCountryCodeValue(source: any) {
    if (source === null) return undefined;
    return adaptShallowOptionTypeFromOData(source);
  }

  private hasAnythingChanged(): boolean {
    const formValue = this.formGroup.value;
    const org = this.organization;
    return (
      this.hasChange(formValue.name, org.Name) ||
      this.hasChange(formValue.cvr, org.Cvr) ||
      this.foreignCountryCodeHasChange() ||
      this.hasChange(formValue.organizationType?.name, org.OrganizationType) ||
      this.hasChange(formValue.isSupplier, org.IsSupplier)
    );
  }

  private foreignCountryCodeHasChange(): boolean {
    const initialValue = this.getInitialForeignCountryCodeValue(this.organization.ForeignCountryCode);
    const currentvalue = this.formGroup.value.foreignCountryCode;
    return !((initialValue === undefined && currentvalue === undefined) || initialValue?.uuid === currentvalue?.uuid);
  }

  private hasChange<T>(formValue: T | null | undefined, orginialValue: T | undefined): boolean {
    return this.mapFormValue(formValue) !== orginialValue;
  }

  private mapFormValue<T>(value: T | null | undefined): T | undefined {
    return value ?? undefined;
  }
}
