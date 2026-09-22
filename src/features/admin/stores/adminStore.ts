/**
 * SPWN Apps 2.0 - Central Admin Dashboard State Store
 * Location: src/features/admin/stores/adminStore.ts
 */

import { create } from 'zustand';
import {
  AdminMemberRecord,
  MemberAdminStatus,
  KtaGenerationLogEntry,
  MemberApprovalEntry,
  MemberChangeHistoryEntry,
  PublicVerificationLogEntry,
  RegionSeederStatus,
  AdminActiveTab,
} from '../types/admin.types';
import { ktaService } from '../../../services/ktaService';
import { ROLES, UserRole } from '../../../config/constants';

// Initial Mock Members (Zero NIK, SAKA Official Roles, Separated Status)
const INITIAL_MEMBERS: AdminMemberRecord[] = [
  {
    id: 'MEM-001',
    nomor_kta: '00.000001',
    nama_lengkap: 'Dr. H. Bambang Soedirman, M.Par',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '1975-04-12',
    jenis_kelamin: 'L',
    golongan_darah: 'O',
    provinsi_id: '31',
    provinsi_nama: 'DKI JAKARTA',
    kabupaten_id: '3171',
    kabupaten_nama: 'KOTA ADM. JAKARTA PUSAT',
    wilayah_kecamatan_id: '010',
    krida_id: 'KRIDA_PEMANDU',
    krida_nama: 'Krida Pemandu',
    tingkat_keanggotaan: 'Pamong Saka',
    status_anggota: 'ACTIVE',
    kta_status: 'ACTIVE',
    status: 'ACTIVE',
    email: 'superadmin@spwn.id',
    nomor_telepon: '08119876543',
    alamat_domisili: 'Jl. Medan Merdeka Timur No. 6, Jakarta Pusat',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    qr_token: 'SPWN-QR-NAS-8F2B1C90',
    qr_url: 'https://spwn.id/verifikasi/SPWN-QR-NAS-8F2B1C90',
    qr_status: 'ACTIVE',
    level_organisasi: 'KWARTIR_NASIONAL',
    tanggal_bergabung: '2023-01-15',
    tanggal_aktivasi: '2023-01-16',
    activated_by: 'Kwarnas Admin',
    activated_at: '2023-01-16T10:00:00Z',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-01-16T10:00:00Z',
  },
  {
    id: 'MEM-002',
    nomor_kta: '00.32.04.190.000123',
    nama_lengkap: 'Fajar Nugraha Wijaya',
    tempat_lahir: 'Bandung',
    tanggal_lahir: '1998-08-15',
    jenis_kelamin: 'L',
    golongan_darah: 'A',
    provinsi_id: '32',
    provinsi_nama: 'JAWA BARAT',
    kabupaten_id: '3204',
    kabupaten_nama: 'KABUPATEN BANDUNG',
    wilayah_kecamatan_id: '190',
    krida_id: 'KRIDA_PEMANDU',
    krida_nama: 'Krida Pemandu',
    tingkat_keanggotaan: 'Anggota',
    status_anggota: 'ACTIVE',
    kta_status: 'ACTIVE',
    status: 'ACTIVE',
    email: 'fajar.nusantara@gmail.com',
    nomor_telepon: '081234567890',
    alamat_domisili: 'Jl. Soreang Raya No. 45, Soreang, Bandung',
    foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    qr_token: 'SPWN-QR-WIL-3204-7A8F9C1B',
    qr_url: 'https://spwn.id/verifikasi/SPWN-QR-WIL-3204-7A8F9C1B',
    qr_status: 'ACTIVE',
    level_organisasi: 'WILAYAH',
    tanggal_bergabung: '2024-02-10',
    tanggal_aktivasi: '2024-02-12',
    activated_by: 'Siti Nurhaliza Putri (Admin Jabar)',
    activated_at: '2024-02-12T14:30:00Z',
    created_at: '2024-02-10T09:00:00Z',
    updated_at: '2024-02-12T14:30:00Z',
  },
  {
    id: 'MEM-003',
    nomor_kta: '00.32.01.010.000124',
    nama_lengkap: 'Annisa Rahmawati Putri',
    tempat_lahir: 'Bogor',
    tanggal_lahir: '2001-06-25',
    jenis_kelamin: 'P',
    golongan_darah: 'B',
    provinsi_id: '32',
    provinsi_nama: 'JAWA BARAT',
    kabupaten_id: '3201',
    kabupaten_nama: 'KABUPATEN BOGOR',
    wilayah_kecamatan_id: '010',
    krida_id: 'KRIDA_PENYULUH',
    krida_nama: 'Krida Penyuluh',
    tingkat_keanggotaan: 'Dewan Saka',
    status_anggota: 'ACTIVE',
    kta_status: 'ACTIVE',
    status: 'ACTIVE',
    email: 'annisa.bogor@gmail.com',
    nomor_telepon: '085712349988',
    alamat_domisili: 'Kecamatan Nanggung, Kab. Bogor',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    qr_token: 'SPWN-QR-WIL-3201-9F3C1A7E',
    qr_url: 'https://spwn.id/verifikasi/SPWN-QR-WIL-3201-9F3C1A7E',
    qr_status: 'ACTIVE',
    level_organisasi: 'WILAYAH',
    tanggal_bergabung: '2024-03-01',
    tanggal_aktivasi: '2024-03-03',
    activated_by: 'Siti Nurhaliza Putri (Admin Jabar)',
    activated_at: '2024-03-03T11:00:00Z',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-03T11:00:00Z',
  },
  {
    id: 'MEM-004',
    nomor_kta: '',
    nama_lengkap: 'Bagas Aditya Pratama',
    tempat_lahir: 'Cibinong',
    tanggal_lahir: '2002-07-14',
    jenis_kelamin: 'L',
    golongan_darah: 'O',
    provinsi_id: '32',
    provinsi_nama: 'JAWA BARAT',
    kabupaten_id: '3201',
    kabupaten_nama: 'KABUPATEN BOGOR',
    wilayah_kecamatan_id: '020',
    krida_id: 'KRIDA_KULINER_CINDERAMATA',
    krida_nama: 'Krida Kuliner & Cinderamata',
    tingkat_keanggotaan: 'Anggota',
    status_anggota: 'ACTIVE',
    kta_status: 'NOT_CREATED',
    status: 'ACTIVE',
    email: 'bagas.kuliner@pramuka.or.id',
    nomor_telepon: '089612345678',
    alamat_domisili: 'Jl. Sukahati No. 12, Cibinong, Bogor',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    level_organisasi: 'WILAYAH',
    tanggal_bergabung: '2026-03-10',
    tanggal_aktivasi: '2026-03-15',
    activated_by: 'Admin Pusat SPWN',
    activated_at: '2026-03-15T09:30:00Z',
    created_at: '2026-03-10T11:00:00Z',
    updated_at: '2026-03-15T09:30:00Z',
  },
  {
    id: 'MEM-005',
    nomor_kta: '',
    nama_lengkap: 'Rizky Dwi Santoso',
    tempat_lahir: 'Semarang',
    tanggal_lahir: '2003-09-12',
    jenis_kelamin: 'L',
    golongan_darah: 'AB',
    provinsi_id: '33',
    provinsi_nama: 'JAWA TENGAH',
    kabupaten_id: '3374',
    kabupaten_nama: 'KOTA SEMARANG',
    wilayah_kecamatan_id: '010',
    krida_id: 'KRIDA_MICE_EVENT',
    krida_nama: 'Krida Mice & Event',
    tingkat_keanggotaan: 'Anggota',
    status_anggota: 'REVIEWED_VERIFIED',
    kta_status: 'NOT_CREATED',
    status: 'REVIEWED_VERIFIED',
    email: 'rizky.santoso@semarang.id',
    nomor_telepon: '081399887766',
    alamat_domisili: 'Jl. Pemuda No. 100, Semarang',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    level_organisasi: 'WILAYAH',
    tanggal_bergabung: '2026-03-18',
    created_at: '2026-03-18T14:20:00Z',
    updated_at: '2026-03-18T14:20:00Z',
  },
  {
    id: 'MEM-006',
    nomor_kta: '',
    nama_lengkap: 'Ni Luh Made Suartini',
    tempat_lahir: 'Denpasar',
    tanggal_lahir: '2004-01-15',
    jenis_kelamin: 'P',
    golongan_darah: 'A',
    provinsi_id: '51',
    provinsi_nama: 'BALI',
    kabupaten_id: '5171',
    kabupaten_nama: 'KOTA DENPASAR',
    wilayah_kecamatan_id: '020',
    krida_id: 'KRIDA_PEMANDU',
    krida_nama: 'Krida Pemandu',
    tingkat_keanggotaan: 'Anggota',
    status_anggota: 'PENDING',
    kta_status: 'NOT_CREATED',
    status: 'PENDING',
    email: 'suartini.bali@gmail.com',
    nomor_telepon: '087860123456',
    alamat_domisili: 'Jl. Teuku Umar No. 88, Denpasar Barat',
    foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    level_organisasi: 'WILAYAH',
    tanggal_bergabung: '2026-03-20',
    created_at: '2026-03-20T16:45:00Z',
    updated_at: '2026-03-20T16:45:00Z',
  },
  {
    id: 'MEM-007',
    nomor_kta: '',
    nama_lengkap: 'Dimas Arya Pamungkas',
    tempat_lahir: 'Surabaya',
    tanggal_lahir: '2001-02-20',
    jenis_kelamin: 'L',
    golongan_darah: 'B',
    provinsi_id: '35',
    provinsi_nama: 'JAWA TIMUR',
    kabupaten_id: '3578',
    kabupaten_nama: 'KOTA SURABAYA',
    wilayah_kecamatan_id: '030',
    krida_id: 'KRIDA_PENYULUH',
    krida_nama: 'Krida Penyuluh',
    tingkat_keanggotaan: 'Pamong Saka',
    status_anggota: 'ACTIVE',
    kta_status: 'NOT_CREATED',
    status: 'ACTIVE',
    email: 'dimas.arya@jatimpramuka.id',
    nomor_telepon: '082133445566',
    alamat_domisili: 'Gubeng, Surabaya Timur',
    foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    level_organisasi: 'WILAYAH',
    tanggal_bergabung: '2026-03-12',
    tanggal_aktivasi: '2026-03-19',
    activated_by: 'Admin Pusat SPWN',
    activated_at: '2026-03-19T10:15:00Z',
    created_at: '2026-03-12T13:00:00Z',
    updated_at: '2026-03-19T10:15:00Z',
  },
];

