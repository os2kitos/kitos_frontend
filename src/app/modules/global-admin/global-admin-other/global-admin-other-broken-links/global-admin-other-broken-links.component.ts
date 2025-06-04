import { Component, OnInit } from '@angular/core';
import { GlobalAdminOtherBrokenLinksComponentStore } from './global-admin-other-broken-links.component-store';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { CardHeaderComponent } from '../../../../shared/components/card-header/card-header.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { AppDatePipe } from '../../../../shared/pipes/app-date.pipe';

@Component({
  selector: 'app-global-admin-other-broken-links',
  templateUrl: './global-admin-other-broken-links.component.html',
  styleUrl: './global-admin-other-broken-links.component.scss',
  providers: [GlobalAdminOtherBrokenLinksComponentStore],
  imports: [
    CardComponent,
    CardHeaderComponent,
    NgIf,
    StandardVerticalContentGridComponent,
    ParagraphComponent,
    ButtonComponent,
    LoadingComponent,
    AsyncPipe,
    AppDatePipe,
  ],
})
export class GlobalAdminOtherBrokenLinksComponent implements OnInit {
  public readonly isLoading$ = this.componentStore.isLoading$;
  public readonly status$ = this.componentStore.status$;

  constructor(public componentStore: GlobalAdminOtherBrokenLinksComponentStore) {}

  ngOnInit(): void {
    this.componentStore.getStatus();
  }

  public downloadReport() {
    this.componentStore.getReport();
  }
}
