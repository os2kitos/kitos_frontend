import { Component, Input } from '@angular/core';
import { APIPaymentAuditStatus } from 'src/app/api/v2';

import { GreenCircleIconComponent } from '../../../../../shared/components/icons/green-circle-icon.component';
import { OrangeCircleIconComponent } from '../../../../../shared/components/icons/orange-circle-icon.component';
import { RedCircleIconComponent } from '../../../../../shared/components/icons/red-circle-icon.component';
import { WhiteCircleIconComponent } from '../../../../../shared/components/icons/white-circle-icon.component';

@Component({
  selector: 'app-color-circle[color]',
  templateUrl: './color-circle.component.html',
  styleUrl: './color-circle.component.scss',
  imports: [
    WhiteCircleIconComponent,
    RedCircleIconComponent,
    OrangeCircleIconComponent,
    GreenCircleIconComponent
],
})
export class ColorCircleComponent {
  @Input() public color!: APIPaymentAuditStatus | undefined;
}
