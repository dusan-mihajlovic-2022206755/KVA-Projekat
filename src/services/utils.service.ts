import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private snackBar: MatSnackBar) {}

  public formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS');
  }

    public static convertToHoursAndMinutes(timeInMinutes: number) {
    return Math.floor(timeInMinutes / 60) + "h "+timeInMinutes % 60 + "min"
  }

  public openGreenSnackbar(text: string) {
    this.snackBar.open(text, 'Close', {
      duration: 3000,
      panelClass: ['green-snackbar']
    });
  }

  public openRedSnackbar(text: string) {
    this.snackBar.open(text, 'Close', {
      duration: 3000,
      panelClass: ['red-snackbar']  // Custom class for green background
    });
  }

  public generateDestinationImage(dest: string) {
    return `https://img.pequla.com/destination/${dest.split(' ')[0].toLowerCase()}.jpg`;
  }
}
