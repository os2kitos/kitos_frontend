import { Component } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { LocalOptionTypeViewComponent } from '../../../../shared/components/local-option-type-view/local-option-type-view.component';

@Component({
  selector: 'app-local-admin-it-system-usage-option-types',
  templateUrl: './local-admin-it-system-usage-option-types.component.html',
  styleUrl: './local-admin-it-system-usage-option-types.component.scss',
  imports: [CardComponent, CardHeaderComponent, StandardVerticalContentGridComponent, LocalOptionTypeViewComponent],
})
export class LocalAdminItSystemUsageOptionTypesComponent {}
