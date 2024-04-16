import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-collection-extension-button[text]',
  templateUrl: './collection-extension-button.component.html',
  styleUrls: ['./collection-extension-button.component.scss'],
})
export class CollectionExtensionButtonComponent {
  @Input() public text!: string;
  @Input() public disabled = false;
  @Input() public buttonStyle: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Output() public clicked = new EventEmitter<void>();

  onClicked() {
    this.clicked.emit();
  }
}
