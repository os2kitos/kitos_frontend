import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-confirmation-dialog[uuid]',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends BaseComponent {
  @Input() public title?: string = 'Default Title';
  @Input() public bodyText?: string = 'Default body text';
  @Input() public confirmText?: string = 'Ok';
  @Input() public cancelText?: string = 'Cancel';

  @Output() public okAction = new EventEmitter<string>();

  constructor(private readonly dialog: DialogRef) {
    super();
  }

  public OkResult() {
    this.dialog.close(true);
  }

  public CancelResult() {
    this.dialog.close();
  }
}
