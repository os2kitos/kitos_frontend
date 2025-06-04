import { Component } from '@angular/core';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ParagraphComponent } from '../../../shared/components/paragraph/paragraph.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password-text-link',
  templateUrl: './reset-password-text-link.component.html',
  styleUrl: './reset-password-text-link.component.scss',
  imports: [ParagraphComponent, RouterLink],
})
export class ResetPasswordTextLinkComponent {
  public readonly routerLink = AppPath.passwordReset;
}
