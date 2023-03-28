import { Component } from '@angular/core';

@Component({
  selector: 'app-clipboard-icon',
  styles: [':host {display: contents}'],
  templateUrl: './clipboard.svg',
})
export class ClipboardIconComponent {}
