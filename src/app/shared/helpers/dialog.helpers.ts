import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export function hasOpenDialogs(dialog: MatDialog) {
  return dialog.openDialogs.length > 0;
}

export function hasOpenDialogOf<T>(dialog: MatDialog, targetComponent: new (...args: any[]) => T) {
  return findDialogInstanceOf(dialog, targetComponent) !== undefined;
}

export function findDialogInstanceOf<T>(
  dialog: MatDialog,
  targetComponent: new (...args: any[]) => T
): MatDialogRef<T> | undefined {
  return dialog.openDialogs.find((d: MatDialogRef<any>) => d.componentInstance instanceof targetComponent);
}
