import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { IconButtonComponent } from 'src/app/shared/components/buttons/icon-button/icon-button.component';
import { ContentSpaceBetweenComponent } from 'src/app/shared/components/content-space-between/content-space-between.component';
import { ScrollbarDialogComponent } from 'src/app/shared/components/dialogs/dialog/scrollbar-dialog/scrollbar-dialog.component';
import { ArrowRightIconComponent } from 'src/app/shared/components/icons/arrow-right-icon.component';
import { NativeTableComponent } from 'src/app/shared/components/native-table/native-table.component';
import { ParagraphComponent } from 'src/app/shared/components/paragraph/paragraph.component';
import { getDetailsPageLink } from 'src/app/shared/helpers/link.helpers';
import { SupplierContract } from 'src/app/shared/models/it-contract/it-contract-supplier.model';

@Component({
  selector: 'app-supplier-contracts-dialog',
  imports: [
    ScrollbarDialogComponent,
    ParagraphComponent,
    NativeTableComponent,
    ArrowRightIconComponent,
    IconButtonComponent,
    ContentSpaceBetweenComponent,
  ],
  templateUrl: './supplier-contracts-dialog.component.html',
  styleUrl: './supplier-contracts-dialog.component.scss',
})
export class SupplierContractsDialogComponent extends BaseComponent implements OnInit {
  @Input() supplierName: string = '';
  @Input() contracts: SupplierContract[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<SupplierContractsDialogComponent>,
    private readonly router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.router.events.subscribe(() => this.dialogRef.close()));
  }

  public onLinkClick(contractId: string) {
    const path = getDetailsPageLink(contractId, 'it-contract', undefined, false);
    if (path) {
      this.router.navigate([path]);
    }
  }

  public onClose() {
    this.dialogRef.close();
  }
}
