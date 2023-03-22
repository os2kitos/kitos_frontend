import { Component, Input } from '@angular/core';
import { DescriptionHeightSizeTypes } from '../../models/sizes/description-height-sizes.model';
import { ParagraphFontSizeTypes } from '../../models/sizes/paragraph-font-sizes.model';

@Component({
  selector: 'app-description[descriptionText]',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent {
  @Input() public descriptionText: string | undefined = '';
  @Input() public fontSize: ParagraphFontSizeTypes = 'small';
  @Input() public height: DescriptionHeightSizeTypes = 'small';

  public show = false;
}
