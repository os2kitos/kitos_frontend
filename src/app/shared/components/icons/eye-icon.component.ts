import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-eye-icon',
  styles: [':host {display: contents}'],
  templateUrl: './eye.svg',
})
export class EyeIconComponent {
  @Input() public disabled = false;
}
