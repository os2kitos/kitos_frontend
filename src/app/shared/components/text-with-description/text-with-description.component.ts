import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-with-description[text]',
  templateUrl: './text-with-description.component.html',
  styleUrls: ['./text-with-description.component.scss'],
})
export class TextWithDescriptionComponent {
  @Input() public text!: string;
  @Input() public description?: string;
}
