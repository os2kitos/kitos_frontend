import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { ComponentsModule } from './components/components.module';
import { HttpXSRFInterceptor } from './interceptors/HttpXSRF.interceptor';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
  imports: [CommonModule, ComponentsModule, CookieModule.withOptions()],
  exports: [CommonModule, ComponentsModule, ReactiveFormsModule, PipesModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpXSRFInterceptor, multi: true }],
})
export class SharedModule {}
