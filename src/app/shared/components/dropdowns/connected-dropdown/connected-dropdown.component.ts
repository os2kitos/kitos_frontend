/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, map, pairwise, startWith } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  selector: 'app-connected-dropdown[text][valueField][filterChange][formGroup][formName]',
  templateUrl: './connected-dropdown.component.html',
  styleUrls: ['./connected-dropdown.component.scss'],
})
export class ConnectedDropdownComponent<T> extends BaseComponent implements OnInit {
  @Input() public text!: string;
  @Input() public textField: string = 'name';
  @Input() public subTextField?: string;
  @Input() public itemDescriptionField: string = 'description';
  @Input() public valueField!: string;
  @Input() public data$?: Observable<T[]>;
  @Input() public isLoading$?: Observable<boolean>;
  @Input() public showSearchHelpText$?: Observable<boolean>;
  @Input() public formGroup!: FormGroup<any>;
  @Input() public formName!: string;
  @Input() public includeItemDescription = false;
  @Output() public filterChange = new EventEmitter<string>();
  @Output() public valueChange = new EventEmitter<string>();

  private searchTermsSource$ = new Subject<string | undefined>();
  private lastTwoSearchTerms$ = this.searchTermsSource$.pipe(
    startWith(undefined),
    pairwise(),
    map(([previous, current]) => ({ previous: previous, current: current }))
  );

  ngOnInit() {
    this.filterChange.emit(undefined);
    this.subscriptions.add(
      this.lastTwoSearchTerms$.subscribe((terms) => {
        if (terms.previous != terms.current) {
          this.filterChange.emit(terms.current);
        }
      })
    );
  }

  //since the dropdown is filtered externally, accept every item
  public externalSearch(_: string, __: any) {
    return true;
  }

  public onValueChange(selectedUuid?: string) {
    this.valueChange.emit(selectedUuid);
  }

  public onFilterChange(searchTerm?: string) {
    this.publishActiveSearchTerm(searchTerm);
  }

  public onFocus() {
    this.resetActiveSearchTerm();
  }

  private publishActiveSearchTerm(term?: string) {
    this.searchTermsSource$.next(term);
  }

  public onOpen() {
    this.resetActiveSearchTerm();
  }

  private resetActiveSearchTerm() {
    this.publishActiveSearchTerm();
  }
}
