import { Component, Inject, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../../base/base.component';
import { CONFIRM_TEXT, DECLINE_TEXT, NO_TEXT, YES_TEXT } from '../../../constants';
import { ConfirmationStyle } from '../../../models/confirmation/confirmation-style.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent extends BaseComponent implements OnInit {
  @Input() public title = $localize`Bekræft handling`;
  @Input() public bodyText = $localize`Er du sikker?`;
  @Input() public confirmColor: ThemePalette = 'primary';
  @Input() public customConfirmText?: string;
  @Input() public customDeclineText?: string;
  @Input() public confirmationType: ConfirmationStyle = 'YesNo';

  public confirmText = '';
  public declineText = '';

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, bodyText: string, confirmText: string, declineText: string }
  ) {
    super();
  }
  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);
      this.title = this.data.title;
      this.bodyText = this.data.bodyText;
      this.confirmText = this.data.confirmText;
      this.declineText = this.data.declineText;
      return;
    }
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
    this.dialog.close(false);
  }
}
