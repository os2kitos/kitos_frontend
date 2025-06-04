import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { NgIf, NgFor } from '@angular/common';
import { DialogActionsComponent } from '../dialog-actions/dialog-actions.component';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
  imports: [DialogComponent, ParagraphComponent, NgIf, NgFor, DialogActionsComponent, ButtonComponent],
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
