import { Component, Input } from '@angular/core';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';

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
  @Input() public color: 'error' | 'primary-dark' | 'white' | undefined = undefined;
}
