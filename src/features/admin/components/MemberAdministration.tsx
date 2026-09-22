/**
 * SPWN Apps 2.0 - Member Administration Module (Module 2)
 * Location: src/features/admin/components/MemberAdministration.tsx
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  CreditCard,
  Plus,
  Edit3,
  Eye,
  FileText,
  AlertTriangle,
  MapPin,
  Building,
  History,
  Check,
  X,
  Sparkles,
  QrCode,
  Upload,
} from 'lucide-react';
import { useAdminStore } from '../stores/adminStore';
import { AdminMemberRecord, MemberAdminStatus } from '../types/admin.types';
import { KRIDA_MASTER, MASTER_TINGKATAN_SAKA } from '../../../config/constants';
import { PROVINCES, getRegenciesByProvince, getDistrictsByRegency, resolveDistrictName } from '../../../data/wilayahData';
import { OrganizationLevelType } from '../../../types/membership';

export const MemberAdministration: React.FC = () => {
  const {
    members,
    simulatedScope,
    scopeProvinceId,
    scopeRegencyId,
    reviewMember,
    approveMember,
    rejectMember,
    activateMember,
    updateMemberAdmin,
    addMember,
    changeHistory,
    approvals,
    ktaLogs,
  } = useAdminStore();

  const [subTab, setSubTab] = useState<'directory' | 'approval' | 'create'>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterKrida, setFilterKrida] = useState<string>('ALL');
  const [filterProvince, setFilterProvince] = useState<string>('ALL');

  // Member detail & correction modal
  const [inspectMember, setInspectMember] = useState<AdminMemberRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<AdminMemberRecord>>({});
  const [auditReason, setAuditReason] = useState('');
  const [auditError, setAuditError] = useState('');

  // Approval review modal
  const [reviewingMember, setReviewingMember] = useState<AdminMemberRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Create member state
  const [createLevel, setCreateLevel] = useState<OrganizationLevelType>('WILAYAH');
  const [createFullName, setCreateFullName] = useState('');
  const [createProvCode, setCreateProvCode] = useState('32');
  const [createKabCode, setCreateKabCode] = useState('3201');
  const [createKecCode, setCreateKecCode] = useState('010');
  const [createPangkalan, setCreatePangkalan] = useState('');
  const [createKridaId, setCreateKridaId] = useState('KRIDA_PEMANDU');
  const [createTingkat, setCreateTingkat] = useState('Anggota');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createStatus, setCreateStatus] = useState<MemberAdminStatus>('PENDING');
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');

  // Dropdown list Kecamatan dinamis berdasarkan Kabupaten/Kota
  const availableDistricts = useMemo(() => {
    return getDistrictsByRegency(createKabCode);
  }, [createKabCode]);

  // Filter members based on scope & user filters
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 1. Enforce regional scope
      if (simulatedScope === 'ADMIN_WILAYAH') {
        if (scopeProvinceId !== 'ALL' && m.provinsi_id !== scopeProvinceId) return false;
        if (scopeRegencyId !== 'ALL' && m.kabupaten_id !== scopeRegencyId) return false;
      } else if (filterProvince !== 'ALL' && m.provinsi_id !== filterProvince) {
        return false;
      }

      // 2. Status filter
      if (filterStatus !== 'ALL' && m.status_anggota !== filterStatus) {
        return false;
      }

      // 3. Krida filter
      if (filterKrida !== 'ALL' && m.krida_id !== filterKrida) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.nama_lengkap.toLowerCase().includes(q);
        const matchKta = m.nomor_kta.toLowerCase().includes(q);
        const matchId = m.id.toLowerCase().includes(q);
        const matchCity = m.kabupaten_nama.toLowerCase().includes(q);
        if (!matchName && !matchKta && !matchId && !matchCity) return false;
      }

      return true;
    });
  }, [members, simulatedScope, scopeProvinceId, scopeRegencyId, filterProvince, filterStatus, filterKrida, searchQuery]);

  // Approval queue members (PENDING / REVIEWED_VERIFIED)
  const approvalQueue = useMemo(() => {
    return filteredMembers.filter(
      (m) =>
        m.status_anggota === 'PENDING' ||
        m.status_anggota === 'REVIEWED_VERIFIED'
    );
  }, [filteredMembers]);

  // Handle Edit Save with Audit Trail
  const handleSaveCorrection = () => {
    if (!inspectMember) return;
    if (!auditReason.trim() || auditReason.trim().length < 5) {
      setAuditError('Alasan perubahan data administrasi wajib diisi minimal 5 karakter untuk audit trail!');
      return;
    }

    if (editFormData.krida_id) {
      const krida = KRIDA_MASTER.find((k) => k.id === editFormData.krida_id);
      if (krida) editFormData.krida_nama = krida.name;
    }

    try {
      updateMemberAdmin(
        inspectMember.id,
        editFormData,
        auditReason,
        simulatedScope === 'SUPER_ADMIN' ? 'Super Administrator' : 'Admin SAKA',
        simulatedScope
      );
      // Refresh current inspected member
      const updated = { ...inspectMember, ...editFormData };
      setInspectMember(updated as AdminMemberRecord);
      setIsEditing(false);
      setAuditReason('');
      setAuditError('');
    } catch (e: any) {
      setAuditError(e.message || 'Gagal menyimpan perubahan');
    }
  };

  // Handle New Member Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFullName.trim()) {
      alert('Nama lengkap wajib diisi');
      return;
    }

    const provObj = PROVINCES.find((p) => p.code === createProvCode);
    const regList = getRegenciesByProvince(createProvCode);
    const regObj = regList.find((r) => r.code === createKabCode);
    const distList = getDistrictsByRegency(createKabCode);
    const distObj = distList.find((d) => d.districtCode3 === createKecCode);
    const kridaObj = KRIDA_MASTER.find((k) => k.id === createKridaId);

    const isNasional = createLevel === 'KWARTIR_NASIONAL';
    const newRec = addMember({
      nomor_kta: '',
      nama_lengkap: createFullName.trim(),
      tempat_lahir: 'Indonesia',
      tanggal_lahir: '2004-01-01',
      jenis_kelamin: 'L',
      golongan_darah: 'O',
      provinsi_id: isNasional ? '00' : createProvCode,
      provinsi_nama: isNasional ? 'KWARTIR NASIONAL' : (provObj?.name || 'JAWA BARAT'),
      kabupaten_id: isNasional ? '0000' : createKabCode,
      kabupaten_nama: isNasional ? 'PUSAT (KWARNAS)' : (regObj?.name || 'KABUPATEN BOGOR'),
      wilayah_kecamatan_id: isNasional ? '000' : createKecCode,
      wilayah_kecamatan_nama: isNasional ? 'PUSAT' : (distObj?.name || 'KECAMATAN'),
      pangkalan_gudep: createPangkalan.trim() || (isNasional ? 'Kwarnas Gerakan Pramuka Pusat' : 'Pangkalan Saka Pariwisata'),
      kwartir_cabang: isNasional ? 'Kwartir Nasional' : (regObj?.name || 'KABUPATEN BOGOR'),
      kwartir_ranting: isNasional ? 'Kwarnas' : (distObj?.name || 'KECAMATAN'),
      krida_id: createKridaId,
      krida_nama: kridaObj?.name || 'KRIDA PEMANDU',
      tingkat_keanggotaan: createTingkat,
      status_anggota: createStatus,
      kta_status: 'NOT_CREATED',
      status: createStatus,
      email: createEmail || `${createFullName.toLowerCase().replace(/\s+/g, '')}@spwn.id`,
      nomor_telepon: createPhone || '08123456789',
      level_organisasi: createLevel,
      tanggal_bergabung: new Date().toISOString().substring(0, 10),
    });

    setCreateSuccessMsg(`Anggota ${newRec.nama_lengkap} berhasil didaftarkan dengan ID: ${newRec.id}`);
    setCreateFullName('');
    setCreatePangkalan('');
    setCreateEmail('');
    setCreatePhone('');
  };

  return (
    <div className="space-y-6">
      {/* Sub Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('directory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Direktori Anggota ({filteredMembers.length})
          </button>

          <button
            type="button"
            onClick={() => setSubTab('approval')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'approval'
                ? 'bg-[#0066B3] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Antrean Approval 4-Tahap
            {approvalQueue.length > 0 && (
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
                {approvalQueue.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'create'
                ? 'bg-[#009B4D] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Registrasi Baru
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Multi-level RBAC & Hierarchical Region Scoping Active
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: DIREKTORI ANGGOTA                                  */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, ID anggota, No KTA, kota..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0066B3] focus:bg-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066B3]"
              >
                <option value="ALL">Semua Status Anggota</option>
                <option value="PENDING">PENDING (Pendaftaran Baru)</option>
                <option value="REVIEWED_VERIFIED">REVIEWED_VERIFIED (Verifikasi Wilayah)</option>
                <option value="ACTIVE">ACTIVE (KTA Resmi Aktif)</option>
                <option value="INACTIVE">INACTIVE (Non-aktif)</option>
                <option value="REJECTED">REJECTED (Ditolak / Revisi)</option>
              </select>
            </div>

            {/* Krida Filter */}
            <div>
              <select
                value={filterKrida}
                onChange={(e) => setFilterKrida(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066B3]"
              >
                <option value="ALL">Semua 4 Krida</option>
                {KRIDA_MASTER.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.code} - {k.name.substring(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Provinsi Filter (if not Wilayah scope) */}
            <div>
              <select
                disabled={simulatedScope === 'ADMIN_WILAYAH'}
                value={simulatedScope === 'ADMIN_WILAYAH' ? scopeProvinceId : filterProvince}
                onChange={(e) => setFilterProvince(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066B3] disabled:opacity-60"
              >
                <option value="ALL">Semua Provinsi</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Identitas Anggota</th>
                    <th className="py-3 px-4">Wilayah & Kwarda</th>
                    <th className="py-3 px-4">Krida & Tingkatan</th>
                    <th className="py-3 px-4">Status 4-Tahap</th>
                    <th className="py-3 px-4 text-right">Aksi Administrasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Tidak ada data anggota sesuai filter atau scope wilayah.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const kridaInfo = KRIDA_MASTER.find((k) => k.id === m.krida_id);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Nama & KTA */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                {m.foto_url ? (
                                  <img
                                    src={m.foto_url}
                                    alt={m.nama_lengkap}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-[10px]">
                                    {m.nama_lengkap.substring(0, 2).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate">{m.nama_lengkap}</p>
                                <p className="text-[11px] text-slate-500 font-mono">
                                  {m.nomor_kta ? (
                                    <span className="text-emerald-700 font-semibold">{m.nomor_kta}</span>
                                  ) : (
                                    <span className="text-slate-400 italic">Belum terbit</span>
                                  )}
                                  {' • ID: '}{m.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Wilayah & Pangkalan */}
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800">
                              {m.kabupaten_nama}
                              {m.wilayah_kecamatan_nama || m.kwartir_ranting ? ` • Kec. ${m.wilayah_kecamatan_nama || m.kwartir_ranting}` : ''}
                            </p>
                            <p className="text-[11px] text-slate-500">{m.provinsi_nama}</p>
                            {m.pangkalan_gudep && (
                              <p className="text-[10px] text-[#0066B3] font-medium truncate max-w-[210px] mt-0.5">
                                {m.pangkalan_gudep}
                              </p>
                            )}
                          </td>

                          {/* Krida & Tingkat */}
                          <td className="py-3.5 px-4">
                            <span
                              className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold text-white mb-1"
                              style={{ backgroundColor: kridaInfo?.color || '#0066B3' }}
                            >
                              {kridaInfo?.code || 'SPWN'}
                            </span>
                            <p className="text-slate-700 font-medium">{m.tingkat_keanggotaan}</p>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                m.status_anggota === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : m.status_anggota === 'REVIEWED_VERIFIED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : m.status_anggota === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : m.status_anggota === 'REJECTED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {m.status_anggota === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                              {m.status_anggota === 'REVIEWED_VERIFIED' && <Award className="w-3 h-3" />}
                              {m.status_anggota === 'PENDING' && <Clock className="w-3 h-3" />}
                              {m.status_anggota === 'REJECTED' && <X className="w-3 h-3" />}
                              {m.status_anggota}
                            </span>
                          </td>

                          {/* Aksi */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setInspectMember(m);
                                setEditFormData(m);
                                setIsEditing(false);
                                setAuditError('');
                                setAuditReason('');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Detail & Koreksi
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: ANTREAN APPROVAL 4-TAHAP                           */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'approval' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#0066B3] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Siklus Verifikasi & Aktivasi 4-Tahap SPWN Apps 2.0</p>
              <p className="text-blue-700 mt-0.5 leading-relaxed">
                <strong>1. DRAFT</strong> (Kelengkapan berkas) &rarr; 
                <strong> 2. VERIFICATION</strong> (Verifikasi faktual admin wilayah) &rarr; 
                <strong> 3. APPROVED</strong> (Persetujuan Kwartir) &rarr; 
                <strong> 4. ACTIVE</strong> (Penerbitan otomatis Nomor KTA + QR Token + Akun Login).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvalQueue.length === 0 ? (
              <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                Antrean approval kosong. Seluruh berkas anggota telah diproses tuntas.
              </div>
            ) : (
              approvalQueue.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status_anggota === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status_anggota === 'REVIEWED_VERIFIED'
                            ? 'bg-blue-100 text-blue-800'
                            : m.status_anggota === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        Tahap: {m.status_anggota}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{m.nama_lengkap}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        ID: {m.id} • {m.kabupaten_nama}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium">Tgl Daftar</span>
                      <p className="text-xs font-semibold text-slate-700">{m.tanggal_bergabung}</p>
                    </div>
                  </div>

                  {/* 3-Step Progress Indicator */}
                  <div className="grid grid-cols-3 gap-1.5 py-1">
                    <div className="h-1.5 rounded-full bg-emerald-500" title="1. Pendaftaran Berkas" />
                    <div
                      className={`h-1.5 rounded-full ${
                        m.status_anggota === 'REVIEWED_VERIFIED' || m.status_anggota === 'ACTIVE'
                          ? 'bg-blue-500'
                          : 'bg-slate-200'
                      }`}
                      title="2. Review & Verifikasi Wilayah"
                    />
                    <div
                      className={`h-1.5 rounded-full ${
                        m.status_anggota === 'ACTIVE' ? 'bg-[#009B4D]' : 'bg-slate-200'
                      }`}
                      title="3. Final Approval Pusat & KTA Terbit"
                    />
                  </div>

                  {/* Actions based on RBAC Final */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    {/* Tahap 1: PENDING - Admin Wilayah / Pusat / Super Admin */}
                    {m.status_anggota === 'PENDING' && (
                      <div className="w-full flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const notes = prompt('Masukkan catatan revisi / tolak berkas:');
                            if (notes) rejectMember(m.id, notes, 'Admin', simulatedScope);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold transition-all"
                        >
                          Tolak / Revisi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            reviewMember(m.id, 'Berkas diverifikasi absah oleh Admin Wilayah', 'Admin Wilayah', simulatedScope);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Review & Verifikasi Berkas (Wilayah)
                        </button>
                      </div>
                    )}

                    {/* Tahap 2: REVIEWED_VERIFIED - Menunggu Final Approval Admin Pusat */}
                    {m.status_anggota === 'REVIEWED_VERIFIED' && (
                      <div className="w-full flex items-center justify-between gap-2">
                        <span className="text-[11px] text-sky-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                          Berkas Lolos Verifikasi Wilayah
                        </span>

                        {simulatedScope === 'ADMIN_WILAYAH' ? (
                          <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                            Menunggu Final Approval Pusat
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const notes = prompt('Masukkan catatan penolakan approval:');
                                if (notes) rejectMember(m.id, notes, 'Admin Pusat', simulatedScope);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                            >
                              Tolak
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                approveMember(m.id, 'Disetujui Admin Pusat', 'Admin Pusat', simulatedScope);
                                const res = activateMember(m.id, 'Penerbitan KTA & QR Identity', 'Admin Pusat');
                                alert(`Anggota Disetujui & KTA Berhasil Diterbitkan!\nNomor KTA: ${res.nomorKta}\nQR Token: ${res.qrToken}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              Final Approval & Terbitkan KTA
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 3: REGISTRASI BARU MANUAL & KOLEKTIF                  */}
      {/* ------------------------------------------------------------- */}
      {subTab === 'create' && (
        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Formulir Registrasi Anggota SPWN Apps 2.0</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pendaftaran resmi dengan scoping wilayah BPS & peminatan 4 Krida SAKA Pariwisata
            </p>
          </div>

          {createSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#009B4D] shrink-0" />
              <span>{createSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            {/* Level Organisasi */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-4">
              <span className="font-bold text-slate-700">Tingkat Organisasi:</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="createLevel"
                  checked={createLevel === 'WILAYAH'}
                  onChange={() => setCreateLevel('WILAYAH')}
                  className="text-[#0066B3]"
                />
                Kwarda / Kwarcab / Wilayah (Format 00.PPKK.CCC.NNNNNN)
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="createLevel"
                  checked={createLevel === 'KWARTIR_NASIONAL'}
                  onChange={() => setCreateLevel('KWARTIR_NASIONAL')}
                  className="text-[#0066B3]"
                />
                Kwartir Nasional (Format 00.NNNNNN)
              </label>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Lengkap (Sesuai Identitas Resmi) *</label>
              <input
                type="text"
                required
                value={createFullName}
                onChange={(e) => setCreateFullName(e.target.value)}
                placeholder="Contoh: Raden Surya Pratama"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Provinsi</label>
                <select
                  value={createProvCode}
                  onChange={(e) => {
                    const newProv = e.target.value;
                    setCreateProvCode(newProv);
                    const list = getRegenciesByProvince(newProv);
                    if (list.length > 0) {
                      setCreateKabCode(list[0].code);
                      const dists = getDistrictsByRegency(list[0].code);
                      if (dists.length > 0) {
                        setCreateKecCode(dists[0].districtCode3);
                      }
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                >
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kabupaten/Kota</label>
                <select
                  value={createKabCode}
                  onChange={(e) => {
                    const newKab = e.target.value;
                    setCreateKabCode(newKab);
                    const dists = getDistrictsByRegency(newKab);
                    if (dists.length > 0) {
                      setCreateKecCode(dists[0].districtCode3);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                >
                  {getRegenciesByProvince(createProvCode).map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kecamatan</label>
                <select
                  value={createKecCode}
                  onChange={(e) => setCreateKecCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                >
                  {availableDistricts.map((d) => (
                    <option key={d.code} value={d.districtCode3}>
                      {d.name.startsWith('Kecamatan ') || d.name.startsWith('KECAMATAN ') ? d.name : `Kecamatan ${d.name}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pangkalan Gugusdepan Asal */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Pangkalan Gugusdepan Asal
                <span className="text-slate-400 font-normal text-xs ml-1.5">(Basis pangkalan sekolah / perguruan tinggi / gudep)</span>
              </label>
              <input
                type="text"
                value={createPangkalan}
                onChange={(e) => setCreatePangkalan(e.target.value)}
                placeholder="Contoh: Gudep 01.001 - 01.002 Pangkalan SMAN 1 Cibinong"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#0066B3] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Peminatan 4 Krida SAKA</label>
                <select
                  value={createKridaId}
                  onChange={(e) => setCreateKridaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                >
                  {KRIDA_MASTER.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Peran / Tingkat Keanggotaan Saka</label>
                <select
                  value={createTingkat}
                  onChange={(e) => setCreateTingkat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                >
                  {MASTER_TINGKATAN_SAKA.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Aktif</label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="pramuka@spwn.id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#0066B3]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tahap Awal Pendaftaran</label>
                <select
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value as MemberAdminStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold text-[#0066B3] focus:ring-2 focus:ring-[#0066B3]"
                >
                  <option value="VERIFICATION">VERIFICATION (Langsung Antrean)</option>
                  <option value="DRAFT">DRAFT (Pendaftaran Awal)</option>
                  <option value="APPROVED">APPROVED (Siap Aktivasi KTA)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0066B3] hover:bg-[#004C85] text-white font-bold shadow-xs transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Simpan & Daftarkan Anggota
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: DETAIL & KOREKSI ADMINISTRASI ANGGOTA (WITH AUDIT LOG) */}
      {/* ------------------------------------------------------------- */}
      {inspectMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Data Administrasi Anggota ({inspectMember.id})
                </span>
                <h3 className="text-base font-bold text-slate-900">{inspectMember.nama_lengkap}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectMember(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner if any */}
            {auditError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{auditError}</span>
              </div>
            )}

            {/* Field View or Edit Mode */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Status 4-Tahap:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {inspectMember.status_anggota}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1 rounded-lg bg-white border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? 'Batal Koreksi' : 'Koreksi Data'}
                </button>
              </div>

              {/* Photo & Dynamic QR Identity Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <img
                  src={editFormData.foto_url || inspectMember.foto_url}
                  alt={inspectMember.nama_lengkap}
                  className="w-20 h-24 object-cover rounded-xl border border-slate-300 shadow-2xs shrink-0"
                />
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-slate-800">Pasfoto Resmi Anggota</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      photo_url: single source of truth
                    </span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={editFormData.foto_url || inspectMember.foto_url}
                        onChange={(e) => setEditFormData({ ...editFormData, foto_url: e.target.value })}
                        placeholder="https://... URL Foto Baru"
                        className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 cursor-pointer">
                        <Upload className="w-3 h-3 text-slate-500" />
                        Unggah File Foto
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setEditFormData((prev) => ({ ...prev, foto_url: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 leading-relaxed truncate">
                      {inspectMember.foto_url || 'Belum diunggah'}
                    </p>
                  )}

                  {/* Dynamic QR Metadata */}
                  {inspectMember.qr_token && (
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-600 flex-wrap gap-2">
                      <span className="flex items-center gap-1 font-bold text-[#009B4D]">
                        <QrCode className="w-3 h-3" />
                        {inspectMember.qr_token}
                      </span>
                      <span>Total Scan: {inspectMember.qr_scan_count || 0}x</span>
                      {inspectMember.qr_last_verified_at && (
                        <span>Verifikasi Terakhir: {new Date(inspectMember.qr_last_verified_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Nomor KTA Resmi</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.nomor_kta || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, nomor_kta: e.target.value })}
                      className="w-full bg-amber-50/50 border border-amber-300 rounded-lg px-3 py-2 font-mono font-bold"
                    />
                  ) : (
                    <p className="font-mono font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {inspectMember.nomor_kta || 'Belum terbit'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-500 block mb-1">ID Anggota (Sistem)</label>
                  <p className="font-mono font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {inspectMember.id}
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Nama Lengkap</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editFormData.nama_lengkap || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, nama_lengkap: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {inspectMember.nama_lengkap}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Peran / Tingkat Saka</label>
                  {isEditing ? (
                    <select
                      value={editFormData.tingkat_keanggotaan || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, tingkat_keanggotaan: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                    >
                      {MASTER_TINGKATAN_SAKA.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {inspectMember.tingkat_keanggotaan}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-500 block mb-1">Peminatan 4 Krida SAKA</label>
                  {isEditing ? (
                    <select
                      value={editFormData.krida_id || inspectMember.krida_id}
                      onChange={(e) => setEditFormData({ ...editFormData, krida_id: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-medium"
                    >
                      {KRIDA_MASTER.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900">
                        {KRIDA_MASTER.find((k) => k.id === inspectMember.krida_id)?.name || inspectMember.krida_nama || inspectMember.krida_id}
                      </span>
                    </div>
                  )}
                </div>

                {/* Wilayah Kwartir & Pangkalan Section */}
                <div className="sm:col-span-2 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-[#0066B3]" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Wilayah Kwartir & Pangkalan Gugusdepan
                    </h4>
                  </div>

                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Provinsi (Kwarda)
                        </label>
                        <select
                          value={editFormData.provinsi_id || inspectMember.provinsi_id || '32'}
                          onChange={(e) => {
                            const newProv = e.target.value;
                            const provItem = PROVINCES.find((p) => p.code === newProv);
                            const regs = getRegenciesByProvince(newProv);
                            const firstReg = regs[0];
                            const dists = firstReg ? getDistrictsByRegency(firstReg.code) : [];
                            const firstDist = dists[0];
                            setEditFormData({
                              ...editFormData,
                              provinsi_id: newProv,
                              provinsi_nama: provItem ? provItem.name : '',
                              kabupaten_id: firstReg ? firstReg.code : '',
                              kabupaten_nama: firstReg ? firstReg.name : '',
                              kwartir_cabang: firstReg ? firstReg.name : '',
                              wilayah_kecamatan_id: firstDist ? firstDist.districtCode3 : '010',
                              wilayah_kecamatan_nama: firstDist ? firstDist.name : '',
                              kwartir_ranting: firstDist ? firstDist.name : '',
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                        >
                          {PROVINCES.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.code} - {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Kabupaten/Kota (Kwarcab)
                        </label>
                        <select
                          value={editFormData.kabupaten_id || inspectMember.kabupaten_id || '3201'}
                          onChange={(e) => {
                            const newKab = e.target.value;
                            const currentProv = editFormData.provinsi_id || inspectMember.provinsi_id || '32';
                            const regs = getRegenciesByProvince(currentProv);
                            const regItem = regs.find((r) => r.code === newKab);
                            const dists = getDistrictsByRegency(newKab);
                            const firstDist = dists[0];
                            setEditFormData({
                              ...editFormData,
                              kabupaten_id: newKab,
                              kabupaten_nama: regItem ? regItem.name : '',
                              kwartir_cabang: regItem ? regItem.name : '',
                              wilayah_kecamatan_id: firstDist ? firstDist.districtCode3 : '010',
                              wilayah_kecamatan_nama: firstDist ? firstDist.name : '',
                              kwartir_ranting: firstDist ? firstDist.name : '',
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                        >
                          {getRegenciesByProvince(editFormData.provinsi_id || inspectMember.provinsi_id || '32').map((r) => (
                            <option key={r.code} value={r.code}>
                              {r.code} - {r.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Kecamatan (Kwarran)
                        </label>
                        <select
                          value={editFormData.wilayah_kecamatan_id || inspectMember.wilayah_kecamatan_id || '010'}
                          onChange={(e) => {
                            const newDist = e.target.value;
                            const currentKab = editFormData.kabupaten_id || inspectMember.kabupaten_id || '3201';
                            const dists = getDistrictsByRegency(currentKab);
                            const distItem = dists.find((d) => d.districtCode3 === newDist);
                            setEditFormData({
                              ...editFormData,
                              wilayah_kecamatan_id: newDist,
                              wilayah_kecamatan_nama: distItem ? distItem.name : '',
                              kwartir_ranting: distItem ? distItem.name : '',
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                        >
                          {getDistrictsByRegency(editFormData.kabupaten_id || inspectMember.kabupaten_id || '3201').map((d) => (
                            <option key={d.code} value={d.districtCode3}>
                              {d.districtCode3} - {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">
                          Pangkalan Gugusdepan Asal
                        </label>
                        <input
                          type="text"
                          value={editFormData.pangkalan_gudep ?? inspectMember.pangkalan_gudep ?? ''}
                          onChange={(e) => setEditFormData({ ...editFormData, pangkalan_gudep: e.target.value })}
                          placeholder="Contoh: Gudep 01.001 - 01.002 Pangkalan SMAN 1 Cibinong"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                          Kwartir Daerah (Provinsi)
                        </span>
                        <p className="font-semibold text-slate-900 text-xs">
                          {inspectMember.provinsi_id ? `${inspectMember.provinsi_id} - ` : ''}
                          {inspectMember.provinsi_nama || 'Kwartir Nasional'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                          Kwartir Cabang (Kabupaten/Kota)
                        </span>
                        <p className="font-semibold text-slate-900 text-xs">
                          {inspectMember.kabupaten_id ? `${inspectMember.kabupaten_id} - ` : ''}
                          {inspectMember.kabupaten_nama || inspectMember.kwartir_cabang || '-'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                          Kwartir Ranting (Kecamatan)
                        </span>
                        <p className="font-semibold text-slate-900 text-xs">
                          {inspectMember.wilayah_kecamatan_id ? `${inspectMember.wilayah_kecamatan_id} - ` : ''}
                          {inspectMember.wilayah_kecamatan_nama || inspectMember.kwartir_ranting || '-'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                          Pangkalan Gugusdepan
                        </span>
                        <p className="font-semibold text-[#0066B3] text-xs">
                          {inspectMember.pangkalan_gudep || 'Pangkalan Saka Pariwisata'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit reason input required if editing */}
              {isEditing && (
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 space-y-2">
                  <label className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Alasan Perubahan Data (Wajib Disimpan ke Audit Log):
                  </label>
                  <textarea
                    rows={2}
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    placeholder="Contoh: Koreksi ejaan nama sesuai KTP dan Ijazah pembina..."
                    className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCorrection}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
                    >
                      Simpan Koreksi dengan Audit Trail
                    </button>
                  </div>
                </div>
              )}

              {/* History of this member */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-500" />
                  Riwayat Perubahan & Approval Anggota Ini
                </h4>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {changeHistory.filter((h) => h.member_id === inspectMember.id).length === 0 ? (
                    <p className="text-slate-400 italic">Belum ada riwayat koreksi data.</p>
                  ) : (
                    changeHistory
                      .filter((h) => h.member_id === inspectMember.id)
                      .map((h) => (
                        <div key={h.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-slate-800 font-mono">{h.field_name}</span>
                            <span className="text-slate-400">{h.timestamp.substring(0, 16).replace('T', ' ')}</span>
                          </div>
                          <p className="text-slate-600 mt-0.5">
                            <span className="line-through text-red-500 mr-1">{h.old_value}</span> &rarr;{' '}
                            <span className="text-emerald-700 font-bold">{h.new_value}</span>
                          </p>
                          <p className="text-slate-500 italic mt-0.5">Alasan: {h.reason}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
