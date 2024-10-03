import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIUpdateUserRequestDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';

import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { CreateUserDialogComponentStore } from '../create-user-dialog/create-user-dialog.component-store';
import { debounceTime } from 'rxjs';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';

import { MultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization/organization-user/selectors';
import { StartPreferenceChoice, startPreferenceChoiceOptions } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { mapUserRoleChoice, UserRoleChoice, userRoleChoiceOptions } from 'src/app/shared/models/organization/organization-user/user-role.model';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { OrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { CopyRolesDialogComponent } from '../copy-roles-dialog/copy-roles-dialog.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
  providers: [CreateUserDialogComponentStore],
})
export class EditUserDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() public user!: OrganizationUser;
  @Input() public isNested!: boolean;
  @ViewChild(MultiSelectDropdownComponent)
  public multiSelectDropdown!: MultiSelectDropdownComponent<APIUserResponseDTO.RolesEnum>;

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.email,
      requiredIfDirtyValidator(),
    ]),
    phoneNumber: new FormControl<string | undefined>(undefined, phoneNumberLengthValidator()),
    defaultStartPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    roles: new FormControl<UserRoleChoice[] | undefined>(undefined),
    hasApiAccess: new FormControl<boolean | undefined>(undefined),
    hasRightsHolderAccess: new FormControl<boolean | undefined>(undefined),
    hasStakeholderAccess: new FormControl<boolean | undefined>(undefined),
    sendAdvis: new FormControl<boolean | undefined>(undefined),
  });

  public startPreferenceOptions = startPreferenceChoiceOptions;
  public roleOptions = userRoleChoiceOptions;
  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly isLoadingAlreadyExists$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;
  public readonly isLoading$ = this.store.select(selectOrganizationUserIsCreateLoading);

  private selectedRoles: APIUserResponseDTO.RolesEnum[] = [];

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private componentStore: CreateUserDialogComponentStore,
    private dialog: MatDialog
  ) {
    super();
  }

  public ngOnInit(): void {
    this.createForm.patchValue({
      firstName: this.user.FirstName,
      lastName: this.user.LastName,
      email: this.user.Email,
      phoneNumber: this.user.PhoneNumber,
      defaultStartPreference: this.user.DefaultStartPreference,
      hasApiAccess: this.user.HasApiAccess,
      hasRightsHolderAccess: this.user.HasRightsHolderAccess,
      hasStakeholderAccess: this.user.HasStakeHolderAccess,
      sendAdvis: false,
    });

    this.componentStore.setPreviousEmail(this.user.Email);

    this.subscriptions.add(
      this.getEmailControl()
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (!value) return;
          this.componentStore.checkEmailAvailability(value);
        })
    );

    this.subscriptions.add(
      this.alreadyExists$.subscribe((alreadyExists) => {
        if (alreadyExists) {
          this.getEmailControl()?.setErrors({ alreadyExists: true });
        } else {
          this.getEmailControl()?.setErrors(null);
        }
      })
    );
  }

  public ngAfterViewInit(): void {
    const initialValues = this.getSelectableRolesThatUserHas()
      .map((role) => mapUserRoleChoice(role))
      .filter((role) => role !== undefined);
    this.multiSelectDropdown.setValues(initialValues);
    this.selectedRoles = initialValues.map((role) => role.value);
  }

  public onSave(): void {
    this.subscriptions.add(
      this.store.select(OrganizationUserActions.updateUserSuccess).subscribe(() => {
        this.dialogRef.close();
      })
    );
    const request = this.createRequest();
    this.store.dispatch(OrganizationUserActions.updateUser(this.user.Uuid, request));
  }

  public isFormValid(): boolean {
    return this.createForm.valid && this.hasAnythingChanged();
  }

  public rolesChanged(roles: APIUserResponseDTO.RolesEnum[]): void {
    this.selectedRoles = roles;
  }

  public rolesCleared(): void {
    this.selectedRoles = [];
  }

  public onCopyRoles(): void {
    const dialogRef = this.dialog.open(CopyRolesDialogComponent, {width: '50%'});
    dialogRef.componentInstance.user = this.user;
  }

  private hasAnythingChanged(): boolean {
    return (
      this.user.Email !== this.createForm.value.email ||
      this.user.FirstName !== this.createForm.value.firstName ||
      this.user.LastName !== this.createForm.value.lastName ||
      this.user.PhoneNumber !== this.createForm.value.phoneNumber ||
      this.user.DefaultStartPreference !== this.createForm.value.defaultStartPreference ||
      this.user.HasApiAccess !== this.createForm.value.hasApiAccess ||
      this.user.HasRightsHolderAccess !== this.createForm.value.hasRightsHolderAccess ||
      this.user.HasStakeHolderAccess !== this.createForm.value.hasStakeholderAccess ||
      this.getRoleRequest() !== undefined
    );
  }

  private createRequest(): APIUpdateUserRequestDTO {
    const user = this.user;
    const formValue = this.createForm.value;
    const request = {
      email: this.requestValue(user.Email, formValue.email),
      firstName: this.requestValue(user.FirstName, formValue.firstName),
      lastName: this.requestValue(user.LastName, formValue.lastName),
      phoneNumber: this.requestValue(user.PhoneNumber, formValue.phoneNumber),
      defaultUserStartPreference:
        this.requestValue(user.DefaultStartPreference, formValue.defaultStartPreference)?.value ??
        APIUserResponseDTO.DefaultUserStartPreferenceEnum.StartSite,
      hasApiAccess: this.requestValue(user.HasApiAccess, formValue.hasApiAccess),
      hasStakeHolderAccess: this.requestValue(user.HasStakeHolderAccess, formValue.hasStakeholderAccess),
      roles: this.getRoleRequest(),
      sendMail: formValue.sendAdvis === true,
    };
    return request;
  }

  private getRoleRequest(): APIUpdateUserRequestDTO.RolesEnum[] | undefined {
    const previousRoles = new Set(this.getOriginalRoles());
    const selectedRoles = new Set(this.getRolesToBePatched());
    const areTheyTheSame =
      [...previousRoles].every((role) => selectedRoles.has(role)) &&
      [...selectedRoles].every((role) => previousRoles.has(role));
    if (areTheyTheSame) return undefined;
    return [...selectedRoles];
  }

  private getRolesToBePatched(): APIUpdateUserRequestDTO.RolesEnum[] {
    const selectedRoles = this.selectedRoles.slice();
    return this.addNonSelectableRoles(selectedRoles, this.createForm.value.hasRightsHolderAccess === true);
  }

  private getOriginalRoles(): APIUpdateUserRequestDTO.RolesEnum[] {
    const roles = this.getSelectableRolesThatUserHas();
    return this.addNonSelectableRoles(roles, this.user.HasRightsHolderAccess);
  }

  private addNonSelectableRoles(
    roles: APIUpdateUserRequestDTO.RolesEnum[],
    shouldRightsHolderAccessBeAdded: boolean
  ): APIUpdateUserRequestDTO.RolesEnum[] {
    roles.push(APIUpdateUserRequestDTO.RolesEnum.User);
    if (shouldRightsHolderAccessBeAdded) {
      roles.push(APIUpdateUserRequestDTO.RolesEnum.RightsHolderAccess);
    }
    return roles;
  }

  private getSelectableRolesThatUserHas(): APIUserResponseDTO.RolesEnum[] {
    const roles: APIUpdateUserRequestDTO.RolesEnum[] = [];
    if (this.user.IsLocalAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.LocalAdmin);
    }
    if (this.user.IsOrganizationModuleAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.OrganizationModuleAdmin);
    }
    if (this.user.IsSystemModuleAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.SystemModuleAdmin);
    }
    if (this.user.IsContractModuleAdmin) {
      roles.push(APIUserResponseDTO.RolesEnum.ContractModuleAdmin);
    }
    return roles;
  }

  private requestValue<T>(valueBefore: T, formValue: T | undefined | null) {
    const mappedFormValue = formValue ?? undefined;
    return valueBefore !== mappedFormValue ? mappedFormValue : undefined;
  }

  private getEmailControl(): AbstractControl {
    return this.createForm.get('email')!;
  }
}
