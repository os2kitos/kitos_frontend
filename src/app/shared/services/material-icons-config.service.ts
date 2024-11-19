import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppRootUrlResolverService } from './app-root-url-resolver.service';

@Injectable({ providedIn: 'root' })
export class MaterialIconsConfigService {
  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    private readonly appRootUrlLocationStrategy: AppRootUrlResolverService
  ) {}

  public configureCustomIcons() {
    const root = this.appRootUrlLocationStrategy.resolveRootUrl();
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
}
