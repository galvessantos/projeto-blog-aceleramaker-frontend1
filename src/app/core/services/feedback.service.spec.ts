import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeedbackService } from './feedback.service';
import { of } from 'rxjs';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        FeedbackService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(FeedbackService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success message', () => {
    const message = 'Success message';
    service.showSuccess(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message, 
      'Fechar', 
      jasmine.objectContaining({
        duration: 3000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      })
    );
  });

  it('should show error message', () => {
    const message = 'Error message';
    service.showError(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: 5000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      })
    );
  });

  it('should show info message', () => {
    const message = 'Info message';
    service.showInfo(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      message,
      'Fechar',
      jasmine.objectContaining({
        duration: 4000,
        panelClass: ['info-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top'
      })
    );
  });
});
