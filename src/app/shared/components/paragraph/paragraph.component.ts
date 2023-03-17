import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss'],
})
export class ParagraphComponent {
  @Input() public paragraphSize: 'x-large' | 'large' | 'medium' | 'small' | 'x-small' = 'small';
}
