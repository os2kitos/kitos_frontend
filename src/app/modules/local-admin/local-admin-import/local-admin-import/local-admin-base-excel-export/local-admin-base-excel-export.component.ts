/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { saveAs } from '@progress/kendo-file-saver';
import { catchError, finalize, first, map, mergeMap, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { LocalAdminImportEntityType } from 'src/app/shared/enums/local-admin-import-entity-type';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { APIExcelService } from 'src/app/shared/services/excel.service';
import { ExcelImportActions } from 'src/app/store/local-admin/excel-import/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';

@Component({
  selector: 'app-local-admin-base-excel-export',
  templateUrl: './local-admin-base-excel-export.component.html',
  styleUrl: './local-admin-base-excel-export.component.scss',
})
export class LocalAdminBaseExcelExportComponent extends BaseComponent {
  @Input() public type!: LocalAdminImportEntityType;
  @Input() public helpTextKey!: string;

  public readonly excelForm: FormGroup;
  private readonly fileControl = 'file';
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
  public isImporting = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    //30/10/14 This is injected in the component because the files could not be passed to effects with actions in a regular store-based setup.
    @Inject(APIExcelService) private excelService: APIExcelService
  ) {
    super();
    this.excelForm = this.fb.group({
      file: [null, Validators.required],
    });
  }

  public getEntityExcel() {
    this.subscriptions.add(
      this.organizationUuid$
        .pipe(
          first(),
          mergeMap((orgUuid) => {
            return this.excelService.getExcel(orgUuid, this.type).pipe(
              map((excelFile) => {
                saveAs(excelFile.data, excelFile.fileName);
              }),
              catchError(() => this.handleExcelImportError())
            );
          })
        )
        .subscribe()
    );
  }

  private handleExcelImportError() {
    this.store.dispatch(ExcelImportActions.excelImportError());
    return of(ExcelImportActions.excelImportError());
  }

  public fileImported(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.excelForm.patchValue({
        file: file,
      });
      this.excelForm.get(this.fileControl)?.updateValueAndValidity();
    }
  }

  public onSubmit(): void {
    if (this.excelForm.valid) {
      const formData = new FormData();
      formData.append(this.fileControl, this.excelForm.get(this.fileControl)?.value);
      this.subscriptions.add(
        this.organizationUuid$
          .pipe(
            first(),
            mergeMap((orgUuid) => {
              const requestParameters = {
                organizationUuid: orgUuid,
                importOrgUnits: true,
                body: formData,
              };
              this.isImporting = true
              return this.excelService.postExcelWithFormData(requestParameters, this.type).pipe(
                tapResponse(
                  () => this.store.dispatch(ExcelImportActions.excelImportSuccess()),
                  () => this.handleExcelImportError()
                ),
                finalize(() => {
                  this.isImporting = false;
                })
              );
            })
          )
          .subscribe()
      );
    }
  }

  public getEntityName(): string {
    switch (this.type) {
      case LocalAdminImportEntityType.organization:
        return $localize`organisationsenheder`;
      case LocalAdminImportEntityType.users:
        return $localize`brugere`;
      case LocalAdminImportEntityType.contracts:
        return $localize`IT kontrakter`;
      default:
        throw new Error('Invalid type');
  }
  }
}