const INITIAL_KTA_LOGS: KtaGenerationLogEntry[] = [
  {
    id: 'KLOG-A19F',
    member_id: 'MEM-001',
    nomor_kta: '00.000001',
    qr_token: 'SPWN-QR-NAS-8F2B1C90',
    action_type: 'INITIAL_ISSUE',
    reason: 'Penerbitan KTA Kwartir Nasional Perdana',
    generated_by: 'Super Administrator',
    generated_at: '2023-01-16T10:00:00Z',
  },
  {
    id: 'KLOG-B28C',
    member_id: 'MEM-002',
    nomor_kta: '00.3204.190.000123',
    qr_token: 'SPWN-QR-WIL-3204-7A8F9C1B',
    action_type: 'INITIAL_ISSUE',
    reason: 'Aktivasi Resmi Anggota Jawa Barat',
    generated_by: 'Siti Nurhaliza Putri',
    generated_at: '2024-02-12T14:30:00Z',
  },
  {
    id: 'KLOG-C37D',
    member_id: 'MEM-003',
    nomor_kta: '00.3201.010.000124',
    qr_token: 'SPWN-QR-WIL-3201-9F3C1A7E',
    action_type: 'INITIAL_ISSUE',
    reason: 'Penerbitan KTA Wilayah Kab. Bogor',
    generated_by: 'Siti Nurhaliza Putri',
    generated_at: '2024-03-03T11:00:00Z',
  },
];

