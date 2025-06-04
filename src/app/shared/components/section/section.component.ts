import { Component, Input } from '@angular/core';
import { ParagraphComponent } from '../paragraph/paragraph.component';

@Component({
  selector: 'app-section[title]',
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
  imports: [ParagraphComponent],
})
export class SectionComponent {
  @Input() title!: string;
  @Input() color: 'white' | 'gray' | undefined = 'gray';
}
