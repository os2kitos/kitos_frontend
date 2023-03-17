import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { ItSystemInterfacesTableComponentStore } from './it-system-interfaces-table.component-store';

@Component({
  selector: 'app-it-system-interfaces-table',
  templateUrl: './it-system-interfaces-table.component.html',
  styleUrls: ['./it-system-interfaces-table.component.scss'],
  providers: [ItSystemInterfacesTableComponentStore]
})
export class ItSystemInterfacesTableComponent extends BaseComponent implements OnInit {
  readonly itInterfaces$ = this.interfaceStore.itInterfaces$;
  readonly anyInterfaces$ = this
    .itInterfaces$
    .pipe(matchEmptyArray())
    .pipe(map((isEmpty) => !isEmpty))

  @Input() systemUuid: string | undefined | null = '';

  constructor(private interfaceStore: ItSystemInterfacesTableComponentStore){
    super();
  }

  ngOnInit(): void {
    if(!this.systemUuid){
      throw "System uuid must be defined!";
    }

    this.subscriptions.add(
      this.interfaceStore.getInterfacesExposedBySystemWithUuid(this.systemUuid)
    );
  }
}
