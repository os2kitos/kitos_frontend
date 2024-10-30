import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  @Input() title: string | undefined;
  @Input() isExpandedByDefault = false;
  @Input() disabled = false;
  @Input() checkboxInTitle = false;
  @Input() checkboxDisabled = false;
  @Input() checkboxValue = false;
  @Input() checkboxTooltipText: string | undefined = undefined;
  @Output() checkboxChanged = new EventEmitter<boolean>();

  public onCheckboxToggled($event: boolean | undefined) {
    this.checkboxChanged.emit($event ?? false);
  }
}
