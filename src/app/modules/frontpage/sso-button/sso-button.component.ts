import { Component } from '@angular/core';
import { SSO_LOGIN_HANDLER_PATH } from 'src/app/shared/constants/constants';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { LockIconComponent } from '../../../shared/components/icons/lock-icon.component';

@Component({
  selector: 'app-sso-button',
  templateUrl: './sso-button.component.html',
  styleUrl: './sso-button.component.scss',
  imports: [ButtonComponent, LockIconComponent],
})
export class SsoButtonComponent {
  public readonly buttonText = $localize`Log ind med SSO`;

  goToSSO(): void {
    window.location.href = SSO_LOGIN_HANDLER_PATH;
  }
}
