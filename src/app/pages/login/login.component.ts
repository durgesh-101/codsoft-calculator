import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };

  errorMessage = '';
  returnUrl = '/';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    const mode = this.route.snapshot.queryParamMap.get('mode');

    if (mode === 'admin') {
      this.prefillAdminCredentials();
    }

    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  login(): void {
    const result = this.authService.login(this.credentials.email, this.credentials.password);

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.errorMessage = '';
    this.router.navigateByUrl(this.returnUrl);
  }

  useGeneralLogin(): void {
    this.credentials = {
      email: '',
      password: ''
    };
    this.errorMessage = '';
  }

  useAdminLogin(): void {
    this.prefillAdminCredentials();
    this.errorMessage = '';
  }

  private prefillAdminCredentials(): void {
    this.credentials = {
      email: 'admin@phonehub.com',
      password: 'admin123'
    };
  }
}
