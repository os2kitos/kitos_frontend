import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-circle',
  templateUrl: './number-circle.component.html',
  styleUrl: './number-circle.component.scss'
})
export class NumberCircleComponent {

  @Input() public number!: number;
}
