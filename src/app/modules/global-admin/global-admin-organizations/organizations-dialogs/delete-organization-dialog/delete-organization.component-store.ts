import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { combineLatest, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { OrganizationsInternalV2Service, OrganizationSupplierInternalV2Service } from 'src/app/api/v2';
import { combineOR } from 'src/app/shared/helpers/observable-helpers';
import { mapConflictsDtoToOrganizationRemovalConflicts } from 'src/app/shared/helpers/removal-conflicts.helper';
import { OrganizationRemovalConflicts } from 'src/app/shared/models/global-admin/organization-removal-conflicts.model';
import { ShallowOrganization } from 'src/app/shared/models/organization/shallow-organization.model';
import { RemovalConflict, RemovalConflictType } from './removal-conflict-table/removal-conflict-table.component';

interface State {
  removalConflicts?: OrganizationRemovalConflicts;
  usingOrganizations?: ShallowOrganization[];
  isLoadingRemovalConflicts: boolean;
  isLoadingUsingOrganizations: boolean;
}

@Injectable()
export class DeleteOrganizationComponentStore extends ComponentStore<State> {
  constructor(
    private apiOrganizationsService: OrganizationsInternalV2Service,
    private apiOrganizationSuppliersService: OrganizationSupplierInternalV2Service,
  ) {
    super({
      removalConflicts: undefined,
      isLoadingRemovalConflicts: false,
      isLoadingUsingOrganizations: false,
      usingOrganizations: undefined,
    });
  }

  public readonly removalConflicts$ = this.select((state) => state.removalConflicts);
  private readonly isLoadingRemovalConflicts$ = this.select((state) => state.isLoadingRemovalConflicts);
  private readonly isLoadingUsingOrganizations$ = this.select((state) => state.isLoadingUsingOrganizations);
  public readonly isLoading$ = combineOR([this.isLoadingRemovalConflicts$, this.isLoadingUsingOrganizations$]);
  public readonly usingOrganizations$ = this.select((state) => state.usingOrganizations);

  private updateUsingOrganizations = this.updater(
    (state, usingOrganizations: ShallowOrganization[]): State => ({
      ...state,
      usingOrganizations: usingOrganizations,
    }),
  );

  private updateConsequences = this.updater(
    (state, consequences: OrganizationRemovalConflicts): State => ({
      ...state,
      removalConflicts: consequences,
    }),
  );

  public hasConflicts(types: RemovalConflictType[]): Observable<boolean | undefined> {
    return this.removalConflicts$.pipe(
      switchMap((consequences) => {
        if (consequences === undefined) {
          return of(undefined);
        }

        const conflictChecks$ = types.map((type) => this.typeHasConflicts(type));

        return combineLatest(conflictChecks$).pipe(
          map((conflictResults) => conflictResults.some((hasConflict) => hasConflict)),
        );
      }),
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
      map((conflicts) => conflicts ?? []),
    );
  }

  private setLoadingRemovalConsequences = this.updater(
    (state, isLoading: boolean): State => ({ ...state, isLoadingRemovalConflicts: isLoading }),
  );

  private setLoadingUsingOrganizations = this.updater(
    (state, isLoading: boolean): State => ({ ...state, isLoadingUsingOrganizations: isLoading }),
  );

  public getConsequences = this.effect((organizationUuid$: Observable<string>) =>
    organizationUuid$.pipe(
      tap(() => this.setLoadingRemovalConsequences(true)),
      mergeMap((organizationUuid) =>
        this.apiOrganizationsService.getSingleOrganizationsInternalV2GetConflicts({ organizationUuid }).pipe(
          map((conflictsDto) => mapConflictsDtoToOrganizationRemovalConflicts(conflictsDto)),
          tapResponse({
            next: (conflicts) => this.updateConsequences(conflicts),
            error: (e) => console.error(e),
            finalize: () => this.setLoadingRemovalConsequences(false),
          }),
        ),
      ),
    ),
  );

  public getUsingOrganizations = this.effect((supplierUuid$: Observable<string>) =>
    supplierUuid$.pipe(
      tap(() => this.setLoadingUsingOrganizations(true)),
      mergeMap((supplierUuid: string) =>
        this.apiOrganizationSuppliersService
          .getSingleOrganizationSupplierInternalV2GetUsingOrganizations({
            supplierUuid,
          })
          .pipe(
            tapResponse({
              next: (usingOrganizations) => this.updateUsingOrganizations(usingOrganizations),
              error: (e) => console.error(e),
              finalize: () => this.setLoadingUsingOrganizations(false),
            }),
          ),
      ),
    ),
  );
}
