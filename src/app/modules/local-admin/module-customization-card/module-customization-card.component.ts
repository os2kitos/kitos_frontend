import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrganizationActions } from 'src/app/store/organization/actions';

@Component({
  selector: 'app-module-customization-card',
  templateUrl: './module-customization-card.component.html',
  styleUrl: './module-customization-card.component.scss',
})
export class ModuleCustomizationCardComponent {
  @Input() public showModule$!: Observable<boolean | undefined>;
  @Input() dtoFieldName!: string;
  @Output() public checkboxToggled = new EventEmitter<boolean>();

  constructor(private store: Store) {}

  public patchUIRootConfig($event: boolean) {
    const dto = { [this.dtoFieldName]: $event };
    this.store.dispatch(OrganizationActions.patchUIRootConfig({ dto }));
  }

  public onCheckboxChange($event: boolean) {
    this.checkboxToggled.emit($event);
  }
}
