import { Inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { saveAs } from '@progress/kendo-file-saver';
import { mergeMap, tap } from 'rxjs';
import {
  APIBrokenExternalReferencesReportStatusResponseDTO,
  BrokenExternalReferencesReportInternalV2Service,
} from 'src/app/api/v2';
import { NotificationService } from 'src/app/shared/services/notification.service';

interface State {
  isLoading: boolean;
  status?: APIBrokenExternalReferencesReportStatusResponseDTO;
}

@Injectable()
export class GlobalAdminOtherBrokenLinksComponentStore extends ComponentStore<State> {
  public readonly isLoading$ = this.select((state) => state.isLoading);
  public readonly status$ = this.select((state) => state.status);

  constructor(
    @Inject(BrokenExternalReferencesReportInternalV2Service)
    private statusService: BrokenExternalReferencesReportInternalV2Service,
    private notificationService: NotificationService,
  ) {
    super({ isLoading: false });
  }

  private readonly setLoading = this.updater((state, isLoading: boolean): State => ({ ...state, isLoading }));
  private readonly setStatus = this.updater(
    (state, status: APIBrokenExternalReferencesReportStatusResponseDTO | undefined): State => ({
      ...state,
      status: status,
    }),
  );

  public getStatus = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap(() => {
        return this.statusService.getSingleBrokenExternalReferencesReportInternalV2GetStatus().pipe(
          tapResponse({
            next: (status) => this.setStatus(status as APIBrokenExternalReferencesReportStatusResponseDTO),
            error: (e) => console.error(e),
            complete: () => this.setLoading(false),
          }),
        );
      }),
    ),
  );

  public getReport = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      mergeMap(() => {
        return this.statusService
          .getSingleBrokenExternalReferencesReportInternalV2GetCurrentCsvReport('response', undefined, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            httpHeaderAccept: 'blob' as any,
            context: undefined,
          })
          .pipe(
            tapResponse({
              next: (response) => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const fileName = contentDisposition
                  ? this.getFileNameFromContentDisposition(contentDisposition)
                  : 'report.csv';
                saveAs(response.body, fileName);
              },
              error: (e) => {
                console.error(e);
                this.notificationService.showError($localize`Kunne ikke hente rapporten`);
              },
              complete: () => this.setLoading(false),
            }),
          );
      }),
    ),
  );

  private getFileNameFromContentDisposition(contentDisposition: string): string {
    const matches = /filename\*=utf-8''([^"]+)/.exec(contentDisposition);
    return matches ? matches[1] : 'report.csv';
  }
}
