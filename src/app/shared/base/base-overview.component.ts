import { Component } from '@angular/core';
import { BaseComponent } from './base.component';
import { CellClickEvent } from '@progress/kendo-angular-grid';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: '',
})
export class BaseOverviewComponent extends BaseComponent {
  protected readonly unclickableColumnsTitles: string[] = [];

  constructor(){
    super()
  }

  protected rowIdSelect(event: CellClickEvent, router: Router, route: ActivatedRoute) {
    const columnTitle = event.column?.title;
    const rowId = event.dataItem?.id;
    if (!this.unclickableColumnsTitles.includes(columnTitle)) {
      router.navigate([rowId], { relativeTo: route });
    }
  }
}
