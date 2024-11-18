import { Component, Input } from '@angular/core';
import { OrganizationDropdownComponentStore } from './organization-dropdown.component-store';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-organization-dropdown',
  templateUrl: './organization-dropdown.component.html',
  styleUrl: './organization-dropdown.component.scss',
  providers: [OrganizationDropdownComponentStore],
})
export class OrganizationDropdownComponent {
  @Input() formGroup!: FormGroup;
  @Input() formName!: string;

  constructor(private componentStore: OrganizationDropdownComponentStore) {}

  public readonly isLoading$ = this.componentStore.loading$;
  public readonly organizations$ = this.componentStore.organizations$;

  public searchOrganizations(search: string): void {
    this.componentStore.searchOrganizations(search);
  }
}
