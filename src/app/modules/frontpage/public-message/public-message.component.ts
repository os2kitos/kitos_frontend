import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { EditPublicMessageDialogComponent } from './edit-public-message-dialog/edit-public-message-dialog.component';
import { PublicMessageType } from 'src/app/shared/models/public-messages.model';

@Component({
  selector: 'app-public-message',
  templateUrl: './public-message.component.html',
  styleUrl: './public-message.component.scss',
})
export class PublicMessageComponent {
  //eslint-disable-next-line
  @Input() content!: any;
  @Input() type!: PublicMessageType;

  public readonly isUserGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(private readonly store: Store, private dialog: MatDialog) {}

  public onEdit(): void {
    const dialogRef = this.dialog.open(EditPublicMessageDialogComponent);
    const instance = dialogRef.componentInstance;
    instance.message = this.content;
    instance.type = this.type;
  }
}
