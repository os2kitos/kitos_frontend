import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { HelpText } from 'src/app/shared/models/help-text.model';
import { HelpTextActions } from './actions';
import { HelpTextsState } from './state';

export const helpTextAdapter = createEntityAdapter<HelpText>();

export const helpTextsInitialState: HelpTextsState = {
  ...helpTextAdapter.getInitialState(),
  helpTexts: [],
};

export const helpTextFeature = createFeature({
  name: 'HelpText',
  reducer: createReducer(
    helpTextsInitialState,
    on(
      HelpTextActions.getHelpTextsSuccess,
      (state, { helpTexts }): HelpTextsState => ({
        ...state,
        helpTexts,
      })
    ),
    on(
      HelpTextActions.createHelpTextSuccess,
      (state, { helpText }): HelpTextsState => ({
        ...state,
        helpTexts: [...state.helpTexts, helpText],
      })
    )
  ),
});
