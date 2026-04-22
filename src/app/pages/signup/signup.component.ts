import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  account = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  signup(): void {
    if (this.account.password !== this.account.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const result = this.authService.signup(this.account.name, this.account.email, this.account.password);

    if (!result.success) {
      this.errorMessage = result.message;
      return;
    }

    this.errorMessage = '';
    this.router.navigateByUrl(this.returnUrl);
  }
}
