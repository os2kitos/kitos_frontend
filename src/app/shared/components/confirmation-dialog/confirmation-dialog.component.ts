import { Component, Input, OnInit } from '@angular/core';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { BaseComponent } from '../../base/base.component';

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
    console.log();
    switch (this.confirmationType) {
      case 'YesNo':
        this.confirmText = $localize`Ja`;
        this.declineText = $localize`Nej`;
        break;
      case 'OkCancel':
        this.confirmText = $localize`Ok`;
        this.declineText = $localize`Annuller`;
        break;
      case 'Custom':
        this.confirmText = this.customConfirmText ?? $localize`Ja`;
        this.declineText = this.customDeclineText ?? $localize`Nej`;
        break;
      default:
        this.confirmText = $localize`Ja`;
        this.declineText = $localize`Nej`;
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
