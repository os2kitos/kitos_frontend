import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { validateUrl } from 'src/app/shared/helpers/link.helpers';
import { PublicMessage } from 'src/app/shared/models/public-messages/public-message.model';
import { selectUserIsGlobalAdmin } from 'src/app/store/user-store/selectors';
import { EditPublicMessageDialogComponent } from '../edit-public-message-dialog/edit-public-message-dialog.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { DialogComponent } from '../../../../shared/components/dialogs/dialog/dialog.component';
import { DialogActionsComponent } from '../../../../shared/components/dialogs/dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-public-message-dialog',
  templateUrl: './public-message-dialog.component.html',
  styleUrl: './public-message-dialog.component.scss',
  imports: [NgIf, DialogComponent, DialogActionsComponent, ButtonComponent, AsyncPipe],
})
export class PublicMessageDialogComponent {
  @Input() publicMessage$!: Observable<PublicMessage>;

  public readonly isGlobalAdmin$ = this.store.select(selectUserIsGlobalAdmin);

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {}

  public openEditDialog(publicMessage: PublicMessage): void {
    const dialogRef = this.dialog.open(EditPublicMessageDialogComponent);
    dialogRef.componentInstance.publicMessage = publicMessage;
  }

  public hasValidUrl(publicMessage: PublicMessage): boolean {
    const url = publicMessage.link;
    return !!url && validateUrl(url);
  }
}