const INITIAL_APPROVALS: MemberApprovalEntry[] = [
  {
    id: 'APP-01',
    member_id: 'MEM-004',
    step_name: 'VERIFIKASI_FAKTUAL',
    reviewer_id: 'usr-adminwilayah',
    reviewer_role: 'ADMIN_WILAYAH',
    decision: 'APPROVED',
    notes: 'KTA Gudep, SKK Kuliner, dan KTP absah',
    reviewed_at: '2026-03-15T09:30:00Z',
  },
  {
    id: 'APP-02',
    member_id: 'MEM-007',
    step_name: 'VERIFIKASI_FAKTUAL',
    reviewer_id: 'usr-adminpusat',
    reviewer_role: 'ADMIN_PUSAT',
    decision: 'APPROVED',
    notes: 'Verifikasi faktual selesai via Kwarda Jatim',
    reviewed_at: '2026-03-19T10:15:00Z',
  },
];

const INITIAL_CHANGE_HISTORY: MemberChangeHistoryEntry[] = [
  {
    id: 'HIST-01',
    member_id: 'MEM-002',
    field_name: 'tingkat_keanggotaan',
    old_value: 'Tamu Saka',
    new_value: 'Penegak Bantara',
    actor_id: 'usr-adminwilayah',
    actor_role: 'ADMIN_WILAYAH',
    reason: 'Pelantikan Bantara Saka Pariwisata Kab. Bandung',
    timestamp: '2024-02-12T14:25:00Z',
  },
  {
    id: 'HIST-02',
    member_id: 'MEM-003',
    field_name: 'status_anggota',
    old_value: 'APPROVED',
    new_value: 'ACTIVE',
    actor_id: 'usr-adminwilayah',
    actor_role: 'ADMIN_WILAYAH',
    reason: 'Aktivasi penerbitan kartu identitas KTA resmi',
    timestamp: '2024-03-03T11:00:00Z',
  },
];

