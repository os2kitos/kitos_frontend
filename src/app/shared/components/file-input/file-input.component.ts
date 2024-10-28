import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss',
})
export class FileInputComponent {
  @Output() public fileImported = new EventEmitter<Event>();

  public fileImport(event: Event): void {
    this.fileImported.emit(event);
  }
}
