import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-role-table-container',
  templateUrl: './role-table-container.component.html',
  styleUrl: './role-table-container.component.scss'
})
export class RoleTableContainerComponent {

  @Input() isLoading$!: Observable<boolean>;
  @Input() anyRoles$!: Observable<boolean>;
  @Input() hasModifyPermission!: boolean;

  @Output() addNew = new EventEmitter<void>();

  public onAddNew() {
    this.addNew.emit();
  }
}
