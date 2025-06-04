import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/components/card/card.component';
import { GlobalAdminOrganizationsGridComponent } from './global-admin-organizations-grid/global-admin-organizations-grid.component';

@Component({
  selector: 'app-global-admin-organizations',
  templateUrl: './global-admin-organizations.component.html',
  styleUrl: './global-admin-organizations.component.scss',
  imports: [CardComponent, GlobalAdminOrganizationsGridComponent],
})
export class GlobalAdminOrganizationsComponent {}
