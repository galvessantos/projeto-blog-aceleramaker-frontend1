import { ComponentFixture, TestBed } from '@angular/core/testing';
 import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';
 import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 import { MatButtonModule } from '@angular/material/button';
 import { By } from '@angular/platform-browser';
 import { NoopAnimationsModule } from '@angular/platform-browser/animations';
 
 describe('ConfirmDialogComponent', () => {
   let fixture: ComponentFixture<ConfirmDialogComponent>;
   let component: ConfirmDialogComponent;
   let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;
   const data: ConfirmDialogData = {
     title: 'Test Title',
     message: 'Test Message',
     confirmText: 'Yes',
     cancelText: 'No'
   };
 
   beforeEach(async () => {
     dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
     await TestBed.configureTestingModule({
       imports: [
         ConfirmDialogComponent,
         MatDialogModule,
         MatButtonModule,
         NoopAnimationsModule
       ],
       providers: [
         { provide: MAT_DIALOG_DATA, useValue: data },
         { provide: MatDialogRef, useValue: dialogRefSpy }
       ]
     }).compileComponents();
     fixture = TestBed.createComponent(ConfirmDialogComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });
 
   it('should display title and message', () => {
     const titleEl = fixture.debugElement.query(By.css('h2')).nativeElement;
     const messageEl = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement;
     expect(titleEl.textContent).toContain('Test Title');
     expect(messageEl.textContent).toContain('Test Message');
   });
 
   it('should close with true on confirm', () => {
     const btn = fixture.debugElement.queryAll(By.css('button'))[1];
     btn.triggerEventHandler('click', null);
     expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
   });
 
   it('should close with false on cancel', () => {
     const btn = fixture.debugElement.queryAll(By.css('button'))[0];
     btn.triggerEventHandler('click', null);
     expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
   });
 });