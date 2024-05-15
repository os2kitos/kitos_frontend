import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { AppPath } from 'src/app/shared/enums/app-path';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import {
  selectDataProcessingHasDeletePermissions,
  selectDataProcessingLoading,
  selectDataProcessingName,
  selectDataProcessingUuid,
} from 'src/app/store/data-processing/selectors';

@Component({
  selector: 'app-data-processing-details',
  templateUrl: './data-processing-details.component.html',
  styleUrl: './data-processing-details.component.scss',
})
export class DataProcessingDetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  public readonly AppPath = AppPath;

  public readonly isLoading$ = this.store.select(selectDataProcessingLoading);
  public readonly contractName$ = this.store.select(selectDataProcessingUuid).pipe(filterNullish());
  public readonly contractUuid$ = this.store.select(selectDataProcessingName).pipe(filterNullish());

  public readonly hasDeletePermission$ = this.store.select(selectDataProcessingHasDeletePermissions);

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
