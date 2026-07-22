
import { Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { KitosKIconComponent } from '../icons/kitos-k-icon.component';

@Component({
  selector: 'app-loading',
  templateUrl: 'loading.component.html',
  styleUrls: ['loading.component.scss'],
  imports: [KitosKIconComponent, MatProgressSpinner],
})
export class LoadingComponent {
  @Input() public type: 'kitos' | 'material' = 'kitos';
}
