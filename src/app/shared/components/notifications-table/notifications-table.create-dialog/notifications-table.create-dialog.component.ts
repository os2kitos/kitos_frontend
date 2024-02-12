import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { APIRegularOptionResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-notifications-table.create-dialog',
  templateUrl: './notifications-table.create-dialog.component.html',
  styleUrl: './notifications-table.create-dialog.component.scss',
})
export class NotificationsTableCreateDialogComponent implements OnInit {
  @Input() public title!: string;
  @Input() public systemUsageRolesOptions!: Array<APIRegularOptionResponseDTO>;

  public readonly notificationForm = new FormGroup({
    roleRecipientsForm: new FormGroup({})
  });
  public readonly roleRecipientsForm = new FormGroup({});
  public readonly roleCcsForm = new FormGroup({});

  ngOnInit(): void {
      this.systemUsageRolesOptions.forEach((option) => {
        this.roleRecipientsForm.addControl(option.uuid, new FormControl<boolean>(false));
        this.roleCcsForm.addControl(option.uuid, new FormControl<boolean>(false));
      })
  }

}
