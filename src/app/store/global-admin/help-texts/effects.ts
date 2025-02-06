import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { APIV2HelpTextsInternalINTERNALService } from 'src/app/api/v2/api/v2HelpTextsInternalINTERNAL.service';
import { adaptHelpText, HelpText } from 'src/app/shared/models/help-text.model';
import { HelpTextActions } from './actions';
import { APIHelpTextResponseDTO } from 'src/app/api/v2/model/helpTextResponseDTO';

@Injectable()
export class GlobalAdminHelpTextsEffects {
  constructor(
    private actions$: Actions,
    @Inject(APIV2HelpTextsInternalINTERNALService)
    private helpTextsInternalService: APIV2HelpTextsInternalINTERNALService
  ) {}

  getHelpTexts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        HelpTextActions.getHelpTexts,
        HelpTextActions.deleteHelpTextSuccess,
        HelpTextActions.updateHelpTextSuccess
      ),
      switchMap(() => {
        return this.helpTextsInternalService.getManyHelpTextsInternalV2GetAll().pipe(
          map((helptextDtos) =>
            HelpTextActions.getHelpTextsSuccess(this.adaptAndSortHelpTexts(helptextDtos))
          ),
          catchError(() => of(HelpTextActions.getHelpTextsError()))
        );
      })
    );
  });

  private adaptAndSortHelpTexts(dtos: APIHelpTextResponseDTO[]): HelpText[]{
    return dtos.map((dto) => adaptHelpText(dto)).sort((a, b) => a.Key.localeCompare(b.Key));
  }

  createHelpText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.createHelpText),
      switchMap(({ request }) => {
        return this.helpTextsInternalService.postSingleHelpTextsInternalV2Post({ dto: request }).pipe(
          map((helpTextDto) => HelpTextActions.createHelpTextSuccess(adaptHelpText(helpTextDto))),
          catchError(() => of(HelpTextActions.createHelpTextError()))
        );
      })
    );
  });

  patchHelpText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.updateHelpText),
      switchMap(({ key, request }) => {
        return this.helpTextsInternalService.patchSingleHelpTextsInternalV2Patch({ key, dto: request }).pipe(
          map((helpTextDto) => HelpTextActions.updateHelpTextSuccess(adaptHelpText(helpTextDto))),
          catchError(() => of(HelpTextActions.updateHelpTextError()))
        );
      })
    );
  });

  deleteHelpText$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HelpTextActions.deleteHelpText),
      switchMap(({ key }) => {
        return this.helpTextsInternalService.deleteSingleHelpTextsInternalV2Delete({ key }).pipe(
          map(() => HelpTextActions.deleteHelpTextSuccess()),
          catchError(() => of(HelpTextActions.deleteHelpTextError()))
        );
      })
    );
  });
}
