/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { catchError, first, map, mergeMap, of } from 'rxjs';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { filterNullish } from 'src/app/shared/pipes/filter-nullish';
import { APIExcelService } from 'src/app/shared/services/excel.service';
import { ExcelImportActions } from 'src/app/store/local-admin/excel-import/actions';
import { selectOrganizationUuid } from 'src/app/store/user-store/selectors';
import { LocalAdminImportTabOptions } from '../../local-admin-import.component';

@Component({
  selector: 'app-local-admin-base-excel-export',
  templateUrl: './local-admin-base-excel-export.component.html',
  styleUrl: './local-admin-base-excel-export.component.scss',
})
export class LocalAdminBaseExcelExportComponent extends BaseComponent {
  @Input() public type!: LocalAdminImportTabOptions;
  @Input() public helpTextKey!: string;

  public readonly excelForm: FormGroup;
  public readonly organizationUuid$ = this.store.select(selectOrganizationUuid).pipe(filterNullish());
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
    this.organizationUuid$
      .pipe(
        first(),
        mergeMap((orgUuid) => {
          return this.excelService.getExcel(orgUuid, this.type).pipe(
            map((blob) => {
              saveAs(blob); //include file names
            }),
            catchError(() => of(ExcelImportActions.excelImportError())
            )
          );
        })
      )
      .subscribe();
  }

  public fileImported(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.excelForm.patchValue({
        file: file,
      });
      this.excelForm.get('file')?.updateValueAndValidity();
    }
  }

  public onSubmit(): void {
    if (this.excelForm.valid) {
      const formData = new FormData();
      formData.append('file', this.excelForm.get('file')?.value);

      this.organizationUuid$
        .pipe(
          first(),
          mergeMap((orgUuid) => {
            const requestParameters = {
              organizationUuid: orgUuid,
              importOrgUnits: true,
              body: formData,
            };

            return this.excelService.postExcelWithFormData(requestParameters, this.type).pipe(
              map(() => this.store.dispatch(ExcelImportActions.excelImportSuccess())),
              catchError(() => {
                this.store.dispatch(ExcelImportActions.excelImportError());
                return of(ExcelImportActions.excelImportError());
              })
            );
          })
        )
        .subscribe();
    }
  }
}
