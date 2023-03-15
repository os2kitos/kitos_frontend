import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.scss']
})

export class ParagraphComponent {
  @Input() paragraphText: string | undefined;
  @Input() paragraphSize: 'x-large' | 'large' | 'medium' | 'small' | 'x-small' = 'small';
}
