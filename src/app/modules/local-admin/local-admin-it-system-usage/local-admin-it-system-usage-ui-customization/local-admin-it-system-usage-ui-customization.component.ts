import { Component } from '@angular/core';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { UiConfigComponent } from '../../ui-config/ui-config.component';

@Component({
  selector: 'app-local-admin-it-system-usage-ui-customization',
  templateUrl: './local-admin-it-system-usage-ui-customization.component.html',
  styleUrl: './local-admin-it-system-usage-ui-customization.component.scss',
  imports: [CardComponent, UiConfigComponent],
})
export class LocalAdminItSystemUsageUiCustomizationComponent {
  public readonly itSystemUsageModuleKey = UIModuleConfigKey.ItSystemUsage;
}
