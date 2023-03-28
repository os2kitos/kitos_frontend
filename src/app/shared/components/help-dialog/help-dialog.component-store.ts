import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable } from 'rxjs';
import { APIV1ODATAHelpTextsINTERNALService } from 'src/app/api/v1';
import { defaultHelpText, HelpText } from '../../models/help-text.model';
import { OData } from '../../models/odata.model';

interface State {
  helpText?: HelpText;
}

@Injectable()
export class HelpDialogComponentStore extends ComponentStore<State> {
  public readonly helpText$ = this.select((state) => state.helpText);

  constructor(private apiOdataHelpTextsService: APIV1ODATAHelpTextsINTERNALService) {
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
      mergeMap((helpTextKey) =>
        this.apiOdataHelpTextsService
          .getSingleHelpTextsGetV1({
            $filter: `Key eq '${helpTextKey}'`,
          })
          .pipe(
            tapResponse(
              (response) => this.updateHelpText((response as OData).value.pop() || defaultHelpText),
              (e) => console.error(e)
            )
          )
      )
    )
  );
}
