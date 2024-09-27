import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { APIUpdateUserRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { OrganizationUser, UserStartPreference } from 'src/app/shared/models/organization-user/organization-user.model';
import { OrganizationUserActions } from 'src/app/store/organization-user/actions';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent extends BaseComponent implements OnInit {
  @Input() public user!: OrganizationUser;
  @Input() public isNested!: boolean;

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, Validators.required),
    phoneNumber: new FormControl<string | undefined>(undefined),
    defaultStartPreference: new FormControl<{ name: string; value: UserStartPreference } | undefined>(undefined),
    hasApiAccess: new FormControl<boolean | undefined>(undefined),
    hasRightsHolderAccess: new FormControl<boolean | undefined>(undefined),
  });

  public readonly preferenceOptions = [
    UserStartPreference.StartSite,
    UserStartPreference.Organization,
    UserStartPreference.ItSystemUsage,
    UserStartPreference.ItSystemCatalog,
    UserStartPreference.ItContract,
    UserStartPreference.DataProcessing,
  ].map((option) => ({ name: this.mapUserStartPreferenceToText(option), value: option }));

  constructor(private store: Store, private dialogRef: MatDialogRef<EditUserDialogComponent>) {
    super();
  }

  public ngOnInit(): void {
    this.createForm.patchValue({
      firstName: this.user.FirstName,
      lastName: this.user.LastName,
      email: this.user.Email,
      phoneNumber: this.user.PhoneNumber,
      defaultStartPreference: {
        name: this.mapUserStartPreferenceToText(this.user.DefaultStartPreference),
        value: this.user.DefaultStartPreference,
      },
      hasApiAccess: this.user.HasApiAccess,
      hasRightsHolderAccess: this.user.HasRightsHolderAccess,
    });
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

  public onCopyRoles(): void {}

  private createRequest(): APIUpdateUserRequestDTO {

    const user = this.user;
    const formValue = this.createForm.value;
    const request = {
      email: this.requestValue(user.Email, formValue.email),
      firstName: this.requestValue(user.FirstName, formValue.firstName),
      lastName: this.requestValue(user.LastName, formValue.lastName),
      phoneNumber: this.requestValue(user.PhoneNumber, formValue.phoneNumber),
      defaultUserStartPreference:  undefined, //TODO
      hasApiAccess: this.requestValue(user.HasApiAccess, formValue.hasApiAccess),
      hasStakeHolderAccess: this.requestValue(user.HasStakeHolderAccess, undefined),
      roles: undefined, //TODO
    };
    console.log('User: ', user);
    console.log('FormValue: ', formValue);
    console.log('Request', request);
    return request;
  }

  private requestValue<T>(valueBefore: T, formValue: T | undefined | null) {
    const mappedFormValue = formValue ?? undefined;
    return valueBefore !== mappedFormValue ? mappedFormValue : undefined;
  }

  private mapUserStartPreferenceToText(preference: UserStartPreference): string {
    switch (preference) {
      case UserStartPreference.StartSite:
        return $localize`Startside`;
      case UserStartPreference.Organization:
        return $localize`Organisation`;
      case UserStartPreference.ItSystemUsage:
        return $localize`IT Systemer`;
      case UserStartPreference.ItSystemCatalog:
        return $localize`IT Systemkatalog`;
      case UserStartPreference.ItContract:
        return $localize`IT Kontrakter`;
      case UserStartPreference.DataProcessing:
        return $localize`Databehandling`;
    }
  }
}
