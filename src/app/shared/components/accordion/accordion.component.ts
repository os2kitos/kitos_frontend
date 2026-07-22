import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';

import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ParagraphComponent } from '../paragraph/paragraph.component';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { InfoIconComponent } from '../icons/info-icon.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    CheckboxComponent,
    ParagraphComponent,
    TooltipComponent,
    InfoIconComponent
],
})
export class AccordionComponent {
  @Input() title: string | undefined;
  @Input() isExpanded = false;
  @Input() disabled = false;
  @Input() checkboxInTitle = false;
  @Input() checkboxDisabled = false;
  @Input() checkboxValue = false;
  @Input() tooltipText: string | undefined = undefined;
  @Output() checkboxChanged = new EventEmitter<boolean>();
  @Output() expandedChanged = new EventEmitter<boolean>();

  public onCheckboxToggled($event: boolean | undefined) {
    this.checkboxChanged.emit($event ?? false);
  }

  public onExpandedChanged(expanded: boolean) {
    this.expandedChanged.emit(expanded);
  }
}
