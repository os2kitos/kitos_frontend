import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomizedUINode } from 'src/app/shared/models/ui-config/customized-ui-node.model';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';

@Component({
  selector: 'app-ui-config-tab-section',
  templateUrl: './ui-config-tab-section.component.html',
  styleUrl: './ui-config-tab-section.component.scss',
})
export class UiConfigTabSectionComponent {
  @Input() tabViewModel!: UIConfigNodeViewModel;
  @Input() formGroup!: FormGroup;
  @Output() checkboxChanged = new EventEmitter<CustomizedUINode>();

  public tabViewModelHasChildren(): boolean {
    return this.tabViewModel.children !== undefined && this.tabViewModel.children.length > 0;
  }

  public onCheckboxChanged($event: CustomizedUINode) {
    this.checkboxChanged.emit($event);
  }
}
