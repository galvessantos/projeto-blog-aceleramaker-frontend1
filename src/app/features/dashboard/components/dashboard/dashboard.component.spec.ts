import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { PostagemService } from '../../../../core/services/postagem.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let postagemService: PostagemService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, MatSnackBarModule, HttpClientTestingModule],
      providers: [
        PostagemService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    postagemService = TestBed.inject(PostagemService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle errors when loading postagens', () => {
    spyOn(postagemService, 'getAllPosts').and.returnValue(throwError(() => new Error('Erro ao carregar postagens'))); // Simula erro no serviço
    component.loadPostagens();
    fixture.detectChanges();
    expect(component.postagens).toEqual([]); 
  });
});