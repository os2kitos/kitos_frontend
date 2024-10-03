import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, map } from 'rxjs';
import { APICreateUserRequestDTO, APIUserResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import {
  StartPreferenceChoice,
  startPreferenceChoiceOptions,
} from 'src/app/shared/models/organization/organization-user/start-preference.model';
import { userRoleChoiceOptions } from 'src/app/shared/models/organization/organization-user/user-role.model';
import { phoneNumberLengthValidator } from 'src/app/shared/validators/phone-number-length.validator';
import { requiredIfDirtyValidator } from 'src/app/shared/validators/required-if-dirty.validator';
import { OrganizationUserActions } from 'src/app/store/organization/organization-user/actions';
import { selectOrganizationUserIsCreateLoading } from 'src/app/store/organization/organization-user/selectors';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { CreateUserDialogComponentStore } from './create-user-dialog.component-store';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
  providers: [CreateUserDialogComponentStore],
})
export class CreateUserDialogComponent extends BaseComponent implements OnInit {
  public readonly isLoadingAlreadyExists$ = this.componentStore.isLoading$;
  public readonly alreadyExists$ = this.componentStore.alreadyExists$;
  public readonly noExistingUser$ = this.componentStore.noUserInOtherOrgs$;
  public readonly isLoading$ = this.store.select(selectOrganizationUserIsCreateLoading);
  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  public readonly isLoadingCombined$ = combineLatest([
    this.isLoadingAlreadyExists$,
    this.store.select(selectOrganizationUserIsCreateLoading),
  ]).pipe(map(([isLoadingAlreadyExists, isLoading]) => isLoadingAlreadyExists || isLoading));

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator()]),
    lastName: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator()]),
    email: new FormControl<string | undefined>(undefined, [requiredIfDirtyValidator(), Validators.email]),
    repeatEmail: new FormControl<string | undefined>(undefined, [
      requiredIfDirtyValidator(),
      Validators.email,
      this.emailMatchValidator.bind(this),
    ]),
    phoneNumber: new FormControl<number | undefined>(undefined, [phoneNumberLengthValidator()]),
    startPreference: new FormControl<StartPreferenceChoice | undefined>(undefined),
    roles: new FormControl<APIUserResponseDTO.RolesEnum[] | undefined>(undefined),
    sendNotificationOnCreation: new FormControl<boolean>(false),
    rightsHolderAccess: new FormControl<boolean>(false),
    apiUser: new FormControl<boolean>(false),
    stakeholderAccess: new FormControl<boolean>(false),
  });

  public startPreferenceOptions = startPreferenceChoiceOptions;

  public roleOptions = userRoleChoiceOptions;

  private selectedRoles: APIUserResponseDTO.RolesEnum[] = [];

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly dialog: MatDialogRef<CreateUserDialogComponent>,
    private readonly componentStore: CreateUserDialogComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.actions$.pipe(ofType(OrganizationUserActions.createUserSuccess)).subscribe(() => {
        this.onCancel();
      })
    );

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

  public onCancel(): void {
    this.dialog.close();
  }

  public sendCreateUserRequest() {
    const firstName = this.createForm.controls.firstName.value;
    const lastName = this.createForm.controls.lastName.value;
    const email = this.createForm.controls.email.value;
    if (!firstName || !lastName || !email) {
      return;
    }

    const phoneNumber = this.createForm.controls.phoneNumber.value;
    const startPreference = this.createForm.controls.startPreference.value;
    const sendNotificationOnCreation = this.createForm.controls.sendNotificationOnCreation.value;
    const rightsHolderAccess = this.createForm.controls.rightsHolderAccess.value;
    const apiUser = this.createForm.controls.apiUser.value;
    const stakeholderAccess = this.createForm.controls.stakeholderAccess.value;
    const roles = this.selectedRoles;
    roles.push(APICreateUserRequestDTO.RolesEnum.User);
    if (rightsHolderAccess) {
      roles.push(APICreateUserRequestDTO.RolesEnum.RightsHolderAccess);
    }

    const user: APICreateUserRequestDTO = {
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber ? String(phoneNumber) : '',
      defaultUserStartPreference: startPreference?.value ?? undefined,
      sendMail: sendNotificationOnCreation ?? false,
      hasApiAccess: apiUser ?? false,
      hasStakeHolderAccess: stakeholderAccess ?? false,
      roles: roles,
    };

    this.store.dispatch(OrganizationUserActions.createUser(user));
  }

  public rolesChanged(roles: APIUserResponseDTO.RolesEnum[]): void {
    this.selectedRoles = roles;
  }

  public rolesCleared(): void {
    this.selectedRoles = [];
  }

  public isFormValid(): boolean {
    return (
      this.createForm.valid &&
      this.createForm.controls.email.dirty &&
      this.createForm.controls.repeatEmail.dirty &&
      this.createForm.controls.firstName.dirty &&
      this.createForm.controls.lastName.dirty
    );
  }

  private emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (this.createForm) {
      const email = this.getEmailControl()?.value;
      const repeatEmail = control.value;
      if (email !== repeatEmail) {
        return { emailMismatch: true };
      }
    }
    return null;
  }

  private getEmailControl(): AbstractControl {
    return this.createForm.get('email')!;
  }
}
