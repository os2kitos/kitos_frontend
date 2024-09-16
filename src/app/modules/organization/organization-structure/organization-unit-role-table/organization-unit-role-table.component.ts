import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-organization-unit-role-table',
  templateUrl: './organization-unit-role-table.component.html',
  styleUrl: './organization-unit-role-table.component.scss'
})
export class OrganizationUnitRoleTableComponent {

  @Input() currentUnitUuid$!: Observable<string>;

  public readonly hasModifyPermissions$ = of(true); //TODO

}
