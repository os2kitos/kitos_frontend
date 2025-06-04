import { Component, Input } from '@angular/core';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { NgIf } from '@angular/common';
import { CheckPositiveGreenIconComponent } from '../icons/check-positive-green.component';
import { CheckNegativeGrayIconComponent } from '../icons/check-negative-gray.component';

@Component({
  selector: 'app-boolean-circle',
  templateUrl: './boolean-circle.component.html',
  styleUrl: './boolean-circle.component.scss',
  imports: [TooltipComponent, NgIf, CheckPositiveGreenIconComponent, CheckNegativeGrayIconComponent],
})
export class BooleanCircleComponent {
  @Input() value!: boolean;
  @Input() positiveTooltipText: string = '';
  @Input() negativeTooltipText: string = '';
}
