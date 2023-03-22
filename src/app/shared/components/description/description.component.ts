import { Component, Input } from '@angular/core';
import { SizeTypes } from '../../models/sizes/sizes.model';

@Component({
  selector: 'app-description[descriptionText]',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent {
  @Input() public descriptionText: string | undefined = '';
  @Input() public lineHeight: SizeTypes = 'small';
  @Input() public height: SizeTypes = 'small';

  public show = false;
}
