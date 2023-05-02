import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

export enum ConfirmActionCategory {
  Warning,
  Neutral,
}

export interface ActionConfirmationParams {
  category: ConfirmActionCategory;
  onConfirm?: () => void;
  onReject?: () => void;
  message: string;
  title?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmActionService {
  constructor(private readonly dialog: MatDialog) {}

  public confirmAction(parameters: ActionConfirmationParams) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
    const confirmationDialogComponent = confirmationDialogRef.componentInstance as ConfirmationDialogComponent;
    confirmationDialogComponent.bodyText = parameters.message;
    confirmationDialogComponent.title = parameters.title ?? confirmationDialogComponent.title;
    confirmationDialogComponent.confirmColor = this.getConfirmButtonColor(parameters.category);

    confirmationDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result === true) {
          if (parameters.onConfirm) {
            parameters.onConfirm();
          }
        } else {
          if (parameters.onReject) {
            parameters.onReject();
          }
        }
      });
  }
  getConfirmButtonColor(category: ConfirmActionCategory): ThemePalette {
    switch (category) {
      case ConfirmActionCategory.Neutral:
        return 'primary';
      case ConfirmActionCategory.Warning:
        return 'warn';
      default:
        console.error('Unmapped color category:', category);
        return 'primary';
    }
  }
}
