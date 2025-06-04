import { Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import '@progress/kendo-angular-intl/locales/da/all';
import { DIALOG_DEFAULT_WIDTH } from '../constants/constants';

import { OnInvalidErrorStateMatcher } from '../helpers/on-invalid-error-state-matcher';

import '@progress/kendo-angular-intl/locales/da/all';

export function scrollFactory(overlay: Overlay): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

@NgModule({
  providers: [
    { provide: ErrorStateMatcher, useClass: OnInvalidErrorStateMatcher },
    {
      provide: MAT_DIALOG_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'mat-typography',
        autoFocus: false,
        width: DIALOG_DEFAULT_WIDTH,
      },
    },
  ],
})
export class ComponentsModule {}
