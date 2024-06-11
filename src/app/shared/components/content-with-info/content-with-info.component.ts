import { Component, Input } from '@angular/core';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';

@Component({
  selector: 'app-content-with-info',
  templateUrl: './content-with-info.component.html',
  styleUrl: './content-with-info.component.scss',
})
export class ContentWithInfoComponent {
  @Input() public text!: string;
  @Input() public size: ParagraphFontSizeTypes = 'x-small';
}
