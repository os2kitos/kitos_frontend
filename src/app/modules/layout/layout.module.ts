import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChooseOrganizationComponent } from './choose-organization/choose-organization.component';
import { EnvRibbonComponent } from './env-ribbon/env-ribbon.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuComponent } from './menu/menu.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@NgModule({
  declarations: [NavBarComponent, MenuComponent, MenuItemComponent, EnvRibbonComponent, ChooseOrganizationComponent],
  imports: [CommonModule, RouterModule, MatToolbarModule, MatBadgeModule, MatMenuModule, SharedModule],
  exports: [NavBarComponent],
})
export class LayoutModule {}
