import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { APIItSystemUsageResponseDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { ItSystemUsageDetailsRelationsComponentStore } from '../it-system-usage-details-relations.component-store';

@Component({
  selector: 'app-modify-relation-dialog',
  templateUrl: './modify-relation-dialog.component.html',
  styleUrls: ['./modify-relation-dialog.component.scss'],
})
export class ModifyRelationDialogComponent extends BaseComponent implements OnInit {
  public readonly relationForm = new FormGroup({
    systemUsage: new FormControl<APIItSystemUsageResponseDTO | undefined>({ value: undefined, disabled: false }),
  });

  public readonly systemUsages$ = this.componentStore.systemUsages$;
  public readonly systemUsagesLoading$ = this.componentStore.isSystemUsagesLoading$;
  public readonly showSearchHelpText$ = this.componentStore.systemUsages$.pipe(
    filterNullish(),
    map((usages) => usages.length >= this.componentStore.PAGE_SIZE)
  );

  constructor(
    private readonly store: Store,
    private readonly componentStore: ItSystemUsageDetailsRelationsComponentStore
  ) {
    super();
  }

  ngOnInit(): void {
    this.componentStore.getItSystemUsages(undefined);
  }
}
