import { Store } from '@ngrx/store';
import { APICustomizedUINodeDTO } from 'src/app/api/v1';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { UINodeCustomization } from 'src/app/shared/models/ui-config/ui-node-customization';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { selectUIConfigLoading } from 'src/app/store/organization/ui-module-customization/selectors';

@Component({
  selector: 'app-ui-config-tab-section',
  templateUrl: './ui-config-tab-section.component.html',
  styleUrl: './ui-config-tab-section.component.scss',
})
export class UiConfigTabSectionComponent {
  @Input() tabViewModel!: UIConfigNodeViewModel;
  @Input() moduleEnabled$!: Observable<boolean | undefined>;
  @Input() moduleKey!: UIModuleConfigKey;

  constructor(private store: Store) {}

  public readonly loading$ = this.store.select(selectUIConfigLoading);

  public tabViewModelHasChildren(): boolean {
    return this.tabViewModel.children !== undefined && this.tabViewModel.children.length > 0;
  }

  public onCheckboxChanged($event: UINodeCustomization) {
    const dto: APICustomizedUINodeDTO = { enabled: $event.enabled, key: $event.fullKey };
    this.store.dispatch(
      UIModuleConfigActions.putUIModuleCustomization({ module: this.moduleKey, updatedNodeRequest: dto })
    );
  }

  public checkboxDisabled(): Observable<boolean> {
    return this.moduleEnabled$.pipe(
      map((moduleEnabled) => {
        return this.tabViewModel.isObligatory === true ||  moduleEnabled === false;
      })
    );
  }
}
