import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime, of } from 'rxjs';
import { APIUpdateUserRequestDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { notDirtyAndEmptyStringValidator } from 'src/app/shared/validators/not-dirty-and-empty-string-validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { CreateUserDialogComponentStore } from '../create-user-dialog/create-user-dialog.component-store';

import { AsyncPipe, NgIf } from '@angular/common';
import {
  BulkActionButton,
  BulkActionResult,
} from 'src/app/shared/components/dialogs/bulk-action-dialog/bulk-action-dialog.component';
import { MultiSelectDropdownComponent } from 'src/app/shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { ONLY_DIGITS_AND_WHITESPACE_REGEX } from 'src/app/shared/constants/regex-constants';
import { getUserRoleSelectionDialogSections } from 'src/app/shared/helpers/bulk-action.helpers';
import { removeWhitespace } from 'src/app/shared/helpers/string.helpers';
import { getRoleActionRequest } from 'src/app/shared/helpers/user-role.helpers';
import { ODataOrganizationUser } from 'src/app/shared/models/organization/organization-user/organization-user.model';
import { StartPreferenceChoice } from 'src/app/shared/models/organization/organization-user/start-preference.model';
import {
  mapUserRoleChoice,
  UserRoleChoice,
} from 'src/app/shared/models/organization/organization-user/user-role.model';
import { DialogOpenerService } from 'src/app/shared/services/dialog-opener.service';
import { RoleOptionTypeService } from 'src/app/shared/services/role-option-type.service';
import { UserService } from 'src/app/shared/services/user.service';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectRoleOptionTypes } from 'src/app/store/roles-option-type-store/selectors';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { DividerComponent } from '../../../../shared/components/divider/divider.component';
import { DropdownComponent } from '../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { MultiSelectDropdownComponent as MultiSelectDropdownComponent_1 } from '../../../../shared/components/dropdowns/multi-select-dropdown/multi-select-dropdown.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TextBoxInfoComponent } from '../../../../shared/components/textbox-info/textbox-info.component';
import { TextBoxComponent } from '../../../../shared/components/textbox/textbox.component';
import { BaseUserDialogComponent } from '../base-user-dialog.component';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
  providers: [CreateUserDialogComponentStore],
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    StandardVerticalContentGridComponent,
    TextBoxComponent,
    NgIf,
    ParagraphComponent,
    DropdownComponent,
    MultiSelectDropdownComponent_1,
    CheckboxComponent,
    DividerComponent,
    TextBoxInfoComponent,
    DialogActionsComponent,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class EditUserDialogComponent extends BaseUserDialogComponent implements OnInit {
  @Input() public user!: ODataOrganizationUser;
  @Input() public isNested!: boolean;
  @ViewChild(MultiSelectDropdownComponent)
  public multiSelectDropdown!: MultiSelectDropdownComponent<APIUserResponseDTO.RolesEnum>;
  public readonly phoneNumberRegex = ONLY_DIGITS_AND_WHITESPACE_REGEX;

  private readonly availableUnitRoles$ = this.store.select(selectRoleOptionTypes('organization-unit'));
  private readonly availableContractRoles$ = this.store.select(selectRoleOptionTypes('it-contract'));
  private readonly availableUsageRoles$ = this.store.select(selectRoleOptionTypes('it-system-usage'));
  private readonly availableDprRoles$ = this.store.select(selectRoleOptionTypes('data-processing'));

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, [
      Validators.required,
      Validators.email,
      requiredIfDirtyValidator(),
    ]),
    phoneNumber: new FormControl<string | undefined>(undefined, notDirtyAndEmptyStringValidator()),
    defaultStartPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    hasApiAccess: new FormControl<boolean | undefined>(undefined),
    hasRightsHolderAccess: new FormControl<boolean | undefined>(undefined),
    hasStakeholderAccess: new FormControl<boolean | undefined>(undefined),
  });

  private selectedRoles: APIUserResponseDTO.RolesEnum[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private openerService: DialogOpenerService,
    private roleService: RoleOptionTypeService,
    componentStore: CreateUserDialogComponentStore,
    store: Store,
    userService: UserService
  ) {
    super(store, componentStore, userService);
  }

  public ngOnInit(): void {
    this.roleService.dispatchAllGetAvailableOptions();

    this.createForm.patchValue({
      firstName: this.user.FirstName,
      lastName: this.user.LastName,
      email: this.user.Email,
      phoneNumber: this.user.PhoneNumber,
      defaultStartPreference: this.user.DefaultStartPreference,
      hasApiAccess: this.user.HasApiAccess,
      hasRightsHolderAccess: this.user.HasRightsHolderAccess,
      hasStakeholderAccess: this.user.HasStakeHolderAccess,
    });

    this.componentStore.setPreviousEmail(this.user.Email);

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
    const initialValues = this.getUserRoleChoices();
    this.selectedRoles = initialValues.map((role) => role.value);
  }

  public getUserRoleChoices(): UserRoleChoice[] {
    const initialValues = this.getSelectableRolesThatUserHas()
      .map((role) => mapUserRoleChoice(role))
      .filter((role) => role !== undefined);
    return initialValues;
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
    const dialogActions = [
      {
        text: $localize`Kopier roller`,
        color: 'secondary',
        buttonStyle: 'secondary',
        callback: (result) => this.copyRoles(result),
      },
    ] as BulkActionButton[];

    const dialogRef = this.openerService.openUserRoleSelectionDialog(this.user);

    const instance = dialogRef.componentInstance;
    instance.title = $localize`Kopier roller`;
    instance.actionButtons = dialogActions;
    instance.dropdownTitle = $localize`Kopier roller til`;
    instance.successActionTypes = OrganizationUserActions.copyRolesSuccess;
    instance.errorActionTypes = OrganizationUserActions.copyRolesError;
    instance.sections = getUserRoleSelectionDialogSections(
      of(this.user),
      this.availableUnitRoles$,
      this.availableContractRoles$,
      this.availableUsageRoles$,
      this.availableDprRoles$
    );
  }

  private copyRoles(result: BulkActionResult): void {
    const request = getRoleActionRequest(result, this.user);

    if (!result.selectedEntityId) {
      throw new Error('Selected entity ID is undefined');
    }
    this.store.dispatch(OrganizationUserActions.copyRoles(this.user.Uuid, result.selectedEntityId, request));
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
      phoneNumber: this.requestValue(user.PhoneNumber, this.getPhoneNumberString(formValue.phoneNumber)),
      defaultUserStartPreference:
        this.requestValue(user.DefaultStartPreference, formValue.defaultStartPreference)?.value ??
        APIUserResponseDTO.DefaultUserStartPreferenceEnum.StartSite,
      hasApiAccess: this.requestValue(user.HasApiAccess, formValue.hasApiAccess),
      hasStakeHolderAccess: this.requestValue(user.HasStakeHolderAccess, formValue.hasStakeholderAccess),
      roles: this.getRoleRequest(),
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

  private getPhoneNumberString(phoneNumberFromControl: string | undefined | null) {
    return phoneNumberFromControl ? removeWhitespace(String(phoneNumberFromControl)) : '';
  }

  private requestValue<T>(valueBefore: T, formValue: T | undefined | null) {
    const mappedFormValue = formValue ?? undefined;
    return valueBefore !== mappedFormValue ? mappedFormValue : undefined;
  }

  private getEmailControl(): AbstractControl {
    return this.createForm.get('email')!;
  }
}
