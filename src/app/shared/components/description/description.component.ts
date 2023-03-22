import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-description[descriptionText]',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent {
  @Input() public descriptionText: string | undefined = '';
  public show = false;
}
