import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserDropdownComponentStore } from './user-dropdown.component-store';
import { combineLatestWith, map, Observable, of } from 'rxjs';
import { APIUserReferenceResponseDTO } from 'src/app/api/v2';

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

  public filteredUsers$!: Observable<APIUserReferenceResponseDTO[]>;

  constructor(private componentStore: UserDropdownComponentStore) {}

  ngOnInit(): void {
    this.filteredUsers$ = this.users$.pipe(
      combineLatestWith(this.disabledUuids$),
      map(([users, disabledUuids]) => {
        const disabledUuidsSet = new Set(disabledUuids);
        return users.filter((user) => !disabledUuidsSet.has(user.uuid));
      })
    );
  }

  public readonly isLoading$ = this.componentStore.loading$;
  public readonly users$ = this.componentStore.users$;

  public searchUsers(search: string): void {
    this.componentStore.searchUsers(search);
  }
}
