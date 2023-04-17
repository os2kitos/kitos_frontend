import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MaterialIconsConfigService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  public configureCustomIcons() {
    //Define custom icons
    const iconsFromLocalFileAssets = [
      {
        id: 'custom-mat-calendar-toggle-icon',
        url: `${environment.siteBasePath}/assets/img/calendar.svg`, //TODO: Consider an icon resolver?
      },
    ];
    //Register all custom icons
    iconsFromLocalFileAssets.forEach((icon) =>
      this.iconRegistry.addSvgIcon(icon.id, this.sanitizer.bypassSecurityTrustResourceUrl(icon.url))
    );
  }
}
