import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule, DialogsModule } from '@progress/kendo-angular-dialog';
import { IconSettingsService, ICON_SETTINGS } from '@progress/kendo-angular-icons';
import { CookieModule } from 'ngx-cookie';
import { ComponentsModule } from './components/components.module';
import { HttpXSRFInterceptor } from './interceptors/HttpXSRF.interceptor';
import { IconService } from './services/icon.service';

@NgModule({
  imports: [CommonModule, ComponentsModule, DialogModule, CookieModule.withOptions()],
  exports: [CommonModule, ComponentsModule, DialogsModule, ReactiveFormsModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpXSRFInterceptor, multi: true },
    { provide: ICON_SETTINGS, useValue: { type: 'svg' } },
    { provide: IconSettingsService, useClass: IconService },
  ],
})
export class SharedModule {}
