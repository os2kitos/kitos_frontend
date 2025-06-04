import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-red-circle-number-icon',
  styles: '',
  template: `
    <svg width="39" height="46" viewBox="0 0 39 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="11.5" width="23" height="23" rx="11.5" fill="#DC4747" stroke="#67707E" />
      <rect x="9.5" y="16.5" width="13" height="13" rx="6.5" fill="#DC4747" stroke="#DC4747" />
      <text
        x="16"
        y="24"
        font-size="10"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        alignment-baseline="middle"
      >
        {{ number }}
      </text>
    </svg>
  `,
})
export class RedCircleNumberIconComponent {
  @Input() number?: number;
}
