import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-details-header',
  templateUrl: './details-header.component.html',
  styleUrl: './details-header.component.scss',
})
export class DetailsHeaderComponent extends BaseComponent {
  @Input() title$!: Observable<string>;
}
