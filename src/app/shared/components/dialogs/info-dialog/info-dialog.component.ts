import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
})
export class InfoDialogComponent {
  @Input() public title = $localize`Information`;
  @Input() public bodyText = $localize`Er du sikker?`;
  @Input() public listTexts?: string[];
  @Input() public closeText = $localize`Ok`;
  @Input() public customDeclineText?: string;

  constructor(private readonly dialog: MatDialogRef<InfoDialogComponent>) {}

  public Close() {
    this.dialog.close();
  }
}
