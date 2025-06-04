import { Component } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { LocalOptionTypeViewComponent } from '../../../../shared/components/local-option-type-view/local-option-type-view.component';

@Component({
  selector: 'app-local-admin-it-system-usage-role-option-types',
  templateUrl: './local-admin-it-system-usage-role-option-types.component.html',
  styleUrl: './local-admin-it-system-usage-role-option-types.component.scss',
  imports: [CardComponent, LocalOptionTypeViewComponent],
})
export class LocalAdminItSystemUsageRoleOptionTypesComponent {}
