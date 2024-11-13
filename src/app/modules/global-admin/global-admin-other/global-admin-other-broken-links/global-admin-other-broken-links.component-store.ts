import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import * as saveAs from 'file-saver';
import { pipe, tap } from 'rxjs';
import { APIV2BrokenExternalReferencesReportInternalINTERNALService } from 'src/app/api/v2';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface State {
  isLoading: boolean;
  status: object;
}

@Injectable()
export class GlobalAdminOtherUserShutdownComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly status$ = this.select((state) => state.status);

  constructor(
    @Inject(APIV2BrokenExternalReferencesReportInternalINTERNALService)
    private statusService: APIV2BrokenExternalReferencesReportInternalINTERNALService,
    private notificationService: NotificationService
  ) {
    super({ isLoading: false, status: [] });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setStatus = this.updater(
    (state, status: object | undefined): State => ({
      ...state,
      status: status ?? [],
    })
  );

  public getStatus = this.effect(() => {
    this.setLoading(true);
    return this.statusService.getSingleBrokenExternalReferencesReportInternalV2GetStatus().pipe(
      pipe(
        tap(() => this.setLoading(true)),
        tapResponse(
          (status) => this.setStatus(status),
          (e) => console.error(e),
          () => this.setLoading(false)
        )
      )
    );
  });

  public getReport = this.effect(() => {
    return this.statusService
      .getSingleBrokenExternalReferencesReportInternalV2GetCurrentCsvReport('response', undefined, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        httpHeaderAccept: 'blob' as any,
        context: undefined,
      })
      .pipe(
        tapResponse(
          (response) => {
            console.log(response);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            saveAs(response as any);
            this.notificationService.showDefault($localize`Brugeren blev slettet`);
          },
          (e) => {
            console.error(e);
            this.notificationService.showError($localize`Kunne ikke slette brugeren`);
          }
        )
      );
  });
}
