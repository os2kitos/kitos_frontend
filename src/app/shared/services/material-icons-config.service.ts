import { PathLocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { trim } from 'lodash';

@Injectable({ providedIn: 'root' })
export class MaterialIconsConfigService {
  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    private readonly pathLocationStrategy: PathLocationStrategy
  ) {}

  public configureCustomIcons() {
    const root = this.resolveAssetUrlRoot();
    //Define custom icons
    const iconsFromLocalFileAssets = [
      {
        id: 'custom-mat-calendar-toggle-icon',
        url: `${root}/assets/img/calendar.svg`,
      },
    ];
    //Register all custom icons
    iconsFromLocalFileAssets.forEach((icon) =>
      this.iconRegistry.addSvgIcon(icon.id, this.sanitizer.bypassSecurityTrustResourceUrl(icon.url))
    );
  }

  private resolveAssetUrlRoot() {
    const basePath = trim(this.pathLocationStrategy.getBaseHref(), '/');
    const origin = window.location.origin;
    const root = basePath === '' ? origin : `${origin}/${basePath}`;
    return root;
  }
}
