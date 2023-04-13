import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class GridPaginatorIntl implements MatPaginatorIntl {
  public readonly changes = new Subject<void>();

  public readonly itemsPerPageLabel = $localize`Vis resultater pr. side`;
  public readonly nextPageLabel = $localize`Næste side`;
  public readonly previousPageLabel = $localize`Forrige side`;
  public readonly firstPageLabel = $localize`Første side`;
  public readonly lastPageLabel = $localize`Sidste side`;

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Viser 0 resultater`;
    }

    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return $localize`Viser ${startIndex + 1}-${endIndex} ud af ${length} resultater`;
  }
}
