import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
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
