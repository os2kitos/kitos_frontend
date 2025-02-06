import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { combineLatest, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { APIV2OrganizationsInternalINTERNALService } from 'src/app/api/v2';
import { mapConflictsDtoToOrganizationRemovalConflicts } from 'src/app/shared/helpers/removal-conflicts.helper';
import { OrganizationRemovalConflicts } from 'src/app/shared/models/global-admin/organization-removal-conflicts.model';
import { RemovalConflict, RemovalConflictType } from './removal-conflict-table/removal-conflict-table.component';

interface State {
  removalConflicts?: OrganizationRemovalConflicts;
  isLoading: boolean;
}

@Injectable()
export class DeleteOrganizationComponentStore extends ComponentStore<State> {
  constructor(private apiService: APIV2OrganizationsInternalINTERNALService) {
    super({ removalConflicts: undefined, isLoading: false });
  }

  public readonly removalConflicts$ = this.select((state) => state.removalConflicts);
  public readonly isLoading$ = this.select((state) => state.isLoading);

  private updateConsequences = this.updater(
    (state, consequences: OrganizationRemovalConflicts): State => ({
      ...state,
      removalConflicts: consequences,
    })
  );

  public hasConflicts(types: RemovalConflictType[]): Observable<boolean | undefined> {
    return this.removalConflicts$.pipe(
      switchMap((consequences) => {
        if (consequences === undefined) {
          return of(undefined);
        }

        const conflictChecks$ = types.map((type) => this.typeHasConflicts(type));

        return combineLatest(conflictChecks$).pipe(
          map((conflictResults) => conflictResults.some((hasConflict) => hasConflict))
        );
      })
    );
  }

  public typeHasConflicts(conflicType: RemovalConflictType): Observable<boolean> {
    return this.getSpecificConflicts(conflicType).pipe(map((conflicts) => conflicts.length > 0));
  }

  public getSpecificConflicts(type: RemovalConflictType): Observable<RemovalConflict[]> {
    return this.removalConflicts$.pipe(
      map((conflicts) => {
        switch (type) {
          case 'contracts':
            return conflicts?.contractsInOtherOrganizationsWhereOrgIsSupplier;
          case 'dprDataprocessor':
            return conflicts?.dprInOtherOrganizationsWhereOrgIsDataProcessor;
          case 'dprSubDataprocessor':
            return conflicts?.dprInOtherOrganizationsWhereOrgIsSubDataProcessor;
          case 'interfaces':
            return conflicts?.interfacesExposedOnSystemsOutsideTheOrganization;
          case 'systemsExposingInterfaces':
            return conflicts?.systemsExposingInterfacesDefinedInOtherOrganizations;
          case 'systemsRightsHolder':
            return conflicts?.systemsInOtherOrganizationsWhereOrgIsRightsHolder;
          case 'systemsParentSystem':
            return conflicts?.systemsSetAsParentSystemToSystemsInOtherOrganizations;
          case 'systemsArchiveSupplier':
            return conflicts?.systemsWhereOrgIsArchiveSupplier;
          case 'systemsUsages':
            return conflicts?.systemsWithUsagesOutsideTheOrganization;
          default:
            throw new Error(`Unknown removal conflict type: ${type}`);
        }
      }),
      map((conflicts) => conflicts ?? [])
    );
  }

  private setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));

  public getConsequences = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap((organizationUuid) =>
        this.apiService.getSingleOrganizationsInternalV2GetConflicts({ organizationUuid }).pipe(
          map((conflictsDto) => mapConflictsDtoToOrganizationRemovalConflicts(conflictsDto)),
          tapResponse(
            (conflicts) => this.updateConsequences(conflicts),
            (e) => console.error(e),
            () => this.setLoading(false)
          )
        )
      )
    )
  );
}
