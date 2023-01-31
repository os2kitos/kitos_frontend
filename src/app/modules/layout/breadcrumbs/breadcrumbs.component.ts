import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { AppPath } from '../../../shared/enums/app-path';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
  styleUrls: ['breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  readonly AppPath = AppPath;

  public items: BreadCrumbItem[] = [
    {
      text: 'Home',
      title: AppPath.root,
    },
    {
      text: 'Current',
      title: AppPath.organization,
    },
  ];

  constructor(private router: Router) {}

  public onItemClick(item: BreadCrumbItem): void {
    const selectedItemIndex = this.items.findIndex((i) => i.text === item.text);
    const url = this.items.slice(0, selectedItemIndex + 1).map((i) => i.title);
    this.router.navigate(url);
  }
}
