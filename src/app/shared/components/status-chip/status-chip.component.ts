import { Component, Input, OnInit } from '@angular/core';
import { RegistrationEntityTypes } from '../../models/registrations/registration-entity-categories.model';
import { EntityStatusTextsService } from '../../services/entity-status-texts.service';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { NgIf } from '@angular/common';
import { ChipComponent } from '../chip/chip.component';

export enum BooleanValueDisplayType {
  TrueFalse = 'true-false',
  YesNo = 'yes-no',
  ActiveInactive = 'active-inactive',
  ValidInvalid = 'valid-invalid',
  AvailableNotAvailable = 'available-not-available',
  NormalUnstable = 'normal-unstable',
  InUseNotInUse = 'in-use-not-in-use',
  RequiresValidParent = 'requires-valid-parent',
}

@Component({
  selector: 'app-status-chip',
  templateUrl: 'status-chip.component.html',
  styleUrls: ['status-chip.component.scss'],
  imports: [TooltipComponent, NgIf, ChipComponent],
})
export class StatusChipComponent implements OnInit {
  @Input() public type?: RegistrationEntityTypes;
  @Input() public value?: boolean | null = undefined;
  @Input() public title?: string | null = '';
  @Input() public reverseValues?: boolean = false;
  @Input() public valueDisplayType?: BooleanValueDisplayType | null;
  public trueString?: string;
  public falseString?: string;

  constructor(private readonly statusService: EntityStatusTextsService) {}

  ngOnInit() {
    if (this.valueDisplayType) {
      this.setTrueFalseStringsFromValueDisplayType(this.valueDisplayType);
    } else if (this.type) {
      this.setTrueFalseStringsFromEntityStatusTexts(this.type);
    } else {
      console.error('type not provided');
    }
  }

  public isError(): boolean {
    return this.value === this.reverseValues;
  }

  private setTrueFalseStringsFromEntityStatusTexts(type: RegistrationEntityTypes) {
    const texts = this.statusService.map(type);
    this.trueString = texts.trueString;
    this.falseString = texts.falseString;
  }

  private setTrueFalseStringsFromValueDisplayType(valueDisplayType: BooleanValueDisplayType) {
    switch (valueDisplayType) {
      case BooleanValueDisplayType.TrueFalse:
        this.trueString = $localize`Sandt`;
        this.falseString = $localize`Falsk`;
        break;
      case BooleanValueDisplayType.YesNo:
        this.trueString = $localize`Ja`;
        this.falseString = $localize`Nej`;
        break;
      case BooleanValueDisplayType.ActiveInactive:
        this.trueString = $localize`Aktiv`;
        this.falseString = $localize`Inaktiv`;
        break;
      case BooleanValueDisplayType.ValidInvalid:
        this.trueString = $localize`Gyldig`;
        this.falseString = $localize`Ugyldig`;
        break;
      case BooleanValueDisplayType.AvailableNotAvailable:
        this.trueString = $localize`Tilgængelig`;
        this.falseString = $localize`Ikke tilgængelig`;
        break;
      case BooleanValueDisplayType.NormalUnstable:
        this.trueString = $localize`Normal drift`;
        this.falseString = $localize`Ustabil drift`;
        break;
      case BooleanValueDisplayType.InUseNotInUse:
        this.trueString = $localize`Anvendes`;
        this.falseString = $localize`Anvendes ikke`;
        break;
      case BooleanValueDisplayType.RequiresValidParent:
        this.trueString = $localize`Nedarver`;
        this.falseString = $localize`Nedarver ikke`;
        break;
      default:
        console.error('Invalid value display type');
        break;
    }
  }
}