const INITIAL_PUBLIC_LOGS: PublicVerificationLogEntry[] = [
  {
    id: 'PVL-001',
    qr_token: 'SPWN-QR-NAS-8F2B1C90',
    nomor_kta: '00.000001',
    nama_lengkap: 'Dr. H. Bambang Soedirman, M.Par',
    scanned_at: '2026-09-21T06:14:20Z',
    ip_address: '182.253.112.44',
    device_info: 'Chrome Mobile / Android 14',
    verification_status: 'VALID',
  },
  {
    id: 'PVL-002',
    qr_token: 'SPWN-QR-WIL-3204-7A8F9C1B',
    nomor_kta: '00.3204.190.000123',
    nama_lengkap: 'Fajar Nugraha Wijaya',
    scanned_at: '2026-09-20T19:45:10Z',
    ip_address: '114.122.38.19',
    device_info: 'Mobile Safari / iOS 17.4',
    verification_status: 'VALID',
  },
  {
    id: 'PVL-003',
    qr_token: 'SPWN-QR-WIL-3201-9F3C1A7E',
    nomor_kta: '00.3201.010.000124',
    nama_lengkap: 'Annisa Rahmawati Putri',
    scanned_at: '2026-09-20T11:05:32Z',
    ip_address: '36.85.12.80',
    device_info: 'Firefox Desktop / Windows 11',
    verification_status: 'VALID',
  },
];

interface AdminState {
  activeTab: AdminActiveTab;
  setActiveTab: (tab: AdminActiveTab) => void;

  // Scoping
  simulatedScope: 'SUPER_ADMIN' | 'ADMIN_PUSAT' | 'ADMIN_WILAYAH';
  scopeProvinceId: string; // 'ALL' or '32'
  scopeProvinceName: string;
  scopeRegencyId: string; // 'ALL' or '3201'
  scopeRegencyName: string;
  setSimulatedScope: (scope: 'SUPER_ADMIN' | 'ADMIN_PUSAT' | 'ADMIN_WILAYAH', provId?: string, provName?: string, regId?: string, regName?: string) => void;

  // Data Collections
  members: AdminMemberRecord[];
  ktaLogs: KtaGenerationLogEntry[];
  approvals: MemberApprovalEntry[];
  changeHistory: MemberChangeHistoryEntry[];
  publicLogs: PublicVerificationLogEntry[];

  // Seeder Status
  regionSeederStatus: RegionSeederStatus;
  isSeederRunning: boolean;
  seederProgress: number;

  // Selected for Modal/Inspect
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;

