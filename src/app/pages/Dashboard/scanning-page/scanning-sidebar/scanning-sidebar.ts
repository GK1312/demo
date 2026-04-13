import { Component } from '@angular/core';

@Component({
  selector: 'app-scanning-sidebar',
  imports: [],
  templateUrl: './scanning-sidebar.html',
  styleUrl: './scanning-sidebar.css',
})
export class ScanningSidebar {
  SidebarItems = [
    {
      label: 'Scanning Options',
      childrens: [
        { label: 'Scanning Targets', route: '' },
        { label: 'Scanning Credentials', route: '' },
      ],
    },
    {
      label: 'Scanning Status',
      childrens: [
        { label: 'Scanning Queue', route: '' },
        { label: 'Scanned in last 7 days', route: '' },
        { label: 'Scanned in last 24 hours', route: '' },
      ],
    },
  ];
}
