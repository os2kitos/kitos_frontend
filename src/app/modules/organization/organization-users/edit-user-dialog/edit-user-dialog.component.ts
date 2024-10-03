import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs';
import { APIUpdateUserRequestDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';
import {
  StartPreferenceChoice,
  startPreferenceChoiceOptions,
} from 'src/app/shared/models/organization-user/start-preference.model';
import { UserRoleChoice } from 'src/app/shared/models/organization-user/user-role.model';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization-user/selectors';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { CreateUserDialogComponentStore } from '../create-user-dialog/create-user-dialog.component-store';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
  providers: [CreateUserDialogComponentStore],
})
export class EditUserDialogComponent extends BaseComponent implements OnInit {
  @Input() public user!: OrganizationUser;
  @Input() public isNested!: boolean;

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
  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly isLoadingAlreadyExists$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;
  public readonly isLoading$ = this.store.select(selectOrganizationUserIsCreateLoading);

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private componentStore: CreateUserDialogComponentStore
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

    this.subscriptions.add(
      this.getEmailControl()
        ?.valueChanges.pipe(debounceTime(500))
        .subscribe((value) => {
          if (!value) return;

          this.componentStore.getUserWithEmail(value);
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

  public onSave(): void {
    const request = this.createRequest();
    this.store.dispatch(OrganizationUserActions.updateUser(this.user.Uuid, request));

    this.subscriptions.add(
      this.store.select(OrganizationUserActions.updateUserSuccess).subscribe(() => {
        this.dialogRef.close();
      })
    );
  }

  public isFormValid(): boolean {
    return this.createForm.valid && this.hasAnythingChanged(); //&& this.createForm.controls.email.dirty;
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
      this.user.HasStakeHolderAccess !== this.createForm.value.hasStakeholderAccess
      //TODO: Roles
    );
  }

  public shouldShowAPIInfoBox(): boolean {
    return (this.createForm.value.hasApiAccess ?? false) && !this.user.HasApiAccess;
  }

  public onCopyRoles(): void {}

  private createRequest(): APIUpdateUserRequestDTO {
    const user = this.user;
    const formValue = this.createForm.value;
    const request = {
      email: this.requestValue(user.Email, formValue.email),
      firstName: this.requestValue(user.FirstName, formValue.firstName),
      lastName: this.requestValue(user.LastName, formValue.lastName),
      phoneNumber: this.requestValue(user.PhoneNumber, formValue.phoneNumber),
      defaultUserStartPreference: this.requestValue(user.DefaultStartPreference, formValue.defaultStartPreference)
        ?.value,
      hasApiAccess: this.requestValue(user.HasApiAccess, formValue.hasApiAccess),
      hasStakeHolderAccess: this.requestValue(user.HasStakeHolderAccess, formValue.hasStakeholderAccess),
      roles: this.getRoleRequest(),
    };
    console.log('User: ', user);
    console.log('FormValue: ', formValue);
    console.log('Request', request);
    return request;
  }

  private getRoleRequest(): APIUpdateUserRequestDTO.RolesEnum[] | undefined {
    const previousRoles = new Set(this.getOriginalRoles());
    const formRoles = new Set(this.getFormRoles());
    console.log('Previous Roles: ', previousRoles);
    console.log('Form Roles: ', formRoles);
    const areTheyTheSame =
      [...previousRoles].every((role) => formRoles.has(role)) &&
      [...formRoles].every((role) => previousRoles.has(role));
    if (areTheyTheSame) return undefined;
    return [...formRoles];
  }

  private getFormRoles(): APIUpdateUserRequestDTO.RolesEnum[] {
    const selectedRoles = (this.createForm.value.roles ?? []).map((role) => role.value);
    selectedRoles.push(APIUpdateUserRequestDTO.RolesEnum.User);
    if (this.createForm.value.hasRightsHolderAccess) {
      selectedRoles.push(APIUpdateUserRequestDTO.RolesEnum.RightsHolderAccess);
    }
    return selectedRoles;
  }

  private getOriginalRoles(): APIUpdateUserRequestDTO.RolesEnum[] {
    const roles = [APIUpdateUserRequestDTO.RolesEnum.User];
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
    if (this.user.HasRightsHolderAccess) {
      roles.push(APIUserResponseDTO.RolesEnum.RightsHolderAccess);
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
