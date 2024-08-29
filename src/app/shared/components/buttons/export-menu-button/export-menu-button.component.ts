import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-export-menu-button',
  templateUrl: './export-menu-button.component.html',
  styleUrl: './export-menu-button.component.scss'
})
export class ExportMenuButtonComponent {
  @Input() exportMethod!: (exportAllColumns: boolean) => void;

  triggerMethod(exportAllColumns: boolean): void {
    if (this.exportMethod) {
      this.exportMethod(exportAllColumns);
    }
  }
}
