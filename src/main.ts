import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import { apiConfigV1Factory, apiConfigV2Factory } from './app/api/api-config-factory';
import { ApiModule as ApiV1Module } from './app/api/v1';
import { ApiModule as ApiV2Module } from './app/api/v2';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { SharedModule } from './app/shared/shared.module';
import { RootStoreModule } from './app/store/root-store.module';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      SharedModule,
      RootStoreModule,
      ApiV1Module.forRoot(apiConfigV1Factory),
      ApiV2Module.forRoot(apiConfigV2Factory),
      GridModule,
      ExcelModule,
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
