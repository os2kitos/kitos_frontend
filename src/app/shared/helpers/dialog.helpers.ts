import { MatDialog } from '@angular/material/dialog';

export function hasOpenDialogs(dialog: MatDialog) {
  return dialog.openDialogs.length > 0;
}
