import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, filter } from 'rxjs';
import { APIGDPRWriteRequestDTO, APISimpleLinkDTO } from 'src/app/api/v2';
import { BaseAccordionComponent } from 'src/app/shared/base/base-accordion.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { YesNoDontKnowOption, yesNoDontKnowOptions } from 'src/app/shared/models/yes-no-dont-know.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';
import { AccordionComponent } from '../../../../../../shared/components/accordion/accordion.component';
import { DatePickerComponent } from '../../../../../../shared/components/datepicker/datepicker.component';
import { DropdownComponent } from '../../../../../../shared/components/dropdowns/dropdown/dropdown.component';
import { FormGridComponent } from '../../../../../../shared/components/form-grid/form-grid.component';
import { EditUrlSectionComponent } from '../edit-url-section/edit-url-section.component';

@Component({
  selector: 'app-gdpr-base-date-url-section',
  templateUrl: './gdpr-base-date-url-section.component.html',
  styleUrls: ['./gdpr-base-date-url-section.component.scss'],
  imports: [
    AccordionComponent,
    FormGridComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    DatePickerComponent,
    EditUrlSectionComponent,
    AsyncPipe,
  ],
})
export class GdprBaseDateUrlSectionComponent extends BaseAccordionComponent implements OnInit {
  @Input() public title!: string;

  @Input() public choiceTypePropertyName!: string;
  @Input() public choiceTypeTitle!: string;

  @Input() public datePropertyName!: string;
  @Input() public dateTitle!: string;

  @Input() public linkPropertyName!: string;
  @Input() public linkTitle!: string;

  @Input() isYesNoDontKnowFalse$!: Observable<boolean>;
  @Input() hasModifyPermissions$!: Observable<boolean | undefined>;
  @Input() documentation$!: Observable<APISimpleLinkDTO | undefined>;

  @Input() formGroup!: FormGroup<{
    yesNoDontKnowControl: FormControl<YesNoDontKnowOption | null | undefined>;
    dateControl: FormControl<Date | null | undefined>;
  }>;

  @Input() disableLinkControl: boolean = false;

  @Output() patchGdprEvent = new EventEmitter();

  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    if (this.hasModifyPermissions$ && this.isYesNoDontKnowFalse$) {
      this.toggleDateControlState();
    }
  }

  private toggleDateControlState(): void {
    combineLatest([this.hasModifyPermissions$, this.isYesNoDontKnowFalse$])
      .pipe(filter(([hasModifyPermissions]) => hasModifyPermissions ?? false))
      // Toggling gets stuck at "disabled" if this unused variable is removed.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(([hasModifyPermissions, isYesNoDontKnowFalse]) => {
        if (isYesNoDontKnowFalse) {
          this.formGroup.controls.dateControl.disable();
          this.disableLinkControl = true;
        } else {
          this.formGroup.controls.dateControl.enable();
          this.disableLinkControl = false;
        }
      });
  }

  public preparePatch(propertyName: string, value: unknown, valueChange?: ValidatedValueChange<unknown>) {
    this.patchGdpr({ [propertyName]: value }, valueChange);
  }

  private patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.formGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchITSystemUsage({ gdpr }));
  }

  public patchSimpleLink(
    simpleLink: { url: string; name: string } | null,
    valueChange?: ValidatedValueChange<unknown>
  ) {
    this.patchGdpr({ [this.linkPropertyName]: simpleLink }, valueChange);
  }
}
