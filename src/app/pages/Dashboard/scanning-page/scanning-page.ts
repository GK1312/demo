import { Component } from '@angular/core';
import { PageLayout } from '../../../components/page-layout/page-layout';
import { ScanningSidebar } from './scanning-sidebar/scanning-sidebar';

@Component({
  selector: 'app-scanning-page',
  imports: [PageLayout, ScanningSidebar],
  templateUrl: './scanning-page.html',
  styleUrl: './scanning-page.css',
})
export class ScanningPage {}
