import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DialogRef } from '../../../../services/dialog/dialog-ref';
import { DIALOG_REF } from '../../../../services/dialog/dialog.tokens';
import { ScanTarget, ScanType, ScanningTargets } from '../../../../utils/scanning';

type ScanTypeGroup =
  | 'ip'
  | 'chromeos'
  | 'ad'
  | 'cloud'
  | 'aws'
  | 'windows'
  | 'workgroup'
  | 'sccm'
  | 'vmware'
  | 'simple';

function getScanTypeGroup(type: ScanType): ScanTypeGroup {
  switch (type) {
    case 'IP Ranges':
      return 'ip';
    case 'Chrome OS':
      return 'chromeos';
    case 'Active Directory Domain':
    case 'Active Directory Computer Path':
    case 'Active Directory Path (Eventlog only)':
    case 'Active Directory User/Group Path':
      return 'ad';
    case 'Azure':
    case 'Intune':
    case 'IntuneV2':
    case 'Microsoft 365':
    case 'Office 365':
    case 'Microsoft Entra ID (Azure Active Directory)':
      return 'cloud';
    case 'AWS Regions':
      return 'aws';
    case 'Windows Computers':
    case 'Windows Computers (Eventlog only)':
      return 'windows';
    case 'Workgroups':
      return 'workgroup';
    case 'SCCM':
      return 'sccm';
    case 'VMware Workspace One UEM (AirWatch)':
      return 'vmware';
    default:
      return 'simple';
  }
}

export const SCHEDULE_DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

