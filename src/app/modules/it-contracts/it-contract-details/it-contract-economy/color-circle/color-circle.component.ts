import { Component, Input } from '@angular/core';
import { APIPaymentResponseDTO } from 'src/app/api/v2';

@Component({
  selector: 'app-color-circle[color]',
  templateUrl: './color-circle.component.html',
  styleUrl: './color-circle.component.scss',
})
export class ColorCircleComponent {
  @Input() public color!: APIPaymentResponseDTO.AuditStatusEnum | undefined;
}
