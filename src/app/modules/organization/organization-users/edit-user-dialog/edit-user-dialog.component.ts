import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganizationUser, UserStartPreference } from 'src/app/shared/models/organization-user/organization-user.model';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit {
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

  public onSave(): void {}

  public onCopyRoles(): void {}

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
