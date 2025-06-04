import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { ButtonStyle } from 'src/app/shared/models/buttons/button-style.model';
import { IconType } from 'src/app/shared/models/icon-type';
import { ButtonComponent } from '../button/button.component';
import { NgIf } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
  imports: [ButtonComponent, MatMenuTrigger, NgIf, IconComponent, MatMenu],
})
export class MenuButtonComponent {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  @Input() title?: string | null = '';
  @Input() buttonStyle: ButtonStyle = 'primary';
  @Input() iconType: IconType = undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private menuTimeout: any;

  onMouseEnter() {
    if (this.menuTimeout) {
      clearTimeout(this.menuTimeout);
    }
    this.menuTrigger.openMenu();
  }

  onMouseLeave() {
    this.menuTimeout = setTimeout(() => {
      this.menuTrigger.closeMenu();
    }, 250);
  }
}
