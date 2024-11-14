import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { mergeMap, Observable } from 'rxjs';
import { APIV2HelpTextsInternalINTERNALService } from 'src/app/api/v2/api/v2HelpTextsInternalINTERNAL.service';
import { adaptHelpText, defaultHelpText, HelpText } from '../../models/help-text.model';

interface State {
  helpText?: HelpText;
}

@Injectable()
export class HelpDialogComponentStore extends ComponentStore<State> {
  public readonly helpText$ = this.select((state) => state.helpText);

  constructor(private helpTextsService: APIV2HelpTextsInternalINTERNALService) {
    super({});
  }

  private updateHelpText = this.updater(
    (state, helpText: HelpText): State => ({
      ...state,
      helpText,
    })
  );

  public getHelpText = this.effect((helpTextKey$: Observable<string>) =>
    helpTextKey$.pipe(
      mergeMap((key) =>
        this.helpTextsService
          .getSingleHelpTextsInternalV2GetSingle({
            key,
          })
          .pipe(
            tapResponse(
              (response) => {
                try {
                  this.updateHelpText(adaptHelpText(response));
                } catch (e) {
                  this.handleError(e);
                }
              },
              (e) => this.handleError(e)
            )
          )
      )
    )
  );

  private handleError(e: unknown){
    console.error(e);
    this.updateHelpText(defaultHelpText);
  }
}
