import { Component } from '@angular/core';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-reset-password-text-link',
  templateUrl: './reset-password-text-link.component.html',
  styleUrl: './reset-password-text-link.component.scss',
})
export class ResetPasswordTextLinkComponent {
  public readonly routerLink = AppPath.passwordReset;
  public readonly unclickableText: string = $localize`Hvis du har glemt dit password, `;
  public readonly clickableText: string = $localize`kan du anmode om at nulstille det her.`;
}
