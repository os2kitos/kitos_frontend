import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SsoErrorCode } from 'src/app/shared/enums/sso-error-code';
import { StandardVerticalContentGridComponent } from '../../../../shared/components/standard-vertical-content-grid/standard-vertical-content-grid.component';
import { ParagraphComponent } from '../../../../shared/components/paragraph/paragraph.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sso-error',
  templateUrl: './sso-error.component.html',
  styleUrl: './sso-error.component.scss',
  imports: [StandardVerticalContentGridComponent, ParagraphComponent, NgIf],
})
export class SsoErrorComponent {
  @Input() public ssoErrorCode!: SsoErrorCode;

  public readonly errorCodes = SsoErrorCode;

  constructor(private store: Store) {}

  public compareErrorCode(code: SsoErrorCode, expectedErrorCode: SsoErrorCode): boolean {
    if (isNaN(code) && typeof code === 'string') {
      // Check if the string matches the enum key
      return code === SsoErrorCode[expectedErrorCode];
    }
    // Otherwise, compare as numbers
    return Number(code) === Number(expectedErrorCode);
  }
}
