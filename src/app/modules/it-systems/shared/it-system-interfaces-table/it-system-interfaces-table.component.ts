import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { invertBooleanValue } from 'src/app/shared/pipes/invert-boolean-value';
import { matchEmptyArray } from 'src/app/shared/pipes/match-empty-array';
import { InterfaceTypeActions } from 'src/app/store/it-interface-type/actions';
import { selectInterfaceTypesDictionary } from 'src/app/store/it-interface-type/selectors';
import { ItSystemInterfacesTableComponentStore } from './it-system-interfaces-table.component-store';

@Component({
  selector: 'app-it-system-interfaces-table[systemUuid]',
  templateUrl: './it-system-interfaces-table.component.html',
  styleUrls: ['./it-system-interfaces-table.component.scss'],
  providers: [ItSystemInterfacesTableComponentStore],
})
export class ItSystemInterfacesTableComponent extends BaseComponent implements OnInit {
  public readonly isLoading$ = this.interfaceStore.itInterfacesIsLoading$;
  public readonly itInterfaces$ = this.interfaceStore.itInterfaces$;
  public readonly anyInterfaces$ = this.itInterfaces$.pipe(matchEmptyArray(), invertBooleanValue());
  public readonly availableInterfaceTypesDictionary$ = this.store
    .select(selectInterfaceTypesDictionary)
    .pipe(filterNullish());

  @Input() public systemUuid = '';

  constructor(private store: Store, private interfaceStore: ItSystemInterfacesTableComponentStore) {
    super();
  }

  ngOnInit(): void {
    if (this.systemUuid === '') {
      console.error('systemUuid cannot be an empty value');
      return;
    }

    this.store.dispatch(InterfaceTypeActions.getInterfaceTypes());

    this.interfaceStore.getInterfacesExposedBySystemWithUuid(this.systemUuid);
  }
}
