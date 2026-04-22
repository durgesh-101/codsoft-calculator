import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface AuthUser {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersStorageKey = 'phonehub_users';
  private readonly sessionStorageKey = 'phonehub_session';
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredSession());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.seedAdminAccount();
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  signup(name: string, email: string, password: string): { success: boolean; message: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
    this.setSession({ name: newUser.name, email: newUser.email, role: newUser.role });

    return { success: true, message: 'Account created successfully.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.getStoredUsers().find(
      (storedUser) => storedUser.email === normalizedEmail && storedUser.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    this.setSession({ name: user.name, email: user.email, role: user.role || 'user' });
    return { success: true, message: 'Signed in successfully.' };
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private getStoredUsers(): StoredUser[] {
    const storedUsers = localStorage.getItem(this.usersStorageKey);

    if (!storedUsers) {
      return [];
    }

    try {
      const parsedUsers = JSON.parse(storedUsers) as Array<StoredUser | Omit<StoredUser, 'role'>>;
      return parsedUsers.map((user) => ({
        ...user,
        role: 'role' in user ? user.role : 'user'
      }));
    } catch {
      return [];
    }
  }

  private getStoredSession(): AuthUser | null {
    const storedSession = localStorage.getItem(this.sessionStorageKey);

    if (!storedSession) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(storedSession) as AuthUser | Omit<AuthUser, 'role'>;
      return {
        ...parsedSession,
        role: 'role' in parsedSession ? parsedSession.role : 'user'
      };
    } catch {
      return null;
    }
  }

  private setSession(user: AuthUser): void {
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private seedAdminAccount(): void {
    const users = this.getStoredUsers();
    const adminEmail = 'admin@phonehub.com';

    if (users.some((user) => user.email === adminEmail)) {
      return;
    }

    users.push({
      name: 'PhoneHub Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin'
    });

    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }
}
