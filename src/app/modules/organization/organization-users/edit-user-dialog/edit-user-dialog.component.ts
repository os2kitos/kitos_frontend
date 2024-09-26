import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganizationUser } from 'src/app/shared/models/organization-user/organization-user.model';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit {
  @Input() public user!: OrganizationUser;
  @Input() public nested!: boolean;

  public createForm = new FormGroup({
    firstName: new FormControl<string | undefined>(undefined, Validators.required),
    lastName: new FormControl<string | undefined>(undefined, Validators.required),
    email: new FormControl<string | undefined>(undefined, Validators.required),
    phoneNumber: new FormControl<string | undefined>(undefined),
  });

  public ngOnInit(): void {
    console.log(this.user.FirstName)
    this.createForm.patchValue({
      firstName: this.user.FirstName,
      lastName: this.user.LastName,
      email: this.user.Email,
      phoneNumber: this.user.PhoneNumber,
    });
  }

  public onSave(): void {

  }
}
