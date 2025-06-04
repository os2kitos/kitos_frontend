import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { StandardVerticalContentGridComponent } from '../../standard-vertical-content-grid/standard-vertical-content-grid.component';
import { EmptyStateComponent } from '../../empty-states/empty-state.component';
import { CollectionExtensionButtonComponent } from '../../collection-extension-button/collection-extension-button.component';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-role-table-container',
  templateUrl: './role-table-container.component.html',
  styleUrl: './role-table-container.component.scss',
  imports: [
    NgIf,
    StandardVerticalContentGridComponent,
    EmptyStateComponent,
    CollectionExtensionButtonComponent,
    LoadingComponent,
    AsyncPipe,
  ],
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
