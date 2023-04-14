import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MaterialIconsConfigService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  public configureCustomIcons() {
    //Define custom icons
    const iconsFromLocalFileAssets = [
      {
        id: 'custom-mat-calendar-toggle-icon',
        url: '../assets/img/calendar.svg',
      },
    ];

    //Register all custom icons
    iconsFromLocalFileAssets.forEach((icon) =>
      this.iconRegistry.addSvgIcon(icon.id, this.sanitizer.bypassSecurityTrustResourceUrl(icon.url))
    );
  }
}
