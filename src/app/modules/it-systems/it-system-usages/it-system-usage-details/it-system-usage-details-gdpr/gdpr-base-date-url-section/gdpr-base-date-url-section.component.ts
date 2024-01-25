import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { APIGDPRWriteRequestDTO, APISimpleLinkDTO } from 'src/app/api/v2';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { ValidatedValueChange } from 'src/app/shared/models/validated-value-change.model';
import { YesNoDontKnowOptions, yesNoDontKnowOptions } from 'src/app/shared/models/yes-no-dont-know.model';
import { ITSystemUsageActions } from 'src/app/store/it-system-usage/actions';

@Component({
  selector: 'app-gdpr-base-date-url-section',
  templateUrl: './gdpr-base-date-url-section.component.html',
  styleUrls: ['./gdpr-base-date-url-section.component.scss'],
})
export class GdprBaseDateUrlSectionComponent extends BaseComponent implements OnInit {
  @Input() public title!: string;

  @Input() public choiceTypePropertyName!: string;
  @Input() public choiceTypeTitle!: string;

  @Input() public datePropertyName!: string;
  @Input() public dateTitle!: string;

  @Input() public linkPropertyName!: string;
  @Input() public linkTitle!: string;

  @Input() isYesNoDontKnowFalse$!: Observable<boolean>;
  @Input() documentation$!: Observable<APISimpleLinkDTO | undefined>;

  @Input() formGroup!: FormGroup<{
    yesNoDontKnowControl: FormControl<YesNoDontKnowOptions | null | undefined>;
    dateControl: FormControl<Date | null | undefined>;
  }>;

  @Output() patchGdprEvent = new EventEmitter();

  public readonly yesNoDontKnowOptions = yesNoDontKnowOptions;

  constructor(private readonly store: Store) {
    super();
  }

  ngOnInit(): void {
    this.isYesNoDontKnowFalse$.subscribe((isYesNoDontKnowFalse) => {
      if (isYesNoDontKnowFalse) {
        this.formGroup.controls.dateControl.disable();
      } else {
        this.formGroup.controls.dateControl.enable();
      }
    });
  }

  public preparePatch(propertyName: string, value: unknown, valueChange?: ValidatedValueChange<unknown>) {
    this.patchGdpr({ [propertyName]: value }, valueChange);
  }

  private patchGdpr(gdpr: APIGDPRWriteRequestDTO, valueChange?: ValidatedValueChange<unknown>) {
    if (!this.formGroup.valid) return;
    if (valueChange && !valueChange.valid) return;

    this.store.dispatch(ITSystemUsageActions.patchItSystemUsage({ gdpr }));
  }

  public patchSimpleLink(simpleLink: { url: string; name: string }, valueChange?: ValidatedValueChange<unknown>) {
    this.patchGdpr({ [this.linkPropertyName]: simpleLink }, valueChange);
  }
}
