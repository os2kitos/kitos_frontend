import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input() iconType!: IconType;
}

export type IconType = 'document' | 'organization' | 'systems' | 'clipboard' | 'folder-important' | 'bulk-create';
