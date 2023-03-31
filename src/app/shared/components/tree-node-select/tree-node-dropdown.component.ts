import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { combineLatest, debounceTime, filter, map, Subject } from 'rxjs';
import { BaseFormComponent } from '../../base/base-form.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME } from '../../constants';

export interface TreeNodeModel {
  id: string;
  name: string;
  disabled: boolean;
  parentId: string;
  indent: number;
}

@Component({
  selector: 'app-tree-node-dropdown',
  templateUrl: './tree-node-dropdown.component.html',
  styleUrls: ['./tree-node-dropdown.component.scss'],
})
export class TreeNodeDropdownComponent extends BaseFormComponent<TreeNodeModel | null> implements OnInit {
  @Input() public nodes?: TreeNodeModel[];
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public loading: boolean | null = false;
  @Input() public showDescription = false;
  @Input() public showSearchHelpText: boolean | null = false;
  @Input() public size: 'medium' | 'large' = 'large';

  @Output() public filterChange = new EventEmitter<string | undefined>();

  public description?: string;

  private readonly formDataSubject$ = new Subject<TreeNodeModel[]>();
  private readonly formValueSubject$ = new Subject<TreeNodeModel>();

  public readonly filter$ = new Subject<string>();

  public readonly clearAllText = $localize`Ryd`;
  public readonly loadingText = $localize`Henter data`;
  public readonly notFoundText = $localize`Ingen data fundet`;

  constructor() {
    super();
  }

  private itemsWithParents: { key: string; parentIds: string[] }[] = [];

  override ngOnInit() {
    super.ngOnInit();

    this.nodes?.forEach((item) => {
      const node = item as TreeNodeModel;
      this.itemsWithParents?.push({
        key: node.id,
        parentIds: this.getParents(node, this.nodes as TreeNodeModel[]).map((x) => x.id),
      });
    });

    // Debounce update of dropdown filter with more then 1 character
    this.subscriptions.add(
      this.filter$
        .pipe(
          filter((filter) => filter.length !== 1),
          debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME),
          map((filter) => filter || undefined)
        )
        .subscribe((filter) => this.filterChange.emit(filter))
    );

    // Debounce update of dropdown filter with more then 1 character and filter hierarchy
    this.subscriptions.add(
      this.filter$
        .pipe(
          filter((filter) => filter.length !== 1),
          debounceTime(DEFAULT_INPUT_DEBOUNCE_TIME),
          map((filter) => filter || undefined)
        )
        .subscribe((filter) => this.filterChange.emit(filter))
    );

    if (!this.formName) return;

    // Extract possible description from data value if enabled
    this.subscriptions.add(
      combineLatest([this.formValueSubject$, this.formDataSubject$])
        .pipe(
          filter(() => this.showDescription),
          map(([value, data]) =>
            data?.find((data: any) => !!value && data[this.valueField] === (value as any)[this.valueField])
          )
        )
        .subscribe((value: any) => (this.description = value?.description))
    );

    // Update value subject to be used in calculating obselete values
    this.subscriptions.add(
      this.formGroup?.controls[this.formName]?.valueChanges.subscribe((value) => this.formValueSubject$.next(value))
    );

    // Push initial values to value and data form subjects
    this.formValueSubject$.next(this.formGroup?.controls[this.formName]?.value);
    this.formDataSubject$.next(this.nodes ?? []);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update data subject to be used in calculating obselete values
    if (this.formName && changes['data'] && this.nodes) {
      this.formDataSubject$.next(this.nodes);
    }
  }

  private getParents(item: TreeNodeModel, data: TreeNodeModel[]): TreeNodeModel[] {
    let result = [] as TreeNodeModel[];
    data
      .filter((x) => x.id === item.parentId)
      .forEach((x) => {
        result.push(x);
        result = result.concat(this.getParents(x, data));
      });

    return result;
  }

  public formSelectionChange(formValue?: any) {
    if (!this.formName) return;

    // Handle form clear and selection change
    const value = formValue === undefined || formValue === null ? null : formValue && formValue[this.valueField];
    this.valueChange.emit(value);
    const valid = this.formGroup?.controls[this.formName]?.valid ?? true;
    this.validatedValueChange.emit({ value, text: this.text, valid });
  }

  private lookup: { term: string; data: string[]; parents: string[] } | null = null;

  public searchWitItemParents = (term: string, item: TreeNodeModel) => {
    const treeNodes = this.nodes as TreeNodeModel[];

    if (!this.lookup || this.lookup.term !== term) {
      const nodes = treeNodes
        .filter((x) => x.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
        .map((x) => x.id);
      let parents = [] as string[];
      this.itemsWithParents
        .filter((x) => nodes.includes(x.key))
        .forEach((x) => {
          parents = parents.concat(x.parentIds);
        });
      this.lookup = { term: term, data: nodes, parents: parents };
    }

    return this.lookup.data.includes(item.id) || this.lookup.parents.includes(item.id);
  };
}
