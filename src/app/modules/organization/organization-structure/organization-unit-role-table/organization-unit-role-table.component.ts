import { Component, Input } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';
import { combineLatest, combineLatestWith, first, map, Observable, of } from 'rxjs';
import { IRoleAssignment } from 'src/app/shared/models/helpers/read-model-role-assignments';

@Component({
  selector: 'app-organization-unit-role-table',
  templateUrl: './organization-unit-role-table.component.html',
  styleUrl: './organization-unit-role-table.component.scss',
})
export class OrganizationUnitRoleTableComponent {
  @Input() currentUnitUuid$!: Observable<string>;
  @Input() currentUnitName$!: Observable<string>;

  public readonly hasModifyPermissions$ = of(true); //TODO

  public filterOutSubunits(assignments: Observable<IRoleAssignment[]>): Observable<IRoleAssignment[]> {
    console.log("real function");
    return assignments.pipe(
      concatLatestFrom(() => this.currentUnitName$),
      map(([assignments, currentUnitName]) =>
        assignments.filter((assignment) => assignment.unitName === currentUnitName)
      )
    );
  }
}
