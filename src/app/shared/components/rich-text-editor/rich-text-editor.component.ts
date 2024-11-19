import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppRootUrlResolverService } from '../../services/app-root-url-resolver.service';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
})
export class RichTextEditorComponent {
  @Input() formControl!: FormControl;

  public rootUrl: string;

  constructor(private readonly rootUrlResolver: AppRootUrlResolverService) {
    this.rootUrl = this.rootUrlResolver.resolveRootUrl();
  }
}
