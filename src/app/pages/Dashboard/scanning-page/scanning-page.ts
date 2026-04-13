import { Component, signal, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayout } from '../../../components/page-layout/page-layout';
import { ScanningSidebar } from './scanning-sidebar/scanning-sidebar';
import { ScanType, SCAN_TYPE_COLORS, ScanningTargets, ScanTarget } from '../../../utils/scanning';
import { DialogService } from '../../../services/dialog/dialog.service';
import { AddTargetDialog } from './add-target-dialog/add-target-dialog';

export type { ScanTarget };

@Component({
  selector: 'app-scanning-page',
  imports: [PageLayout, ScanningSidebar, CommonModule, FormsModule],
  templateUrl: './scanning-page.html',
  styleUrl: './scanning-page.css',
})
export class ScanningPage {
  private readonly dialog = inject(DialogService);

  readonly scanTypeColors = SCAN_TYPE_COLORS;
  readonly scanningTargets = ScanningTargets;

  getScanTypeColor(scanType: ScanType): string {
    return SCAN_TYPE_COLORS[scanType] ?? '#6f6f6f';
  }

  scanTargets = signal<ScanTarget[]>([
    {
      id: '1',
      enabled: true,
      scanType: 'IP Ranges',
      target: '192.168.0.213 - 192.168.0.220',
      description: 'Office LAN range',
      schedule: 'Every day at 02:00 AM',
      showSchedule: false,
      options: 'Ping + SNMP, Timeout: 5s',
      showOptions: false,
      lastScanned: '2024-06-15 14:30',
      error: null,
      isScanning: false,
    },
    {
      id: '2',
      enabled: true,
      scanType: 'Windows Computers',
      target: '10.0.0.1',
      description: 'Main gateway',
      schedule: 'Every hour',
      showSchedule: false,
      options: 'Ping only, Timeout: 2s',
      showOptions: false,
      lastScanned: '2024-06-15 13:00',
      error: null,
      isScanning: false,
    },
    {
      id: '3',
      enabled: false,
      scanType: 'Active Directory Domain',
      target: 'server.internal.local',
      description: 'Internal app server',
      schedule: null,
      showSchedule: false,
      options: null,
      showOptions: false,
      lastScanned: null,
      error: 'Hostname resolution failed',
      isScanning: false,
    },
    {
      id: '4',
      enabled: true,
      scanType: 'IP Ranges',
      target: '172.16.0.0/24',
      description: 'Dev subnet',
      schedule: 'Weekly on Monday 01:00 AM',
      showSchedule: false,
      options: 'Full scan, Timeout: 10s',
      showOptions: false,
      lastScanned: '2024-06-12 09:45',
      error: null,
      isScanning: false,
    },
    {
      id: '5',
      enabled: true,
      scanType: 'IP Ranges',
      target: '192.168.1.1 - 192.168.1.50',
      description: 'Warehouse devices',
      schedule: 'Every 6 hours',
      showSchedule: false,
      options: 'Ping + WMI, Timeout: 8s',
      showOptions: false,
      lastScanned: '2024-06-15 10:15',
      error: 'Partial timeout (3 hosts)',
      isScanning: false,
    },
  ]);

  enabledCount = computed(() => this.scanTargets().filter((t) => t.enabled).length);
  errorCount = computed(() => this.scanTargets().filter((t) => t.error).length);
  allEnabled = computed(
    () => this.scanTargets().length > 0 && this.scanTargets().every((t) => t.enabled),
  );

  scanNowAll(): void {
    this.scanTargets.update((targets) =>
      targets.map((t) => (t.enabled ? { ...t, isScanning: true } : t)),
    );
  }

  scanNow(target: ScanTarget): void {
    this.scanTargets.update((targets) =>
      targets.map((t) => (t.id === target.id ? { ...t, isScanning: true } : t)),
    );
  }

  toggleEnabled(target: ScanTarget): void {
    this.scanTargets.update((targets) =>
      targets.map((t) => (t.id === target.id ? { ...t, enabled: !t.enabled } : t)),
    );
  }

  enableAll(): void {
    if (this.allEnabled()) {
      this.scanTargets.update((targets) => targets.map((t) => ({ ...t, enabled: false })));
    } else {
      this.scanTargets.update((targets) => targets.map((t) => ({ ...t, enabled: true })));
    }
  }

  toggleSchedule(target: ScanTarget, event: MouseEvent): void {
    event.stopPropagation();
    this.scanTargets.update((targets) =>
      targets.map((t) =>
        t.id === target.id
          ? { ...t, showSchedule: !t.showSchedule, showOptions: false }
          : { ...t, showSchedule: false, showOptions: false },
      ),
    );
  }

  toggleOptions(target: ScanTarget, event: MouseEvent): void {
    event.stopPropagation();
    this.scanTargets.update((targets) =>
      targets.map((t) =>
        t.id === target.id
          ? { ...t, showOptions: !t.showOptions, showSchedule: false }
          : { ...t, showSchedule: false, showOptions: false },
      ),
    );
  }

  @HostListener('document:click')
  closeAllDropdowns(): void {
    this.scanTargets.update((targets) =>
      targets.map((t) => ({ ...t, showSchedule: false, showOptions: false })),
    );
  }

  addTarget(): void {
    const ref = this.dialog.open<AddTargetDialog, ScanTarget>(AddTargetDialog, {
      width: '500px',
    });
    ref.afterClosed$.subscribe((target) => {
      if (target) {
        this.scanTargets.update((targets) => [...targets, target]);
      }
    });
  }

  editTarget(target: ScanTarget): void {}

  deleteTarget(target: ScanTarget): void {
    this.scanTargets.update((targets) => targets.filter((t) => t.id !== target.id));
  }

  getOptionItems(options: string): string[] {
    return options
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
  }
}
