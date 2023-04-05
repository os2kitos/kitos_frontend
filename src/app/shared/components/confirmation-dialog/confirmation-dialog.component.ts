import { Component, Input, OnInit } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { BaseComponent } from '../../base/base.component';
import { CONFIRM_TEXT, DECLINE_TEXT, NO_TEXT, YES_TEXT } from '../../constants';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends BaseComponent implements OnInit {
  //TODO: Add localize
  @Input() public title = $localize`Bekræft handling`;
  @Input() public bodyText = $localize`Er du sikker?`;
  @Input() public customConfirmText?: string;
  @Input() public customDeclineText?: string;
  @Input() public confirmationType: 'YesNo' | 'OkCancel' | 'Custom' = 'YesNo';

  public confirmText = '';
  public declineText = '';

  constructor(private readonly dialog: DialogRef) {
    super();
  }
  ngOnInit(): void {
    switch (this.confirmationType) {
      case 'YesNo':
        this.confirmText = YES_TEXT;
        this.declineText = NO_TEXT;
        break;
      case 'OkCancel':
        this.confirmText = CONFIRM_TEXT;
        this.declineText = DECLINE_TEXT;
        break;
      case 'Custom':
        this.confirmText = this.customConfirmText ?? YES_TEXT;
        this.declineText = this.customDeclineText ?? NO_TEXT;
        break;
      default:
        this.confirmText = YES_TEXT;
        this.declineText = NO_TEXT;
        break;
    }
  }

  public OkResult() {
    this.dialog.close(true);
  }

  public CancelResult() {
    this.dialog.close();
  }
}
