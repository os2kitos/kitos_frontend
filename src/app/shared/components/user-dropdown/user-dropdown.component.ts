import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserDropdownComponentStore } from './user-dropdown.component-store';
import { combineLatestWith, map, Observable, of } from 'rxjs';
import { ShallowUser } from '../../models/userV2.model';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.scss',
  providers: [UserDropdownComponentStore],
})
export class UserDropdownComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formName!: string;
  @Input() disabledUuids$: Observable<string[]> = of([]);
  @Input() searchGlobalUsers: boolean = false;
  @Input() text: string = $localize`Vælg bruger`;

  @Output() userChange = new EventEmitter<string | null | undefined>();

  public filteredUsers$!: Observable<ShallowUser[]>;

  constructor(private componentStore: UserDropdownComponentStore) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.users$.pipe(
      combineLatestWith(this.disabledUuids$),
      map(([users, disabledUuids]) => {
        const disabledUuidsSet = new Set(disabledUuids);
        return users.filter((user) => !disabledUuidsSet.has(user.uuid));
      })
    );

    this.componentStore.setGlobalSearch(this.searchGlobalUsers);
  }

  public readonly isLoading$ = this.componentStore.loading$;
  public readonly users$ = this.componentStore.users$;

  public searchUsers(search: string | undefined): void {
    this.componentStore.searchUsers(search);
  }

  public onUserChange(userUuid: string | undefined | null): void {
    this.userChange.emit(userUuid);
  }
}
