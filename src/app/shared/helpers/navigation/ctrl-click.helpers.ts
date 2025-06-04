import { openUrlInNewTab } from './navigation.helpers';

export function verifyClickAndOpenNewTab(event: MouseEvent, url: string): boolean {
  if (!event.ctrlKey && event.button !== 1) return false;

  openUrlInNewTab(url);
  event.preventDefault();
  event.stopImmediatePropagation();
  return true;
}
