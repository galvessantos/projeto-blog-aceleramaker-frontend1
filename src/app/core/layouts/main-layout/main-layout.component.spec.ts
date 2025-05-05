import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../services/auth.service';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: of({}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return user name from authService', () => {
    authServiceSpy.getCurrentUser.and.returnValue({
      id: 1,
      username: 'john_doe',
      email: 'john.doe@example.com',
      nome: 'John Doe'
    });
  
    expect(component.userName).toBe('John Doe');
  });

  it('should return default user name when no user is logged in', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    expect(component.userName).toBe('Usuário');
  });

  it('should call logout on authService when logout method is called', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
