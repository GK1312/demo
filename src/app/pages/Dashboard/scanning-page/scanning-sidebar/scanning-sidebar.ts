import { Component } from '@angular/core';
import { routes } from '../../../../app.routes';

@Component({
  selector: 'app-scanning-sidebar',
  imports: [],
  templateUrl: './scanning-sidebar.html',
  styleUrl: './scanning-sidebar.css',
})
export class ScanningSidebar {
  SidebarItems = [
    {
      label: 'Asset Options',
      childrens: [
        { label: 'New asset', route: '' },
        { label: 'New location', route: '' },
      ],
    },
    {
      label: 'Basic Actions',
      childrens: [
        { label: 'Ping', route: '' },
        { label: 'Pathing', route: '' },
      ],
    },
  ];
}
