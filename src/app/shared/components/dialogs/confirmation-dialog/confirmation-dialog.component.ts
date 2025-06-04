import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../../base/base.component';
import { CONFIRM_TEXT, DECLINE_TEXT, NO_TEXT, YES_TEXT } from '../../../constants/constants';
import { ConfirmationStyle } from '../../../models/confirmation/confirmation-style.model';
import { DialogComponent } from '../dialog/dialog.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { DialogActionsComponent } from '../dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  imports: [DialogComponent, ParagraphComponent, DialogActionsComponent, ButtonComponent],
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

  constructor(private readonly dialog: MatDialogRef<ConfirmationDialogComponent>) {
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
    this.dialog.close(false);
  }
}
