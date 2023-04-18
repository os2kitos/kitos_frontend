import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { apiConfigV1Factory, apiConfigV2Factory } from './api/api-config-factory';
import { ApiModule as ApiV1Module } from './api/v1';
import { ApiModule as ApiV2Module } from './api/v2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './modules/layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RootStoreModule } from './store/root-store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    LayoutModule,
    RootStoreModule,
    ApiV1Module.forRoot(apiConfigV1Factory),
    ApiV2Module.forRoot(apiConfigV2Factory),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
