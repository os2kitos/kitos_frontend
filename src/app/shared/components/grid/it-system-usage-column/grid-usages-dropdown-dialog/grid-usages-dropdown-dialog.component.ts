import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IdentityNamePair } from '../../../../models/identity-name-pair.model';
import { GridUsagesConsequencesDialogComponent } from '../grid-usages-consequences-dialog/grid-usages-consequences-dialog.component';
import { GridUsagesDialogComponentStore } from '../grid-usages-dialog/grid-usages-dialog.component-store';

@Component({
  selector: 'app-grid-usages-dropdown-dialog',
  templateUrl: './grid-usages-dropdown-dialog.component.html',
  styleUrl: './grid-usages-dropdown-dialog.component.scss',
  providers: [GridUsagesDialogComponentStore],
})
export class GridUsagesDropdownDialogComponent {
  @Input() rowEntityIdentifier!: string;
  @Input() usingOrganization!: IdentityNamePair;

  public readonly unusedItSystemsInOrganization$ = this.componentStore.unusedItSystemsInOrganization$;
  public readonly loadingUnusedItSystemsInOrganization$ = this.componentStore.select((state) => state.loading);

  constructor(private readonly componentStore: GridUsagesDialogComponentStore, private readonly dialog: MatDialog) {}

  public onFilterChange(nameContent: string) {
    this.componentStore.getUnusedItSystemsInOrganization(nameContent)(this.usingOrganization.uuid);
  }

  public getTitle() {
    return `Anvendelsen kan flyttes til IT systemer, som endnu ikke er anvendt i ${this.usingOrganization.name}.`;
  }

  public onConfirm(targetItSystem: IdentityNamePair) {
    const dialogRef = this.dialog.open(GridUsagesConsequencesDialogComponent, { width: 'auto' });
    const componentInstance = dialogRef.componentInstance;
    componentInstance.title = $localize`Flytning af IT systemanvendelse`;
    componentInstance.usingOrganizationUuid = this.usingOrganization.uuid;
    componentInstance.targetItSystemUuid = targetItSystem.uuid;
    componentInstance.sourceItSystemUuid = this.rowEntityIdentifier;
  }
}
