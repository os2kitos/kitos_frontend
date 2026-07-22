import { Component } from '@angular/core';
import { BaseGlobalAdminModuleTabComponent } from '../base-global-admin-module-tab';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { CardComponent } from '../../../shared/components/card/card.component';

import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { GlobalOptionTypeViewComponent } from '../../../shared/components/global-option-type-view/global-option-type-view.component';

@Component({
  selector: 'app-global-admin-it-contract',
  templateUrl: './global-admin-it-contract.component.html',
  styleUrl: './global-admin-it-contract.component.scss',
  imports: [SegmentComponent, CardComponent, StandardVerticalContentGridComponent, GlobalOptionTypeViewComponent],
})
export class GlobalAdminItContractComponent extends BaseGlobalAdminModuleTabComponent {}