  // Actions - Phase 3 Lifecycle Management & Privacy Refactor
  addMember: (memberData: Omit<AdminMemberRecord, 'id' | 'created_at' | 'updated_at'>) => AdminMemberRecord;
  reviewMember: (memberId: string, notes: string, reviewerName: string, reviewerRole?: string) => void;
  reviewMemberWilayah: (memberId: string, notes: string, reviewerName: string) => void;
  approveMember: (memberId: string, notes: string, reviewerName: string, reviewerRole?: string) => void;
  approveMemberPusat: (memberId: string, notes: string, sessionUserName: string) => void;
  rejectMember: (memberId: string, notes: string, reviewerName: string, reviewerRole?: string) => void;
  generateKta: (memberId: string, reason: string, sessionUserName: string) => { nomorKta: string; qrToken: string };
  revokeKta: (memberId: string, reason: string, sessionUserName: string) => void;
  activateMember: (memberId: string, notes: string, sessionUserName: string) => { nomorKta: string; qrToken: string };
  regenerateKta: (memberId: string, reason: string, sessionUserName: string) => { nomorKta: string; qrToken: string };
  updateMemberPhoto: (memberId: string, newPhotoUrl: string, reason: string, sessionUserName: string, sessionUserRole: string) => void;
  updateMemberAdmin: (memberId: string, updates: Partial<AdminMemberRecord>, reason: string, sessionUserName: string, sessionUserRole: string) => void;
  runRegionSeed: (force?: boolean) => Promise<void>;
  batchGenerateKta: (memberIds: string[], reason: string, sessionUserName: string) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  simulatedScope: 'SUPER_ADMIN',
  scopeProvinceId: 'ALL',
  scopeProvinceName: 'Seluruh Indonesia (Nasional)',
  scopeRegencyId: 'ALL',
  scopeRegencyName: 'Seluruh Kabupaten/Kota',

  setSimulatedScope: (scope, provId = 'ALL', provName = 'Seluruh Indonesia (Nasional)', regId = 'ALL', regName = 'Seluruh Kabupaten/Kota') => {
    set({
      simulatedScope: scope,
      scopeProvinceId: scope === 'ADMIN_WILAYAH' ? (provId === 'ALL' ? '32' : provId) : 'ALL',
      scopeProvinceName: scope === 'ADMIN_WILAYAH' ? (provName === 'Seluruh Indonesia (Nasional)' ? 'Jawa Barat' : provName) : 'Seluruh Indonesia (Nasional)',
      scopeRegencyId: scope === 'ADMIN_WILAYAH' ? (regId === 'ALL' ? '3201' : regId) : 'ALL',
      scopeRegencyName: scope === 'ADMIN_WILAYAH' ? (regName === 'Seluruh Kabupaten/Kota' ? 'Kabupaten Bogor' : regName) : 'Seluruh Kabupaten/Kota',
    });
  },

  members: INITIAL_MEMBERS,
  ktaLogs: INITIAL_KTA_LOGS,
  approvals: INITIAL_APPROVALS,
  changeHistory: INITIAL_CHANGE_HISTORY,
  publicLogs: INITIAL_PUBLIC_LOGS,

  regionSeederStatus: {
    isSeeded: true,
    statistics: {
      provinces: 38,
      regencies: 514,
      districts: 7288,
      villages: 83794,
    },
    chunkSize: 500,
    lastChecked: '2026-09-21T08:00:00Z',
  },
  isSeederRunning: false,
  seederProgress: 100,

  selectedMemberId: null,
  setSelectedMemberId: (id) => set({ selectedMemberId: id }),

  addMember: (memberData) => {
    const id = 'MEM-' + String(get().members.length + 1).padStart(3, '0');
    const nowIso = new Date().toISOString();
    const newRecord: AdminMemberRecord = {
      ...memberData,
      id,
      created_at: nowIso,
      updated_at: nowIso,
    };

    set((state) => ({
      members: [newRecord, ...state.members],
      changeHistory: [
        {
          id: 'HIST-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          member_id: id,
          field_name: 'PENDAFTARAN_BARU',
          old_value: '-',
          new_value: memberData.status_anggota,
          actor_id: 'admin',
          actor_role: 'ADMIN',
          reason: 'Pendaftaran anggota baru melalui Admin Portal',
          timestamp: nowIso,
        },
        ...state.changeHistory,
      ],
    }));

    return newRecord;
  },

