import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { Subject, switchMap, tap } from 'rxjs';
import {
  APISupplierAssociatedFieldConfigurationRequestDTO,
  APISupplierAssociatedFieldConfigurationResponseDTO,
  OrganizationSupplierInternalV2Service,
} from 'src/app/api/v2';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

interface State {
  fields: APISupplierAssociatedFieldConfigurationResponseDTO[];
  loading: boolean;
}

@Injectable()
export class FieldPermissionsCustomizationDialogComponentStore extends ComponentStore<State> {
  public readonly fields$ = this.select((state) => state.fields);
  public readonly loading$ = this.select((state) => state.loading);
  private readonly savedSubject = new Subject<APISupplierAssociatedFieldConfigurationRequestDTO>();
  public readonly saved$ = this.savedSubject.asObservable();

  constructor(
    @Inject(OrganizationSupplierInternalV2Service)
    private readonly organizationSupplierInternalV2Service: OrganizationSupplierInternalV2Service,
    private readonly store: Store,
    @Inject(NotificationService) private readonly notificationService: NotificationService,
  ) {
    super({ fields: [], loading: false });
  }

  private setFields = this.updater((state, fields: APISupplierAssociatedFieldConfigurationResponseDTO[]): State => ({
    ...state,
    fields,
  }));

  private setLoading = this.updater((state, loading: boolean): State => ({
    ...state,
    loading,
  }));

  public getFields = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([_, organizationUuid]) =>
        this.organizationSupplierInternalV2Service
          .getManyOrganizationSupplierInternalV2GetSupplierFields({ organizationUuid })
          .pipe(
            tapResponse({
              next: (fields) => {
                this.setFields(fields);
                this.setLoading(false);
              },
              error: () => {
                this.notificationService.showError($localize`Kunne ikke indlæse felter`);
                this.setLoading(false);
              },
            }),
          ),
      ),
    ),
  );

  public submit = this.effect<APISupplierAssociatedFieldConfigurationRequestDTO>((request$) =>
    request$.pipe(
      tap(() => this.setLoading(true)),
      concatLatestFrom(() => this.store.select(selectOrganizationUuid).pipe(filterNullish())),
      switchMap(([request, organizationUuid]) =>
        this.organizationSupplierInternalV2Service
          .putManyOrganizationSupplierInternalV2PutSupplierFields({
            organizationUuid,
            aPISupplierAssociatedFieldConfigurationRequestDTO: request,
          })
          .pipe(
            tapResponse({
              next: (fields) => {
                this.setFields(fields);
                this.setLoading(false);
                this.savedSubject.next(request);
              },
              error: () => {
                this.notificationService.showError($localize`Kunne ikke indlæse felter`);
                this.setLoading(false);
              },
            }),
          ),
      ),
    ),
  );
}
