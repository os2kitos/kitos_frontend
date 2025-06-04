import { NgIf } from '@angular/common';
import { Component, DoCheck, ElementRef, Input, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CtrlClickDirective } from 'src/app/shared/directives/ctrl-click.directive';
import { AppPath } from 'src/app/shared/enums/app-path';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { ChevronDownIconComponent } from '../../../shared/components/icons/chevron-down-icon.component';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
  imports: [
    ButtonComponent,
    RouterLinkActive,
    MatMenuTrigger,
    RouterLink,
    NgIf,
    ChevronDownIconComponent,
    MatMenu,
    CtrlClickDirective,
  ],
})
export class MenuComponent implements DoCheck {
  @Input() title?: string | null = '';
  @Input() subtitle?: string | null = '';
  @Input() path: AppPath = AppPath.root;

  public hasContent = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private menuTimeout?: any;

  @ViewChild('content') private content?: ElementRef;

  ngDoCheck() {
    this.hasContent = !!this.content?.nativeElement.innerHTML.trim();
  }

  public menuEnter(trigger: MatMenuTrigger) {
    if (this.menuTimeout) {
      clearTimeout(this.menuTimeout);
    }
    trigger.openMenu();
  }

  public menuLeave(trigger: MatMenuTrigger) {
    this.menuTimeout = setTimeout(() => {
      trigger.closeMenu();
    }, 80);
  }
}
