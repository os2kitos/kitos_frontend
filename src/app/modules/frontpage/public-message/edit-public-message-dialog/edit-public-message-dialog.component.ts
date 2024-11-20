import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { APIPublicMessagesRequestDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { PublicMessageType } from 'src/app/shared/models/public-messages.model';
import { GlobalAdminPublicMessageActions } from 'src/app/store/global-admin/public-messages/actions';

@Component({
  selector: 'app-edit-public-message-dialog',
  templateUrl: './edit-public-message-dialog.component.html',
  styleUrl: './edit-public-message-dialog.component.scss',
})
export class EditPublicMessageDialogComponent extends BaseComponent implements OnInit {
  @Input() public message: string | undefined;
  @Input() public type!: PublicMessageType;

  public formGroup = new FormGroup({
    message: new FormControl<string | undefined>(undefined),
  });

  constructor(
    private store: Store,
    private actions$: Actions,
    private dialogRef: MatDialogRef<EditPublicMessageDialogComponent>
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      message: this.message,
    });

    this.subscriptions.add(
      this.actions$.pipe(ofType(GlobalAdminPublicMessageActions.editPublicMessagesSuccess)).subscribe(() => {
        this.close();
      })
    );
  }

  public close(): void {
    this.dialogRef.close();
  }

  public onSave(): void {
    const request = this.getRequest();
    this.store.dispatch(GlobalAdminPublicMessageActions.editPublicMessages(request));
  }

  private getRequest(): APIPublicMessagesRequestDTO {
    const newMessage = this.formGroup.value.message ?? undefined;
    switch (this.type) {
      case 'about':
        return { about: newMessage };
      case 'contact-info':
        return { contactInfo: newMessage };
      case 'guides':
        return { guides: newMessage };
      case 'status-messages':
        return { statusMessages: newMessage };
      case 'misc':
        return { misc: newMessage };
      default:
        throw new Error('Invalid message type');
    }
  }
}