@Component({
  selector: 'app-add-target-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './add-target-dialog.html',
  styleUrl: './add-target-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTargetDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DIALOG_REF) as DialogRef<ScanTarget>;

  readonly scanTargetTypes = ScanningTargets.filter((t) => t.label !== 'All');
  readonly days = SCHEDULE_DAYS;

  readonly form = this.fb.nonNullable.group({
    targetType: ['IP Ranges' as ScanType],
    // ── IP Range ──────────────────────────────────────────────────────
    ipStart: [''],
    ipEnd: [''],
    pingTimeout: [2],
    dontPing: [false],
    savePingedIp: [true],
    ignoreWindows: [false],
    scanNewWindowsOnly: [false],
    noSsh: [false],
    sshPort: [22],
    sipPort: [5060],
    // ── Chrome OS ─────────────────────────────────────────────────────
    credentialName: [''],
    // ── Shared credential fields ──────────────────────────────────────
    username: [''],
    password: [''],
    // ── Chrome OS only ────────────────────────────────────────────────
    jsonKey: [''],
    // ── Cloud (Azure / Intune / M365 / O365 / Entra ID) ──────────────
    tenantId: [''],
    clientId: [''],
    clientSecret: [''],
    // ── AWS ───────────────────────────────────────────────────────────
    region: [''],
    accessKey: [''],
    secretKey: [''],
    // ── Active Directory ──────────────────────────────────────────────
    domain: [''],
    adPath: [''],
    // ── SCCM ──────────────────────────────────────────────────────────
    sccmServer: [''],
    database: [''],
    // ── VMware ────────────────────────────────────────────────────────
    serverUrl: [''],
    // ── Windows / Workgroup ───────────────────────────────────────────
    computer: [''],
    workgroupName: [''],
    // ── Common ────────────────────────────────────────────────────────
    targetDescription: [''],
    schedule: this.fb.array(
      SCHEDULE_DAYS.map(() => this.fb.nonNullable.group({ enabled: [true], time: ['12:45'] })),
    ),
    recurringEnabled: [false],
    recurringValue: [1],
    recurringUnit: ['Minutes'],
    enableTarget: [true],
    scanMethod: ['POWERSHELL'],
  });

  readonly selectedType = toSignal(this.form.controls.targetType.valueChanges, {
    initialValue: this.form.controls.targetType.value,
  });

  readonly isRecurring = toSignal(this.form.controls.recurringEnabled.valueChanges, {
    initialValue: false,
  });

  readonly scanTypeGroup = computed(() => getScanTypeGroup(this.selectedType()));

  readonly typeSearch = signal('');
  readonly typeDropdownOpen = signal(false);
  readonly filteredTypes = computed(() => {
    const q = this.typeSearch().toLowerCase().trim();
    if (!q) return this.scanTargetTypes;
    return this.scanTargetTypes.filter((t) => t.label.toLowerCase().includes(q));
  });

  private readonly typeSearchInput = viewChild<ElementRef<HTMLInputElement>>('typeSearchInput');

  constructor() {
    const schedule = this.form.controls.schedule;

    // Recurring enabled → uncheck + disable all day checkboxes
    this.form.controls.recurringEnabled.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((enabled) => {
        if (enabled) {
          schedule.controls.forEach((ctrl) => {
            ctrl.get('enabled')?.setValue(false, { emitEvent: false });
            ctrl.get('enabled')?.disable({ emitEvent: false });
          });
        } else {
          schedule.controls.forEach((ctrl) => {
            ctrl.get('enabled')?.enable({ emitEvent: false });
          });
        }
      });

    // Any day checked → uncheck recurring (emit so isRecurring signal updates)
    schedule.valueChanges.pipe(takeUntilDestroyed()).subscribe((vals) => {
      if (vals.some((d) => d.enabled) && this.form.controls.recurringEnabled.value) {
        this.form.controls.recurringEnabled.setValue(false);
      }
    });
  }

  get scheduleControls(): AbstractControl[] {
    return (this.form.get('schedule') as FormArray).controls;
  }

  private buildScheduleString(): string | null {
    const v = this.form.getRawValue();
    const parts: string[] = [];
    SCHEDULE_DAYS.forEach((day, i) => {
      if (v.schedule[i].enabled) {
        parts.push(`${day.label.slice(0, 3)} ${v.schedule[i].time}`);
      }
    });
    if (parts.length === 0) return null;
    let str = parts.join(', ');
    if (v.recurringEnabled) {
      str += ` | Every ${v.recurringValue} ${v.recurringUnit}`;
    }
    return str;
  }

  private buildOptionsString(): string | null {
    const v = this.form.getRawValue();
    const group = this.scanTypeGroup();
    const parts: string[] = [];
    if (group === 'ip') {
      parts.push(`Method: ${v.scanMethod}`);
      if (v.dontPing) parts.push('No Ping');
      if (v.savePingedIp) parts.push('Save Pinged IP');
      if (v.ignoreWindows) parts.push('Ignore Windows');
      if (v.scanNewWindowsOnly) parts.push('New Windows Only');
      if (v.noSsh) parts.push('No SSH');
      parts.push(`Timeout: ${v.pingTimeout}s`, `SSH: ${v.sshPort}`, `SIP: ${v.sipPort}`);
    } else if (group === 'chromeos') {
      if (v.credentialName) parts.push(`Credential: ${v.credentialName}`);
      if (v.username) parts.push(`User: ${v.username}`);
    } else if (group === 'ad') {
      if (v.domain) parts.push(`Domain: ${v.domain}`);
      if (v.adPath) parts.push(`Path: ${v.adPath}`);
    } else if (group === 'cloud') {
      if (v.tenantId) parts.push(`Tenant: ${v.tenantId}`);
    } else if (group === 'aws') {
      if (v.region) parts.push(`Region: ${v.region}`);
    } else if (group === 'sccm') {
      if (v.sccmServer) parts.push(`Server: ${v.sccmServer}`);
      if (v.database) parts.push(`DB: ${v.database}`);
    } else if (group === 'vmware') {
      if (v.serverUrl) parts.push(`Server: ${v.serverUrl}`);
    }
    return parts.length > 0 ? parts.join(', ') : null;
  }

  private buildTargetString(): string {
    const v = this.form.getRawValue();
    switch (this.scanTypeGroup()) {
      case 'ip':
        return v.ipStart && v.ipEnd ? `${v.ipStart} – ${v.ipEnd}` : v.ipStart || '—';
      case 'chromeos':
        return v.credentialName || '—';
      case 'ad':
        return v.adPath || v.domain || '—';
      case 'cloud':
        return v.tenantId || '—';
      case 'aws':
        return v.region || '—';
      case 'windows':
        return v.computer || '—';
      case 'workgroup':
        return v.workgroupName || '—';
      case 'sccm':
        return v.sccmServer || '—';
      case 'vmware':
        return v.serverUrl || '—';
      default:
        return '—';
    }
  }

  toggleTypeDropdown(): void {
    const wasOpen = this.typeDropdownOpen();
    this.typeDropdownOpen.update((v) => !v);
    if (!wasOpen) {
      this.typeSearch.set('');
      requestAnimationFrame(() => this.typeSearchInput()?.nativeElement.focus());
    }
  }

  closeTypeDropdown(): void {
    this.typeDropdownOpen.set(false);
    this.typeSearch.set('');
  }

  selectType(label: string): void {
    this.form.controls.targetType.setValue(label as ScanType);
    this.closeTypeDropdown();
  }

  onTypeSearch(event: Event): void {
    this.typeSearch.set((event.target as HTMLInputElement).value);
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const result: ScanTarget = {
      id: Date.now().toString(),
      enabled: v.enableTarget,
      scanType: v.targetType,
      target: this.buildTargetString(),
      description: v.targetDescription,
      schedule: this.buildScheduleString(),
      showSchedule: false,
      options: this.buildOptionsString(),
      showOptions: false,
      lastScanned: null,
      error: null,
      isScanning: false,
    };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
