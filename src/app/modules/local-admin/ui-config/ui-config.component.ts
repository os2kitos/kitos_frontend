import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIModuleConfig } from 'src/app/shared/models/ui-config/ui-module-config.model';
import { selectModuleVisibility } from 'src/app/store/organization/selectors';
import { selectModuleConfig } from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-ui-config',
  templateUrl: './ui-config.component.html',
  styleUrl: './ui-config.component.scss',
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
