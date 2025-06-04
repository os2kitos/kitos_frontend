import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonStyle } from '../../models/buttons/button-style.model';
import { ButtonComponent } from '../buttons/button/button.component';
import { PlusIconComponent } from '../icons/plus-icon.component';

@Component({
  selector: 'app-collection-extension-button[text]',
  templateUrl: './collection-extension-button.component.html',
  styleUrls: ['./collection-extension-button.component.scss'],
  imports: [ButtonComponent, PlusIconComponent],
})
export class CollectionExtensionButtonComponent {
  @Input() public text!: string;
  @Input() public disabled = false;
  @Input() public buttonStyle: ButtonStyle = 'primary';
  @Output() public clicked = new EventEmitter<void>();

  onClicked() {
    this.clicked.emit();
  }
}
