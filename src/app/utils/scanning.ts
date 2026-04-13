export type ScanType =
  | 'All'
  | 'Active Directory Computer Path'
  | 'Active Directory Domain'
  | 'Active Directory Path (Eventlog only)'
  | 'Active Directory User/Group Path'
  | 'Asset Types'
  | 'AWS Regions'
  | 'Azure'
  | 'Chrome OS'
  | 'Intune'
  | 'IntuneV2'
  | 'IP Ranges'
  | 'Office 365'
  | 'Microsoft 365'
  | 'Microsoft Entra ID (Azure Active Directory)'
  | 'Reports'
  | 'SCCM'
  | 'VMware Workspace One UEM (AirWatch)'
  | 'Windows Computers'
  | 'Windows Computers (Eventlog only)'
  | 'Workgroups';

export interface ScanningTarget {
  id: string;
  label: ScanType;
  description: string;
  icon: string;
}

export const SCAN_TYPE_COLORS: Partial<Record<ScanType, string>> = {
  'IP Ranges': '#fe961c',
  'Active Directory Domain': '#5b9ef0',
  Azure: '#0089d6',
  'AWS Regions': '#ff9900',
  'Chrome OS': '#4285f4',
  Intune: '#0078d4',
  IntuneV2: '#0078d4',
  'Microsoft 365': '#d83b01',
  'Office 365': '#d83b01',
  'Microsoft Entra ID (Azure Active Directory)': '#0078d4',
  'VMware Workspace One UEM (AirWatch)': '#607078',
  'Windows Computers': '#7bb850',
  Workgroups: '#c084fc',
  SCCM: '#00b4ab',
};

export const ScanningTargets: ScanningTarget[] = [
  {
    id: 'all',
    label: 'All',
    description: 'All scan target types',
    icon: 'blank.png',
  },
  {
    id: 'ad-computer-path',
    label: 'Active Directory Computer Path',
    description: 'Scan computers in an Active Directory organizational unit path',
    icon: 'ou.gif',
  },
  {
    id: 'ad-domain',
    label: 'Active Directory Domain',
    description: 'Scan all computers in an Active Directory domain',
    icon: 'scanning-ad-domain-16.png',
  },
  {
    id: 'ad-path-eventlog',
    label: 'Active Directory Path (Eventlog only)',
    description: 'Scan Active Directory path restricted to event log data only',
    icon: 'event.png',
  },
  {
    id: 'ad-user-group-path',
    label: 'Active Directory User/Group Path',
    description: 'Scan computers linked to an Active Directory user or group path',
    icon: 'user.png',
  },
  {
    id: 'asset-types',
    label: 'Asset Types',
    description: 'Filter and scan by specific asset types',
    icon: 'hub_16.png',
  },
  {
    id: 'aws-regions',
    label: 'AWS Regions',
    description: 'Scan assets across Amazon Web Services regions',
    icon: 'aws16.png',
  },
  {
    id: 'azure',
    label: 'Azure',
    description: 'Scan assets in Microsoft Azure subscriptions',
    icon: 'azure16.png',
  },
  {
    id: 'chrome-os',
    label: 'Chrome OS',
    description: 'Scan Chrome OS devices via Google Admin',
    icon: 'ChromeOs16.png',
  },
  {
    id: 'intune',
    label: 'Intune',
    description: 'Scan devices managed by Microsoft Intune',
    icon: 'intune16.png',
  },
  {
    id: 'intune-v2',
    label: 'IntuneV2',
    description: 'Scan devices managed by Microsoft Intune (v2 API)',
    icon: 'intune16.png',
  },
  {
    id: 'ip-ranges',
    label: 'IP Ranges',
    description: 'Scan a range of IP addresses on the network',
    icon: 'scanning-ip-range-16.png',
  },
  {
    id: 'office-365',
    label: 'Office 365',
    description: 'Scan users and devices in an Office 365 tenant',
    icon: 'office365_16.png',
  },
  {
    id: 'microsoft-365',
    label: 'Microsoft 365',
    description: 'Scan users and devices in a Microsoft 365 tenant',
    icon: 'office365_16.png',
  },
  {
    id: 'microsoft-entra-id',
    label: 'Microsoft Entra ID (Azure Active Directory)',
    description: 'Scan identities and devices in Microsoft Entra ID',
    icon: 'azureAd16.png',
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Scan targets defined by saved reports',
    icon: 'report.png',
  },
  {
    id: 'sccm',
    label: 'SCCM',
    description: 'Scan devices managed by System Center Configuration Manager',
    icon: 'sccm16.png',
  },
  {
    id: 'vmware-workspace-one',
    label: 'VMware Workspace One UEM (AirWatch)',
    description: 'Scan devices managed by VMware Workspace One UEM',
    icon: 'VMwareWorkspaceOneUEM16.png',
  },
  {
    id: 'windows-computers',
    label: 'Windows Computers',
    description: 'Scan Windows computers directly on the network',
    icon: 'cok.png',
  },
  {
    id: 'windows-computers-eventlog',
    label: 'Windows Computers (Eventlog only)',
    description: 'Scan Windows computers restricted to event log data only',
    icon: 'event.png',
  },
  {
    id: 'workgroups',
    label: 'Workgroups',
    description: 'Scan computers belonging to a Windows workgroup',
    icon: 'workgroup.png',
  },
];

export interface ScanTarget {
  id: string;
  enabled: boolean;
  scanType: ScanType;
  target: string;
  description: string;
  schedule: string | null;
  showSchedule: boolean;
  options: string | null;
  showOptions: boolean;
  lastScanned: string | null;
  error: string | null;
  isScanning: boolean;
}
