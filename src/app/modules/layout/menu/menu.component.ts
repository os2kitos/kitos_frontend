import { Component, DoCheck, ElementRef, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppPath } from 'src/app/shared/enums/app-path';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
})
export class MenuComponent implements DoCheck {
  @Input() title?: string | null = '';
  @Input() subtitle?: string | null = '';
  @Input() path: AppPath = AppPath.root;

  public hasContent = false;

  private menuTimeout?: NodeJS.Timeout;

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
