import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent {
  @Input() public paragraphSize: ParagraphFontSizeTypes = 'small';
  @Input() public cropOnOverflow = false;
  @Input() public strikeThrough = false;
  @Input() public dimmed = false;
  @Input() public bold = false;
  @Input() public color: 'error' | 'primary-dark' | 'grey' | 'white' | undefined = undefined;
  @Input() public helpTextKey?: string = undefined;

  constructor(private dialog: MatDialog) {}

  public openHelpTextDialog() {
    const dialogRef = this.dialog.open(HelpDialogComponent);
    (dialogRef.componentInstance as HelpDialogComponent).helpTextKey = this.helpTextKey;
  }
}
