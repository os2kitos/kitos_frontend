import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable, pairwise, startWith, Subject } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';

@Component({
  template: '',
})
export class ConnectedDropdownBaseComponent extends BaseComponent {
  @Input() public text!: string;
  @Input() public textField: string = 'name';
  @Input() public itemDescriptionField: string = 'description';
  @Input() public valueField!: string;
  @Input() public isLoading$?: Observable<boolean>;
  @Input() public showSearchHelpText$?: Observable<boolean>;
  @Input() public formGroup!: FormGroup<any>;
  @Input() public formName!: string;
  @Input() public includeItemDescription = false;
  @Input() public addTag = false;
  @Input() public addTagText = $localize`Vælg`;
  @Input() public showDescriptionLabel: boolean = true;
  @Input() public descriptionLabelTitle?: string;

  @Output() public filterChange = new EventEmitter<string>();

  protected searchTermsSource$ = new Subject<string | undefined>();
  protected lastTwoSearchTerms$ = this.searchTermsSource$.pipe(
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

  protected resetActiveSearchTerm() {
    this.publishActiveSearchTerm();
  }
}
