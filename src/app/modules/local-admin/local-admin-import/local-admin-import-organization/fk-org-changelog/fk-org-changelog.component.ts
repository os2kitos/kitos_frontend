import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, map } from 'rxjs';
import { DEFAULT_CHANGELOG_SIZE } from 'src/app/shared/constants/constants';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import { FkOrgChangeLogModel } from 'src/app/shared/models/local-admin/fk-org-change-log.dictionary';
import { fkOrgChangelogGridColumns } from 'src/app/shared/models/local-admin/fk-org-changelog-columns';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { GridActions } from 'src/app/store/grid/actions';
import { getResponsibleEntityTextBasedOnOrigin } from 'src/app/store/helpers/fk-org-helper';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectAvailableChangeLogs as selectAvailableChangeLogOptions,
  selectChangelogDictionary,
  selectIsLoadingChangelogs,
} from 'src/app/store/local-admin/fk-org/selectors';

@Component({
  selector: 'app-fk-org-changelog',
  templateUrl: './fk-org-changelog.component.html',
  styleUrl: './fk-org-changelog.component.scss',
})
export class FkOrgChangelogComponent implements OnInit {
  public readonly isLoadingChangelogs$ = this.store.select(selectIsLoadingChangelogs);
  public readonly changelogOptions$ = this.store.select(selectAvailableChangeLogOptions);
  public readonly changelogDictionary$ = this.store.select(selectChangelogDictionary).pipe(filterNullish());

  public readonly selectedChangelogDate$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly selectedChangelog$ = this.selectedChangelogDate$.pipe(
    combineLatestWith(this.changelogDictionary$),
    map(([date, changelogs]) => (date ? changelogs[date] : undefined))
  );

  constructor(private store: Store) {}

  public readonly gridColumns = fkOrgChangelogGridColumns;

  private readonly changelogSize = DEFAULT_CHANGELOG_SIZE;

  ngOnInit() {
    this.store.dispatch(FkOrgActions.getChangelog(this.changelogSize));
  }

  public onChangelogSelected(option: DropdownOption<string>) {
    this.selectedChangelogDate$.next(option ? option.value : undefined);
  }

  public getResponsibleEntityText(changelog: FkOrgChangeLogModel) {
    return getResponsibleEntityTextBasedOnOrigin(changelog);
  }

  public exportToExcel() {
    this.store.dispatch(GridActions.exportLocalData());
  }
}
