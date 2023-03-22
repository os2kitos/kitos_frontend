import { Component, Input } from '@angular/core';
import { SizeTypes } from '../../models/sizes/sizes.model';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent {
  @Input() public paragraphSize: SizeTypes = 'small';
}
