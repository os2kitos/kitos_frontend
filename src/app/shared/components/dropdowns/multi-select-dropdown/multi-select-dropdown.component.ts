import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgMultiLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { debounceTime, filter, map, Subject } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { DEFAULT_INPUT_DEBOUNCE_TIME, EMAIL_REGEX_PATTERN } from 'src/app/shared/constants/constants';
import { MultiSelectDropdownItem } from 'src/app/shared/models/dropdown-option.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { ParagraphComponent } from '../../paragraph/paragraph.component';
import { TextBoxInfoComponent } from '../../textbox-info/textbox-info.component';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrl: './multi-select-dropdown.component.scss',
  imports: [
    NgSelectComponent,
    FormsModule,
    NgOptionTemplateDirective,
    ParagraphComponent,
    NgMultiLabelTemplateDirective,
    TextBoxInfoComponent,
  ],
})
export class MultiSelectDropdownComponent<T> extends BaseComponent implements OnInit, AfterViewInit {
  @Input() public text = '';
  @Input() public disabled = false;
  @Input() public textField = 'name';
  @Input() public valueField = 'value';
  @Input() public size: 'medium' | 'large' = 'large';

  @Input() public data?: MultiSelectDropdownItem<T>[] | null;
  @Input() public initialSelectedValues?: MultiSelectDropdownItem<T>[] | null;
  @Input() public loading: boolean | null = false;
  @Input() public searchFn?: (search: string, item: T) => boolean;

  @Input() public includeAddTag = false;
  @Input() public tagValidation: 'email' | 'none' = 'none';
  @Input() public addTagText: string = $localize`Tilføj email`;
  @Input() public isRequired = false;
  @Input() public showDescription = false;
  @Input() public useExternalSearch = false;
  @Input() public itemDescriptionField = 'description';
  @Input() public showDescriptionLabel: boolean = true;
  @Input() public descriptionLabelTitle?: string;
  @Input() public clearable = true;

  @Input() public resetSubject$?: Subject<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public isTagFn: (item: any) => boolean = () => false;

  @Output() public focusEvent = new EventEmitter();
  @Output() public openDropdown = new EventEmitter();
  @Output() public cleared = new EventEmitter();
  @Output() public blurEvent = new EventEmitter();
  @Output() public selectedEvent = new EventEmitter<T[]>();
  @Output() public filterChange = new EventEmitter<string | undefined>();
  @Output() public addTag = new EventEmitter<MultiSelectDropdownItem<T>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('selectDropdown') selectDropdown!: any;

  public focused = false;
  public readonly filter$ = new Subject<string>();

  public readonly clearAllText = $localize`Ryd`;
  public readonly loadingText = $localize`Henter data`;
  public readonly notFoundText = $localize`Ingen data fundet`;

  protected readonly formValueSubject$ = new Subject<MultiSelectDropdownItem<T>[]>();

  public descriptions: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  public selectedValues: T[] = [];
  public selectedValuesModel: MultiSelectDropdownItem<T>[] = [];

  ngOnInit() {
    this.formValueSubject$.next(this.initialSelectedValues ?? []);

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

    if (this.resetSubject$) {
      this.subscriptions.add(
        this.resetSubject$.subscribe(() => {
          this.onClear();
        })
      );
    }

    this.subscriptions.add(
      this.formValueSubject$
        .pipe(filter(() => this.showDescription))
        .subscribe((formValue: MultiSelectDropdownItem<T>[]) => {
          this.descriptions = formValue.map((x: any) => x?.value?.[this.itemDescriptionField]).filter(Boolean);
        })
    );
  }

  ngAfterViewInit() {
    const parentWidth = this.el.nativeElement.parentElement.offsetWidth;
    //needed for the hidden overflow
    this.renderer.setStyle(this.el.nativeElement.querySelector('ng-select'), 'max-width', `${parentWidth}px`);
    // Replace class ng-select-multiple with ng-select-single
    const ngSelectElement = this.el.nativeElement.querySelector('ng-select');
    this.renderer.removeClass(ngSelectElement, 'ng-select-multiple');
    this.renderer.addClass(ngSelectElement, 'ng-select-single');

    if (this.initialSelectedValues) {
      this.setValues(this.initialSelectedValues);
      this.cdRef.detectChanges();
    }
  }

  public displayDescriptionLabel() {
    return this.descriptions.length > 0 && this.showDescriptionLabel;
  }

  public setValues(values: MultiSelectDropdownItem<T>[]) {
    this.selectedValuesModel = values;
    this.selectedValues = values.map((item) => item.value);
  }

  public addValue(value: MultiSelectDropdownItem<T>) {
    this.data?.push(value);
    this.selectedValuesModel.push(value);
    this.selectedValues = this.selectedValuesModel.map((item) => item.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public externalSearch(_: string, __: any) {
    return true;
  }

  public onFocus() {
    this.focusEvent.emit();
  }

  public onOpen() {
    this.openDropdown.emit();
  }

  public onClear() {
    this.selectedValues = [];
    this.selectedValuesModel = [];
    this.filter$.next('');
    this.cleared.emit();
  }

  public onBlur() {
    this.blurEvent.emit();
  }

  public onSelected(selectedItems: Array<MultiSelectDropdownItem<T>>) {
    this.formValueSubject$.next(selectedItems);
    this.emitSelectedEvent(selectedItems.map((item) => item.value));
  }

  public clear() {
    this.selectedEvent.emit(undefined);
  }

  public onCreateNew = (tag: string) => {
    if (this.tagValidation === 'email' && !EMAIL_REGEX_PATTERN.test(tag)) {
      this.notificationService.showError($localize`Ugyldig email`);
      return;
    }
    const newTag = { name: tag, value: tag as T, selected: false };
    this.addValue(newTag);
    this.emitSelectedEvent(this.selectedValues);

    //If we immediately close the dropdown, the tag will not be added to the list
    //We need to close the dropdown in order to refresh filtering
    setTimeout(() => {
      this.selectDropdown.close();
    }, 1);

    return newTag;
  };

  public removeTag(item: MultiSelectDropdownItem<T>) {
    this.data = this.data?.filter((d) => d !== item) ?? [];

    this.selectedValuesModel = this.selectedValuesModel.filter((d) => d !== item);

    this.selectedValues = this.selectedValuesModel.map((d) => d.value);

    this.selectedEvent.emit(this.selectedValues);
  }

  private emitSelectedEvent(selectedValues: T[]) {
    this.selectedEvent.emit(selectedValues);
  }
}
