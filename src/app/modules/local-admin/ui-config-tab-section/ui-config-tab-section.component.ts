import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';

export interface UiModuleConfigCheckboxChangedEvent {
  value: boolean;
  fullKey?: string;
}

@Component({
  selector: 'app-ui-config-tab-section',
  templateUrl: './ui-config-tab-section.component.html',
  styleUrl: './ui-config-tab-section.component.scss',
})
export class UiConfigTabSectionComponent {
  @Input() tabViewModel!: UIConfigNodeViewModel;
  @Input() formGroup!: FormGroup;
  @Output() checkboxChanged = new EventEmitter<UiModuleConfigCheckboxChangedEvent>();

  public tabViewModelHasChildren(): boolean {
    return this.tabViewModel.children !== undefined && this.tabViewModel.children.length > 0;
  }

  public onCheckboxChanged($event: UiModuleConfigCheckboxChangedEvent) {
    console.log('changed checkbox' + JSON.stringify($event));
    this.checkboxChanged.emit($event);
  }
}
