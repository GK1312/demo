import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderBar } from '../../components/header-bar/header-bar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, HeaderBar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
