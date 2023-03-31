import { Component, Input } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends BaseComponent {
  @Input() public title?: string = 'Default Title';
  @Input() public bodyText?: string = 'Default body text';
  @Input() public confirmText?: string = 'Ok';
  @Input() public cancelText?: string = 'Cancel';

  constructor(private readonly dialog: DialogRef) {
    super();
  }

  public OkResult() {
    return this.dialog.close(true);
  }

  public CancelResult() {
    return this.dialog.close(false);
  }
}
