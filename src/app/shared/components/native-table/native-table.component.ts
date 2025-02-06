import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-native-table',
  templateUrl: './native-table.component.html',
  styleUrls: ['./native-table.component.scss'],
})
export class NativeTableComponent {
  @Input() public tableLayout: 'fixed' | 'auto' = 'auto';
  @Input() public withOutline: boolean = false;
  @Input() public isDisplayBlock: boolean = false;
  @Input() public includeDividers: boolean = false;
}
