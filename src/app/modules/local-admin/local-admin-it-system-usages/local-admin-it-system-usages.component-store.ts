import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { UIModuleCustomization } from 'src/app/shared/models/ui-config/ui-module-customization.model';

interface State {
  uiConfigViewModels: UIConfigNodeViewModel[];
}

@Injectable()
export class LocalAdminItSystemUsagesComponentStore extends ComponentStore<State> {
  public readonly uiConfigViewModels$ = this.select((state) => state.uiConfigViewModels);

  constructor() {
    super({ uiConfigViewModels: [] });
  }

  private updateUIModuleCustomizations = this.updater((state, uiModuleCustomizations: UIConfigNodeViewModel[]):
  State => ({ ...state, uiConfigViewModels: uiModuleCustomizations }));

}
