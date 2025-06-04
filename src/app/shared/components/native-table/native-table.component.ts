import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-native-table',
  templateUrl: './native-table.component.html',
  styleUrls: ['./native-table.component.scss'],
  imports: [NgClass],
})
export class NativeTableComponent {
  @Input() public tableLayout: 'fixed' | 'auto' = 'auto';
  @Input() public withOutline: boolean = false;
  @Input() public isDisplayBlock: boolean = false;
  @Input() public includeDividers: boolean = false;
}
