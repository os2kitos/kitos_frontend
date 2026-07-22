import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

import { mergeMap, Observable } from 'rxjs';
import { HelpTextsInternalV2Service } from 'src/app/api/v2';
import { adaptHelpText, defaultHelpText, HelpText } from '../../models/help-text.model';

interface State {
  helpText?: HelpText;
  isEditable: boolean | undefined;
}

@Injectable()
export class HelpDialogComponentStore extends ComponentStore<State> {
  public readonly helpText$ = this.select((state) => state.helpText);
  public readonly isEditable$ = this.select((state) => state.isEditable);

  constructor(private helpTextsService: HelpTextsInternalV2Service) {
    super({ isEditable: false });
  }

  private updateHelpText = this.updater(
    (state, update: { helpText: HelpText; isEditable: boolean }): State => ({
      ...state,
      helpText: update.helpText,
      isEditable: update.isEditable,
    }),
  );

  public getHelpText = this.effect((helpTextKey$: Observable<string>) =>
    helpTextKey$.pipe(
      mergeMap((key) =>
        this.helpTextsService
          .getSingleHelpTextsInternalV2GetSingle({
            key,
          })
          .pipe(
            tapResponse({
              next: (response) => {
                try {
                  this.updateHelpText({ helpText: adaptHelpText(response), isEditable: true });
                } catch (e) {
                  this.handleError(e);
                }
              },
              error: (e) => this.handleError(e),
            }),
          ),
      ),
    ),
  );

  private handleError(e: unknown) {
    console.error(e);
    this.updateHelpText({ helpText: defaultHelpText, isEditable: false });
  }
}
