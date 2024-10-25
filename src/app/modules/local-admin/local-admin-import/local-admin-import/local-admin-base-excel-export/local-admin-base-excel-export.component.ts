import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-local-admin-base-excel-export',
  templateUrl: './local-admin-base-excel-export.component.html',
  styleUrl: './local-admin-base-excel-export.component.scss',
})
export class LocalAdminBaseExcelExportComponent {
  public readonly excelForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.excelForm = this.fb.group({
      file: [null, Validators.required],
    });
  }

  fileImported(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.excelForm.patchValue({
        file: file,
      });
      this.excelForm.get('file')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.excelForm.valid) {
      const formData = new FormData();
      formData.append('file', this.excelForm.get('file')?.value);

      // Handle the form submission, e.g., send the form data to the server
      console.log('Form submitted', formData);
      // You can use a service to send the form data to the server
      // this.yourService.uploadFile(formData).subscribe(response => {
      //   console.log('Upload successful', response);
      // });
    }
  }
}
