import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header-bar.html',
  styleUrl: './header-bar.css',
})
export class HeaderBar {
  readonly version = input<string>('v.12.5.6.2');
  readonly avatarUrl = input<string>(
    'https://lh3.googleusercontent.com/QLXCAM0GgjwKbw-8bTSrxnMvkvDYghiTD5y9ZGVaArAFR0cKiR3zLsTuwxhmYNUqVKurW-N5eGFMHYq8DCPQyMO0OQ',
  );
  readonly navItems = input<NavItem[]>([
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Assets', route: '/dashboard/scanning' },
  ]);

  readonly action1Click = output<void>();
  readonly action2Click = output<void>();
  readonly action3Click = output<void>();
}
