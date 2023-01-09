import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
})
export class GridComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() data: any[] = [];
  @Input() loading = false;
}
