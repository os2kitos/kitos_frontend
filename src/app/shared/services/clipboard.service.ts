import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  public copyContentToClipBoardById(contentRootId: string) {
    const currentWindow = window.getSelection();
    if (!currentWindow) return;
    window.getSelection()?.selectAllChildren(document.getElementById(contentRootId) as Node);
    //29/11/24 This function is deprecated, but there is no fitting alternative yet. See https://stackoverflow.com/questions/60581285/execcommand-is-now-obsolete-whats-the-alternative
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }
}
