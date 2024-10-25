import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UIConfigNodeViewModel } from 'src/app/shared/models/ui-config/ui-config-node-view-model.model';
import { UINodeCustomization } from 'src/app/shared/models/ui-config/ui-node-customization';

@Component({
  selector: 'app-ui-config-tab-section',
  templateUrl: './ui-config-tab-section.component.html',
  styleUrl: './ui-config-tab-section.component.scss',
})
export class UiConfigTabSectionComponent {
  @Input() tabViewModel!: UIConfigNodeViewModel;
  @Input() moduleEnabled!: Observable<boolean | undefined>;
  @Output() checkboxChanged = new EventEmitter<UINodeCustomization>();

  public tabViewModelHasChildren(): boolean {
    return this.tabViewModel.children !== undefined && this.tabViewModel.children.length > 0;
  }

  public onCheckboxChanged($event: UINodeCustomization) {
    this.checkboxChanged.emit($event);
  }
}
