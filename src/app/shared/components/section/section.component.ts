import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section[title]',
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent {
  @Input() title!: string;
  @Input() color: 'white' | 'gray' | undefined = 'gray';
}
