import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';
import { selectModuleVisibility } from 'src/app/store/organization/selectors';
import { selectModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';
import { StandardVerticalContentGridComponent } from '../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { AsyncPipe } from '@angular/common';
import { UiConfigTabSectionComponent } from './ui-config-tab-section/ui-config-tab-section.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-ui-config',
  templateUrl: './ui-config.component.html',
  styleUrl: './ui-config.component.scss',
  imports: [
    StandardVerticalContentGridComponent,
    UiConfigTabSectionComponent,
    LoadingComponent,
    AsyncPipe
],
})
export class UiConfigComponent implements OnInit {
  constructor(private store: Store) {}

  @Input() moduleKey!: UIModuleConfigKey;

  public uiConfig$!: Observable<UIModuleConfig | undefined>;
  public moduleEnabled$!: Observable<boolean | undefined>;

  ngOnInit(): void {
    this.uiConfig$ = this.store.select(selectModuleConfig(this.moduleKey));
    this.moduleEnabled$ = this.store.select(selectModuleVisibility(this.moduleKey));
  }
}
