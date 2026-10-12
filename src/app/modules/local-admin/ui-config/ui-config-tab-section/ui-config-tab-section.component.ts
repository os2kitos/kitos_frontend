import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { APICustomizedUINodeResponseDTO } from 'src/app/api/v2';
import { CheckboxComponent } from 'src/app/shared/components/checkbox/checkbox.component';
import { UIModuleConfigKey } from 'src/app/shared/enums/ui-module-config-key';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { UINodeCustomization } from 'src/app/shared/models/ui-config/ui-node-customization';
import { UIModuleConfigActions } from 'src/app/store/organization/ui-module-customization/actions';
import { selectUIConfigLoading } from 'src/app/store/organization/ui-module-customization/selectors';
import { AccordionComponent } from '../../../../shared/components/accordion/accordion.component';
import { AccordionHeaderComponent } from '../../../../shared/components/accordion-header/accordion-header.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { CheckboxButtonComponent } from '../../../../shared/components/buttons/checkbox-button/checkbox-button.component';
import { DividerComponent } from '../../../../shared/components/divider/divider.component';
import { InfoIconComponent } from '../../../../shared/components/icons/info-icon.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';

@Component({
  selector: 'app-ui-config-tab-section',
  templateUrl: './ui-config-tab-section.component.html',
  styleUrl: './ui-config-tab-section.component.scss',
  imports: [
    AccordionComponent,
    AccordionHeaderComponent,
    ButtonComponent,
    DividerComponent,
    ParagraphComponent,
    StandardVerticalContentGridComponent,
    CheckboxButtonComponent,
    TooltipComponent,
    InfoIconComponent,
    CheckboxComponent,
    AsyncPipe,
  ],
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

  public noChildrenLabel(): string {
    return this.tabViewModel.fullKey.endsWith('.usageArchive') ? $localize`undermodul` : $localize`faneblad`;
  }

  public recommendableFields(): UIConfigNodeViewModel[] {
    return this.tabViewModel.children?.filter((field) => !field.cannotBeRecommended && field.isEnabled) ?? [];
  }

  public hasRecommendedFields(): boolean {
    return this.recommendableFields().some((field) => field.isRecommended);
  }

  public toggleAllRecommended(): void {
    if (!this.tabViewModel.isEnabled) return;

    const recommended = !this.hasRecommendedFields();
    const updatedNodeRequests = this.recommendableFields()
      .filter((field) => (field.isRecommended ?? false) !== recommended)
      .map((field) => ({ key: field.fullKey, recommended }));

    if (updatedNodeRequests.length === 0) return;

    this.store.dispatch(
      UIModuleConfigActions.putUIModuleCustomizations({ module: this.moduleKey, updatedNodeRequests }),
    );
  }

  private findFieldViewModel(fullKey: string): UIConfigNodeViewModel | undefined {
    if (this.tabViewModel.fullKey === fullKey) return this.tabViewModel;
    return this.tabViewModel.children?.find((x) => x.fullKey === fullKey);
  }

  private dispatchPut(dto: APICustomizedUINodeResponseDTO) {
    this.store.dispatch(
      UIModuleConfigActions.putUIModuleCustomization({ module: this.moduleKey, updatedNodeRequest: dto }),
    );
  }

  public onEnabledCheckboxChanged($event: UINodeCustomization) {
    const enabled = $event.enabled ?? false;
    const fullKey = $event.fullKey;
    const fieldViewModel = this.findFieldViewModel(fullKey);
    const fieldViewModelRecommended = fieldViewModel?.isRecommended ?? false;
    const dto: APICustomizedUINodeResponseDTO = {
      enabled: enabled,
      key: fullKey,
      recommended: enabled ? fieldViewModelRecommended : false,
    };
    this.dispatchPut(dto);
  }

  public onRecommendedCheckboxChanged($event: UINodeCustomization) {
    const fullKey = $event.fullKey;
    const fieldViewModel = this.findFieldViewModel(fullKey);
    const dto: APICustomizedUINodeResponseDTO = {
      key: fullKey,
      recommended: fieldViewModel?.isEnabled && !fieldViewModel.cannotBeRecommended
        ? $event.recommended
        : false,
    };
    this.dispatchPut(dto);
  }

  public checkboxDisabled(): Observable<boolean> {
    return this.moduleEnabled$.pipe(
      map((moduleEnabled) => {
        return this.tabViewModel.isObligatory === true || moduleEnabled === false;
      }),
    );
  }
}
