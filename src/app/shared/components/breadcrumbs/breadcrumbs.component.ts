import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from '@progress/kendo-angular-navigation';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
  styleUrls: ['breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input() public breadCrumbs: BreadCrumbItem[] | null = [];

  constructor(private router: Router) {}

  public onItemClick(breadCrumb: BreadCrumbItem) {
    if (!this.breadCrumbs) return;

    const selectedItemIndex = this.breadCrumbs.findIndex((i) => i.text === breadCrumb.text);
    const url = this.breadCrumbs.slice(0, selectedItemIndex + 1).map((i) => i.title);
    this.router.navigate(url);
  }
}
