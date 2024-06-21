/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionCreator, ActionReducer, ActionType, ReducerTypes, createReducer } from '@ngrx/store';

export function createRehydrateReducer<S, A extends Action = Action>(
  key: string,
  initialState: S,
  ...ons: ReducerTypes<any, ActionCreator[]>[]
): ActionReducer<S, A> {
  const item = localStorage.getItem(key);
  const newInitialState = (item && JSON.parse(item)) ?? initialState;

  const newOns: ReducerTypes<S, ActionCreator[]>[] = [];
  ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newReducer /* ActionReducer<S, A> */ = (state: S | any, action: ActionType<ActionCreator[][number]>) => {
      const newState = oldOn.reducer(state, action);
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });
  return createReducer(newInitialState, ...newOns);
}