  reviewMember: (memberId, notes, reviewerName, reviewerRole = 'ADMIN_WILAYAH') => {
    const nowIso = new Date().toISOString();
    set((state) => {
      const updatedMembers = state.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            status_anggota: 'REVIEWED_VERIFIED' as MemberAdminStatus,
            status: 'REVIEWED_VERIFIED',
            updated_at: nowIso,
          };
        }
        return m;
      });

      const newApproval: MemberApprovalEntry = {
        id: 'APP-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        member_id: memberId,
        step_name: 'VERIFIKASI_BERKAS_WILAYAH',
        reviewer_id: reviewerName,
        reviewer_role: reviewerRole,
        decision: 'APPROVED',
        notes: notes || 'Berkas diverifikasi absah oleh Admin Wilayah',
        reviewed_at: nowIso,
      };

      return {
        members: updatedMembers,
        approvals: [newApproval, ...state.approvals],
      };
    });
  },

  reviewMemberWilayah: (memberId, notes, reviewerName) => {
    get().reviewMember(memberId, notes, reviewerName, 'ADMIN_WILAYAH');
  },

  approveMember: (memberId, notes, reviewerName, reviewerRole = 'ADMIN_PUSAT') => {
    const nowIso = new Date().toISOString();
    set((state) => {
      const updatedMembers = state.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            status_anggota: 'ACTIVE' as MemberAdminStatus,
            status: 'ACTIVE',
            tanggal_aktivasi: nowIso.substring(0, 10),
            activated_by: reviewerName,
            activated_at: nowIso,
            updated_at: nowIso,
          };
        }
        return m;
      });

      const newApproval: MemberApprovalEntry = {
        id: 'APP-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        member_id: memberId,
        step_name: 'FINAL_APPROVAL_PUSAT',
        reviewer_id: reviewerName,
        reviewer_role: reviewerRole,
        decision: 'APPROVED',
        notes: notes || 'Persetujuan keanggotaan penuh disetujui Admin Pusat',
        reviewed_at: nowIso,
      };

      return {
        members: updatedMembers,
        approvals: [newApproval, ...state.approvals],
      };
    });
  },

  approveMemberPusat: (memberId, notes, sessionUserName) => {
    get().approveMember(memberId, notes, sessionUserName, 'ADMIN_PUSAT');
  },

  rejectMember: (memberId, notes, reviewerName, reviewerRole = 'ADMIN') => {
    const nowIso = new Date().toISOString();
    set((state) => {
      const updatedMembers = state.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            status_anggota: 'REJECTED' as MemberAdminStatus,
            status: 'REJECTED',
            updated_at: nowIso,
          };
        }
        return m;
      });

      const newApproval: MemberApprovalEntry = {
        id: 'APP-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        member_id: memberId,
        step_name: 'PENOLAKAN_BERKAS',
        reviewer_id: reviewerName,
        reviewer_role: reviewerRole,
        decision: 'REVISION',
        notes: notes || 'Pendaftaran tidak memenuhi kualifikasi persyaratan.',
        reviewed_at: nowIso,
      };

      return {
        members: updatedMembers,
        approvals: [newApproval, ...state.approvals],
      };
    });
  },

  generateKta: (memberId, reason, sessionUserName) => {
    const state = get();
    const member = state.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Anggota tidak ditemukan');
    if (member.status_anggota !== 'ACTIVE') {
      throw new Error('Generate KTA hanya diizinkan untuk anggota dengan status ACTIVE!');
    }
    if (member.kta_status === 'ACTIVE' && member.nomor_kta) {
      throw new Error('KTA sudah aktif. Gunakan menu Regenerate/Peremajaan jika ingin menerbitkan ulang.');
    }

    const nowIso = new Date().toISOString();
    const nextSeq = state.members.filter((m) => m.nomor_kta).length + 1;

    const nomorKta = ktaService.generateKtaNumber({
      level: member.level_organisasi,
      kodeKabupaten: member.kabupaten_id || '3201',
      kodeKecamatan: member.wilayah_kecamatan_id || '010',
      sequence: nextSeq,
    });

    const qrToken = ktaService.generateMemberQrToken(24);
    const qrUrl = ktaService.generateMemberQrUrl(qrToken);

    const logEntry: KtaGenerationLogEntry = {
      id: 'KLOG-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      member_id: member.id,
      nomor_kta: nomorKta,
      qr_token: qrToken,
      action_type: 'INITIAL_ISSUE',
      reason: reason || 'Penerbitan KTA Digital dan QR Identity',
      generated_by: sessionUserName,
      generated_at: nowIso,
    };

    const historyEntry: MemberChangeHistoryEntry = {
      id: 'HIST-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      member_id: member.id,
      field_name: 'kta_status',
      old_value: member.kta_status || 'NOT_CREATED',
      new_value: 'ACTIVE',
      actor_id: sessionUserName,
      actor_role: 'ADMIN',
      reason: reason || 'Generate KTA & QR Identity',
      timestamp: nowIso,
    };

    set((curr) => ({
      members: curr.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            nomor_kta: nomorKta,
            kta_status: 'ACTIVE',
            qr_token: qrToken,
            qr_url: qrUrl,
            qr_status: 'ACTIVE',
            qr_scan_count: 0,
            updated_at: nowIso,
          };
        }
        return m;
      }),
      ktaLogs: [logEntry, ...curr.ktaLogs],
      changeHistory: [historyEntry, ...curr.changeHistory],
    }));

    return { nomorKta, qrToken };
  },

  revokeKta: (memberId, reason, sessionUserName) => {
    const state = get();
    const member = state.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Anggota tidak ditemukan');
    if (!reason || reason.trim().length < 5) {
      throw new Error('Alasan pencabutan KTA wajib diisi minimal 5 karakter!');
    }

    const nowIso = new Date().toISOString();

    const historyEntry: MemberChangeHistoryEntry = {
      id: 'HIST-REV-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      member_id: member.id,
      field_name: 'kta_status (REVOKE)',
      old_value: member.kta_status,
      new_value: 'REVOKED',
      actor_id: sessionUserName,
      actor_role: 'ADMIN',
      reason: reason,
      timestamp: nowIso,
    };

    set((curr) => ({
      members: curr.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            kta_status: 'REVOKED',
            qr_status: 'REVOKED',
            updated_at: nowIso,
          };
        }
        return m;
      }),
      changeHistory: [historyEntry, ...curr.changeHistory],
    }));
  },

  activateMember: (memberId, notes, sessionUserName) => {
    // Approve member Pusat if not active
    get().approveMember(memberId, notes, sessionUserName, 'ADMIN_PUSAT');
    // Generate KTA
    return get().generateKta(memberId, notes, sessionUserName);
  },

  regenerateKta: (memberId, reason, sessionUserName) => {
    const state = get();
    const member = state.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member tidak ditemukan');
    if (!reason || reason.trim().length < 5) {
      throw new Error('Alasan peremajaan KTA wajib diisi minimal 5 karakter!');
    }

    const nowIso = new Date().toISOString();
    const oldKta = member.nomor_kta;

    // Pertahankan sequence atau buat nomor baru
    const seq = member.nomor_kta
      ? parseInt(member.nomor_kta.split('.').pop() || '1', 10)
      : state.members.filter((m) => m.nomor_kta).length + 1;

    const nomorKta = ktaService.generateKtaNumber({
      level: member.level_organisasi,
      kodeKabupaten: member.kabupaten_id || '3201',
      kodeKecamatan: member.wilayah_kecamatan_id || '010',
      sequence: seq,
    });

    const qrToken = ktaService.generateMemberQrToken(24);
    const qrUrl = ktaService.generateMemberQrUrl(qrToken);

    const logEntry: KtaGenerationLogEntry = {
      id: 'KLOG-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      member_id: member.id,
      nomor_kta: nomorKta,
      qr_token: qrToken,
      action_type: 'REGENERATE',
      reason: reason,
      generated_by: sessionUserName,
      generated_at: nowIso,
    };

    const historyEntry: MemberChangeHistoryEntry = {
      id: 'HIST-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      member_id: member.id,
      field_name: 'nomor_kta (REGENERATE)',
      old_value: oldKta,
      new_value: nomorKta,
      actor_id: sessionUserName,
      actor_role: 'ADMIN',
      reason: reason,
      timestamp: nowIso,
    };

    set((curr) => ({
      members: curr.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            nomor_kta: nomorKta,
            qr_token: qrToken,
            qr_url: qrUrl,
            qr_scan_count: 0,
            updated_at: nowIso,
          };
        }
        return m;
      }),
      ktaLogs: [logEntry, ...curr.ktaLogs],
      changeHistory: [historyEntry, ...curr.changeHistory],
    }));

    return { nomorKta, qrToken };
  },

  updateMemberPhoto: (memberId, newPhotoUrl, reason, sessionUserName, sessionUserRole) => {
    const state = get();
    const member = state.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member tidak ditemukan');
    if (!reason || reason.trim().length < 3) {
      throw new Error('Alasan perubahan foto wajib diisi minimal 3 karakter!');
    }

    const nowIso = new Date().toISOString();
    const oldPhotoUrl = member.foto_url;

    const historyEntry: MemberChangeHistoryEntry = {
      id: 'HIST-PHOTO-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      member_id: memberId,
      field_name: 'foto_url',
      old_value: oldPhotoUrl || '',
      new_value: newPhotoUrl,
      actor_id: sessionUserName,
      actor_role: sessionUserRole,
      reason: reason,
      timestamp: nowIso,
    };

    // Keep persistent photo history log
    try {
      const key = `SPWN_PHOTO_HISTORY_${memberId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift({
        id: historyEntry.id,
        memberId,
        previousPhotoUrl: oldPhotoUrl || '',
        newPhotoUrl,
        changedBy: sessionUserName,
        changedAt: nowIso,
        reason,
      });
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed writing photo history to local storage', e);
    }

    set((curr) => ({
      members: curr.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            foto_url: newPhotoUrl,
            updated_at: nowIso,
          };
        }
        return m;
      }),
      changeHistory: [historyEntry, ...curr.changeHistory],
    }));
  },

  updateMemberAdmin: (memberId, updates, reason, sessionUserName, sessionUserRole) => {
    const state = get();
    const member = state.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member tidak ditemukan');
    if (!reason || reason.trim().length < 3) {
      throw new Error('Alasan perubahan data administrasi wajib diisi!');
    }

    const nowIso = new Date().toISOString();
    const changeRecords: MemberChangeHistoryEntry[] = [];

    (Object.keys(updates) as (keyof AdminMemberRecord)[]).forEach((field) => {
      const oldVal = String(member[field] || '');
      const newVal = String(updates[field] || '');
      if (oldVal !== newVal) {
        changeRecords.push({
          id: 'HIST-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          member_id: memberId,
          field_name: field,
          old_value: oldVal,
          new_value: newVal,
          actor_id: sessionUserName,
          actor_role: sessionUserRole,
          reason: reason,
          timestamp: nowIso,
        });
      }
    });

    if (updates.foto_url && updates.foto_url !== member.foto_url) {
      try {
        const key = `SPWN_PHOTO_HISTORY_${memberId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift({
          id: 'HIST-PHOTO-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          memberId,
          previousPhotoUrl: member.foto_url,
          newPhotoUrl: updates.foto_url,
          changedBy: sessionUserName,
          changedAt: nowIso,
          reason,
        });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (e) {
        console.warn('Failed writing photo history to local storage', e);
      }
    }

    set((curr) => ({
      members: curr.members.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            ...updates,
            updated_at: nowIso,
          };
        }
        return m;
      }),
      changeHistory: [...changeRecords, ...curr.changeHistory],
    }));
  },

  runRegionSeed: async (force = false) => {
    set({ isSeederRunning: true, seederProgress: 10 });
    // Simulasi chunked sync progress
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ seederProgress: 45 });
    await new Promise((resolve) => setTimeout(resolve, 700));
    set({ seederProgress: 80 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({
      isSeederRunning: false,
      seederProgress: 100,
      regionSeederStatus: {
        isSeeded: true,
        statistics: {
          provinces: 38,
          regencies: 514,
          districts: 7288,
          villages: 83794,
        },
        chunkSize: 500,
        lastChecked: new Date().toISOString(),
      },
    });
  },

  batchGenerateKta: (memberIds, reason, sessionUserName) => {
    memberIds.forEach((id) => {
      try {
        get().activateMember(id, reason, sessionUserName);
      } catch (e) {
        // Continue next
      }
    });
  },
}));
