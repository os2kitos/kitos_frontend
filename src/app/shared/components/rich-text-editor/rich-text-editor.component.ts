/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, forwardRef, Input, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { HALF_SECOND_IN_MILLISECONDS } from '../../constants/constants';
import { AppRootUrlResolverService } from '../../services/app-root-url-resolver.service';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  imports: [EditorComponent, FormsModule, ReactiveFormsModule],
})
export class RichTextEditorComponent implements AfterViewInit {
  @Input() formControl!: FormControl;
  @Input() defaultEditorContent: string | undefined = undefined;

  @ViewChild('editor') editorRef!: EditorComponent;

  public rootUrl: string;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly rootUrlResolver: AppRootUrlResolverService) {
    this.rootUrl = this.rootUrlResolver.resolveRootUrl();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.editorHasNoContent() && this.defaultEditorContent) {
        this.editorRef.editor.setContent(this.defaultEditorContent);
      }
    }, HALF_SECOND_IN_MILLISECONDS);
  }

  private editorHasNoContent() {
    const editor = this.editorRef?.editor;
    return editor && editor.getContent() == undefined;
  }

  writeValue(value: any): void {
    if (this.formControl) {
      this.formControl.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.formControl) {
      if (isDisabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    }
  }

  onValueChange(value: any): void {
    this.onChange(value);
    this.onTouched();
  }
}
