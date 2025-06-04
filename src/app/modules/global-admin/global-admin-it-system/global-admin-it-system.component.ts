import { Component } from '@angular/core';
import { BaseGlobalAdminModuleTabComponent } from '../base-global-admin-module-tab';
import { SegmentComponent } from '../../../shared/components/segment/segment.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { NgIf } from '@angular/common';
import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { GlobalOptionTypeViewComponent } from '../../../shared/components/global-option-type-view/global-option-type-view.component';

@Component({
  selector: 'app-global-admin-it-system',
  templateUrl: './global-admin-it-system.component.html',
  styleUrl: './global-admin-it-system.component.scss',
  imports: [SegmentComponent, CardComponent, NgIf, StandardVerticalContentGridComponent, GlobalOptionTypeViewComponent],
})
export class GlobalAdminItSystemComponent extends BaseGlobalAdminModuleTabComponent {}
