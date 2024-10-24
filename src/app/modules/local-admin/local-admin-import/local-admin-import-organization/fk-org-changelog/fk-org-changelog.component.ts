import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatestWith, map } from 'rxjs';
import { DropdownOption } from 'src/app/shared/models/dropdown-option.model';
import { fkOrgChangelogGridColumns } from 'src/app/shared/models/local-admin/fk-org-changelog-columns';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { FkOrgActions } from 'src/app/store/local-admin/fk-org/actions';
import {
  selectAvailableChangeLogs,
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
  public readonly changelogOptions$ = this.store.select(selectAvailableChangeLogs);
  public readonly changelogDictionary$ = this.store.select(selectChangelogDictionary).pipe(filterNullish());

  public readonly selectedChangelogDate$ = new BehaviorSubject<string | undefined>(undefined);
  public readonly selectedChangelog$ = this.selectedChangelogDate$.pipe(
    combineLatestWith(this.changelogDictionary$),
    map(([date, changelogs]) => (date ? changelogs[date] : undefined))
  );

  constructor(private store: Store) {}

  public readonly gridColumns = fkOrgChangelogGridColumns;

  private readonly changelogSize = 5; //(as per old UI) the size of the changelog should always be 5, this could change in the future

  ngOnInit() {
    this.store.dispatch(FkOrgActions.getChangelog(this.changelogSize));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onChangelogSelected(option: DropdownOption<string>) {
    this.selectedChangelogDate$.next(option ? option.value : undefined);
  }
}
