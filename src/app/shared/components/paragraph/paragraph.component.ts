import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';
import { IconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { HelpIconComponent } from '../icons/help.component';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
  imports: [CommonModule, IconButtonComponent, HelpIconComponent],
})
export class ParagraphComponent {
  @Input() public paragraphSize: ParagraphFontSizeTypes = 'small';
  @Input() public cropOnOverflow = false;
  @Input() public breakWordOnOverflow = false;
  @Input() public wrapOnOverflow = false;
  @Input() public strikeThrough = false;
  @Input() public dimmed = false;
  @Input() public bold = false;
  @Input() public color: 'error' | 'primary-dark' | 'grey' | 'white' | undefined = undefined;
  @Input() public helpTextKey?: string = undefined;
  @Input() public displayFlex = true;

  constructor(private dialog: MatDialog) {}

  public openHelpTextDialog() {
    import('../help-dialog/help-dialog.component').then(({ HelpDialogComponent }) => {
      const dialogRef = this.dialog.open(HelpDialogComponent);
      dialogRef.componentInstance.helpTextKey = this.helpTextKey;
    });
  }
}
