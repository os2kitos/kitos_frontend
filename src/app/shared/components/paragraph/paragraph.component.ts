import { Component, Input } from '@angular/core';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent {
  @Input() public paragraphSize: ParagraphFontSizeTypes = 'small';
}
