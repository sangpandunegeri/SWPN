import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CreditCard,
  Plus,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Table,
  Modal,
  Tabs,
} from '../../../components/ui';
import { DigitalKTACard } from '../components/locked/DigitalKTACard';
import { KRIDA_MASTER, PROVINCES_INDONESIA, TINGKAT_GOLONGAN_PRAMUKA } from '../../../config/constants';
import { useUIStore } from '../../../stores/uiStore';
import { MemberRecord, OrganizationLevelType } from '../../../types/membership';
import {
  PROVINCES,
  REGENCIES,
  SAMPLE_DISTRICTS,
  getRegenciesByProvince,
  getDistrictsByRegency,
  getProvinceByCode,
  getRegencyByCode,
} from '../../../data/wilayahData';
import { ktaService } from '../../../services/ktaService';

export const MembershipPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedKrida, setSelectedKrida] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | OrganizationLevelType>('ALL');
  const [selectedMemberForKTA, setSelectedMemberForKTA] = useState<MemberRecord | null>(null);

  // Modal Pendaftaran & Generator KTA Interaktif
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regLevel, setRegLevel] = useState<OrganizationLevelType>('WILAYAH');
  const [regFullName, setRegFullName] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regProvCode, setRegProvCode] = useState('32');
  const [regKabCode, setRegKabCode] = useState('3201'); // Bogor
  const [regKecCode, setRegKecCode] = useState('010'); // Nanggung
  const [regKridaId, setRegKridaId] = useState('KRIDA_PEMANDU');
  const [regLevelKeanggotaan, setRegLevelKeanggotaan] = useState('Penegak');
  const [regSequence, setRegSequence] = useState('1');

  const { addToast } = useUIStore();

  // Database Anggota SPWN (Sesuai Aturan KTA Format Final)
  // 1. Kwartir Nasional: 00.NNNNNN
  // 2. Wilayah: 00.PPKK.CCC.NNNNNN (Tanpa kode provinsi pada nomor KTA, namun kode provinsi, kab, kec tetap tersimpan di database)
  const [members, setMembers] = useState<MemberRecord[]>([
    {
      id: 'MEM-001',
      noKta: '00.000001',
      fullName: 'Kak Prof. Dr. Budi Santoso, M.Si.',
      gender: 'L',
      birthPlace: 'Jakarta',
      birthDate: '1975-08-14',
      levelOrganisasi: 'KWARTIR_NASIONAL',
      kodeProvinsi: '00',
      kodeKabupaten: '0000',
      kodeKecamatan: '000',
      province: 'Kwartir Nasional',
      city: 'Pusat (Kwarnas)',
      kecamatan: 'Pusat',
      address: 'Jl. Medan Merdeka Timur No. 6, Jakarta Pusat',
      kridaId: 'KRIDA_PEMANDU',
      kridaName: 'KRIDA PEMANDU',
      membershipLevel: 'Pembina Utama / Andalan Nasional',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      verificationToken: 'SPWN-QR-NAS-7A8F9C1B',
      joinedDate: '2020-01-15',
      createdAt: '2020-01-15T08:00:00Z',
    },
    {
      id: 'MEM-002',
      noKta: '00.3201.010.000089',
      fullName: 'Fajar Nugraha Wijaya',
      gender: 'L',
      birthPlace: 'Bogor',
      birthDate: '2004-05-12',
      levelOrganisasi: 'WILAYAH',
      kodeProvinsi: '32',
      kodeKabupaten: '3201', // KABUPATEN BOGOR (regencies.csv)
      kodeKecamatan: '010', // NANGGUNG (districts.csv: 3201010)
      province: 'Jawa Barat',
      city: 'Kabupaten Bogor',
      kecamatan: 'Nanggung',
      address: 'Jl. Raya Nanggung No. 45, Nanggung, Kab. Bogor',
      kridaId: 'KRIDA_PENYULUH',
      kridaName: 'KRIDA PENYULUH',
      membershipLevel: 'Penegak Bantara',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      verificationToken: 'SPWN-QR-WIL-3201-99812A',
      joinedDate: '2024-03-15',
      createdAt: '2024-03-15T10:30:00Z',
    },
    {
      id: 'MEM-003',
      noKta: '00.5103.020.000014',
      fullName: 'Dewi Anjani Kusuma',
      gender: 'P',
      birthPlace: 'Denpasar',
      birthDate: '2002-11-20',
      levelOrganisasi: 'WILAYAH',
      kodeProvinsi: '51',
      kodeKabupaten: '5103', // KABUPATEN BADUNG (regencies.csv)
      kodeKecamatan: '020', // KUTA (districts.csv: 5103020)
      province: 'Bali',
      city: 'Kabupaten Badung',
      kecamatan: 'Kuta',
      address: 'Jl. Pantai Kuta No. 18, Kuta, Badung, Bali',
      kridaId: 'KRIDA_MICE_EVENT',
      kridaName: 'KRIDA MICE & EVENT',
      membershipLevel: 'Pandega',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      verificationToken: 'SPWN-QR-WIL-5103-5102BB',
      joinedDate: '2023-08-20',
      createdAt: '2023-08-20T14:20:00Z',
    },
    {
      id: 'MEM-004',
      noKta: '00.3404.050.000112',
      fullName: 'Rian Hidayatullah',
      gender: 'L',
      birthPlace: 'Sleman',
      birthDate: '2005-02-09',
      levelOrganisasi: 'WILAYAH',
      kodeProvinsi: '34',
      kodeKabupaten: '3404', // KABUPATEN SLEMAN (regencies.csv)
      kodeKecamatan: '050', // GAMPING (districts.csv: 3404050)
      province: 'DI Yogyakarta',
      city: 'Kabupaten Sleman',
      kecamatan: 'Gamping',
      address: 'Jl. Ringroad Barat, Gamping, Sleman, Yogyakarta',
      kridaId: 'KRIDA_KULINER_CINDERAMATA',
      kridaName: 'KRIDA KULINER & CINDERAMATA',
      membershipLevel: 'Penegak Laksana',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      status: 'PENDING',
      verificationToken: 'SPWN-QR-WIL-3404-3403CC',
      joinedDate: '2024-06-10',
      createdAt: '2024-06-10T09:15:00Z',
    },
    {
      id: 'MEM-005',
      noKta: '00.3372.010.000007',
      fullName: 'Siti Nurhaliza Putri',
      gender: 'P',
      birthPlace: 'Surakarta',
      birthDate: '1998-04-16',
      levelOrganisasi: 'WILAYAH',
      kodeProvinsi: '33',
      kodeKabupaten: '3372', // KOTA SURAKARTA (regencies.csv)
      kodeKecamatan: '010', // LAWEYAN (districts.csv: 3372010)
      province: 'Jawa Tengah',
      city: 'Kota Surakarta',
      kecamatan: 'Laweyan',
      address: 'Jl. Slamet Riyadi No. 120, Laweyan, Surakarta',
      kridaId: 'KRIDA_PEMANDU',
      kridaName: 'KRIDA PEMANDU',
      membershipLevel: 'Pembina SAKA',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      verificationToken: 'SPWN-QR-WIL-3372-3305DD',
      joinedDate: '2022-11-01',
      createdAt: '2022-11-01T11:45:00Z',
    },
  ]);

  // List opsi Kabupaten berdasarkan Provinsi terpilih di formulir
  const availableRegencies = useMemo(() => {
    return getRegenciesByProvince(regProvCode);
  }, [regProvCode]);

  // List opsi Kecamatan berdasarkan Kabupaten terpilih di formulir
  const availableDistricts = useMemo(() => {
    const d = getDistrictsByRegency(regKabCode);
    return d.length > 0 ? d : SAMPLE_DISTRICTS.filter((item) => item.regencyCode === '3201');
  }, [regKabCode]);

  // Preview Nomor KTA yang dihasilkan secara real-time
  const previewGeneratedKta = useMemo(() => {
    return ktaService.generateKtaNumber({
      level: regLevel,
      kodeKabupaten: regKabCode,
      kodeKecamatan: regKecCode,
      sequence: regSequence || 1,
    });
  }, [regLevel, regKabCode, regKecCode, regSequence]);

  // Filter Direktori
  const filteredMembers = members.filter((m) => {
    const matchKeyword =
      m.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      m.noKta.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (m.city && m.city.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      (m.kodeKabupaten && m.kodeKabupaten.includes(searchKeyword));

    const matchKrida = selectedKrida === 'ALL' || m.kridaId === selectedKrida;
    const matchProvince = selectedProvince === 'ALL' || m.province === selectedProvince;
    const matchLevel = selectedLevel === 'ALL' || m.levelOrganisasi === selectedLevel;

    return matchKeyword && matchKrida && matchProvince && matchLevel;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim()) {
      addToast({ type: 'error', title: 'Validasi', message: 'Nama lengkap anggota wajib diisi' });
      return;
    }
    if (!regNik || regNik.length !== 16 || !/^\d{16}$/.test(regNik)) {
      addToast({ type: 'error', title: 'Validasi NIK', message: 'NIK harus terdiri dari 16 digit angka' });
      return;
    }

    const regencyObj = getRegencyByCode(regKabCode);
    const provObj = getProvinceByCode(regProvCode);
    const districtObj = availableDistricts.find((d) => d.districtCode3 === regKecCode);

    const generatedKta = previewGeneratedKta;
    const qrToken = ktaService.generateQrToken(generatedKta, regNik);

    const newMember: MemberRecord = {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      noKta: generatedKta,
      fullName: regFullName,
      gender: 'L',
      birthPlace: regencyObj ? regencyObj.name : 'Indonesia',
      birthDate: '2004-01-01',
      levelOrganisasi: regLevel,
      kodeProvinsi: regLevel === 'KWARTIR_NASIONAL' ? '00' : regProvCode,
      kodeKabupaten: regLevel === 'KWARTIR_NASIONAL' ? '0000' : regKabCode,
      kodeKecamatan: regLevel === 'KWARTIR_NASIONAL' ? '000' : regKecCode,
      province: regLevel === 'KWARTIR_NASIONAL' ? 'Kwartir Nasional' : (provObj ? provObj.name : 'Provinsi'),
      city: regLevel === 'KWARTIR_NASIONAL' ? 'Pusat (Kwarnas)' : (regencyObj ? regencyObj.name : 'Kabupaten/Kota'),
      kecamatan: districtObj ? districtObj.name : (regLevel === 'KWARTIR_NASIONAL' ? 'Pusat' : 'Kecamatan'),
      address: 'Pangkalan Saka Pariwisata',
      kridaId: regKridaId,
      kridaName: KRIDA_MASTER.find((k) => k.id === regKridaId)?.name || 'KRIDA PEMANDU',
      membershipLevel: regLevelKeanggotaan,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      verificationToken: qrToken,
      joinedDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };

    setMembers([newMember, ...members]);
    setIsRegisterModalOpen(false);
    setRegFullName('');
    setRegNik('');
    setRegSequence(String(parseInt(regSequence || '1', 10) + 1));

    addToast({
      type: 'success',
      title: 'Pendaftaran Berhasil',
      message: `Anggota berhasil didaftarkan dengan No. KTA: ${generatedKta}`,
    });
  };

  const memberColumns = [
    {
      key: 'noKta',
      header: 'No. KTA Resmi',
      width: '190px',
      render: (m: MemberRecord) => {
        const isNas = m.levelOrganisasi === 'KWARTIR_NASIONAL';
        return (
          <div className="space-y-1">
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded border inline-block ${
                isNas
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              {m.noKta}
            </span>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
              {isNas ? (
                <span className="text-amber-700 font-semibold">Format: 00.NNNNNN</span>
              ) : (
                <span>
                  PPKK: <b className="text-slate-700">{m.kodeKabupaten || '-'}</b> | CCC:{' '}
                  <b className="text-slate-700">{m.kodeKecamatan || '-'}</b>
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'fullName',
      header: 'Nama & Tingkat',
      render: (m: MemberRecord) => (
        <div className="flex items-center gap-2.5">
          <img
            src={m.photoUrl}
            alt={m.fullName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="font-semibold text-slate-900 text-xs">{m.fullName}</p>
            <p className="text-[10px] text-slate-500">{m.membershipLevel}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'level',
      header: 'Tingkat Organisasi',
      render: (m: MemberRecord) => {
        const isNas = m.levelOrganisasi === 'KWARTIR_NASIONAL';
        return (
          <Badge variant={isNas ? 'orange' : 'blue'} size="sm">
            {isNas ? 'Kwartir Nasional' : 'Wilayah'}
          </Badge>
        );
      },
    },
    {
      key: 'wilayah',
      header: 'Wilayah (PPKK & CCC)',
      render: (m: MemberRecord) => (
        <div className="text-xs space-y-0.5">
          <p className="font-medium text-slate-800">{m.province}</p>
          <p className="text-[11px] text-slate-500">
            {m.city} {m.kecamatan ? `• Kec. ${m.kecamatan}` : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'krida',
      header: 'Krida',
      render: (m: MemberRecord) => (
        <Badge variant="blue" size="sm">
          {m.kridaName.replace('Krida ', '')}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m: MemberRecord) => (
        <Badge variant={m.status === 'ACTIVE' ? 'green' : 'orange'} size="sm" dot>
          {m.status === 'ACTIVE' ? 'Aktif' : 'Verifikasi'}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: 'Aksi KTA',
      align: 'right' as const,
      render: (m: MemberRecord) => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<CreditCard className="w-3.5 h-3.5 text-[#0066B3]" />}
          onClick={() => setSelectedMemberForKTA(m)}
        >
          Lihat KTA
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Bar & Info Box */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            Manajemen Keanggotaan & KTA Digital
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem penomoran KTA final resmi: <b>00.NNNNNN</b> (Kwartir Nasional) & <b>00.PPKK.CCC.NNNNNN</b> (Wilayah).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Registrasi & Generator KTA
          </Button>
        </div>
      </div>

      {/* Info Card: Format KTA Final */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded uppercase tracking-wider">
                KTA FORMAT FINAL
              </span>
              <span className="text-xs text-slate-400">Aturan Penomoran Resmi</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              • <b>Kwartir Nasional</b>: <code className="text-amber-400 font-mono">00.NNNNNN</code> (00 = Kode Tetap Kwarnas, NNNNNN = Nomor Urut 6 digit)
              <br />
              • <b>Bukan Kwartir Nasional (Wilayah)</b>: <code className="text-emerald-400 font-mono">00.PPKK.CCC.NNNNNN</code> (PPKK = Kode Kab/Kota dari <code className="text-slate-300 font-mono">regencies.csv</code>, CCC = 3 digit Kecamatan dari <code className="text-slate-300 font-mono">districts.csv</code>, tanpa kode provinsi pada nomor KTA).
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div className="text-right text-xs">
              <p className="text-slate-400">Pangkalan Database:</p>
              <p className="font-semibold text-white">Menyimpan kode_provinsi, kode_kabupaten, kode_kecamatan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'directory', label: `Direktori Anggota (${filteredMembers.length})`, icon: <Users className="w-4 h-4" /> },
          { id: 'krida', label: 'Master Krida SAKA', icon: <Shield className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <Card padding="md">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Input
                placeholder="Cari nama, No KTA, kode PPKK..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />

              <Select
                options={[
                  { value: 'ALL', label: 'Semua Tingkat Organisasi' },
                  { value: 'KWARTIR_NASIONAL', label: 'Kwartir Nasional (00.NNNNNN)' },
                  { value: 'WILAYAH', label: 'Wilayah / Daerah (00.PPKK.CCC.NNNNNN)' },
                ]}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
              />

              <Select
                options={[
                  { value: 'ALL', label: 'Semua Krida Spesialisasi' },
                  ...KRIDA_MASTER.map((k) => ({ value: k.id, label: k.name })),
                ]}
                value={selectedKrida}
                onChange={(e) => setSelectedKrida(e.target.value)}
              />

              <Select
                options={[
                  { value: 'ALL', label: 'Semua Provinsi' },
                  ...PROVINCES.map((p) => ({ value: p.name, label: `${p.code} - ${p.name}` })),
                ]}
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              />
            </div>
          </Card>

          {/* Table */}
          <Table
            columns={memberColumns}
            data={filteredMembers}
            keyExtractor={(m) => m.id}
          />
        </div>
      )}

      {/* Master Krida View */}
      {activeTab === 'krida' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KRIDA_MASTER.map((krida) => (
            <Card key={krida.id} padding="lg" className="border-t-4" style={{ borderTopColor: krida.color }}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" className="font-mono text-xs">{krida.code}</Badge>
                  <span className="text-xs text-slate-400">Master Data SAKA</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{krida.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{krida.description}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* KTA Preview Modal (Containing Locked DigitalKTACard) */}
      <Modal
        isOpen={Boolean(selectedMemberForKTA)}
        onClose={() => setSelectedMemberForKTA(null)}
        title="Kartu Tanda Anggota (KTA Digital SPWN)"
        description="Komponen kartu terstandarisasi dengan penomoran format final resmi & QR token."
        size="md"
      >
        {selectedMemberForKTA && (
          <div className="py-2 flex flex-col items-center gap-4">
            <DigitalKTACard memberData={selectedMemberForKTA} />
            
            {/* Technical Database Metadata */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1 font-mono">
              <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                Penyimpanan Database (Reporting & Filtering):
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                <div>• level_organisasi: <b className="text-slate-900">{selectedMemberForKTA.levelOrganisasi || 'WILAYAH'}</b></div>
                <div>• kode_provinsi: <b className="text-slate-900">{selectedMemberForKTA.kodeProvinsi || '-'}</b></div>
                <div>• kode_kabupaten: <b className="text-slate-900">{selectedMemberForKTA.kodeKabupaten || '-'}</b></div>
                <div>• kode_kecamatan: <b className="text-slate-900">{selectedMemberForKTA.kodeKecamatan || '-'}</b></div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Registrasi & Generator KTA Interaktif */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Registrasi Anggota & Generator KTA Digital"
        description="Penerbitan KTA otomatis berdasarkan level organisasi dan kode wilayah resmi."
        size="lg"
      >
        <form onSubmit={handleCreateMember} className="space-y-4 py-1">
          {/* Live Preview Bar */}
          <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-700">
            <div className="text-[11px] text-slate-400 font-medium">HASIL GENERATOR NOMOR KTA:</div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-xl sm:text-2xl font-bold text-amber-400 tracking-wider">
                {previewGeneratedKta}
              </span>
              <span className="text-[11px] px-2.5 py-1 rounded font-bold uppercase bg-slate-800 text-slate-200 border border-slate-700">
                {regLevel === 'KWARTIR_NASIONAL' ? '00.NNNNNN' : '00.PPKK.CCC.NNNNNN'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 border-t border-slate-800 pt-2 flex flex-wrap gap-x-4">
              <span>00 = Tetap</span>
              {regLevel === 'WILAYAH' && (
                <>
                  <span>PPKK (Kab/Kota): <b className="text-white">{regKabCode}</b></span>
                  <span>CCC (Kecamatan): <b className="text-white">{regKecCode}</b></span>
                </>
              )}
              <span>Nomor Urut: <b className="text-white">{String(regSequence).padStart(6, '0')}</b></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Organisasi <span className="text-red-500">*</span>
              </label>
              <Select
                value={regLevel}
                onChange={(e) => setRegLevel(e.target.value as OrganizationLevelType)}
                options={[
                  { value: 'WILAYAH', label: 'Bukan Kwartir Nasional (Wilayah / Kwarda / Kwarcab)' },
                  { value: 'KWARTIR_NASIONAL', label: 'Kwartir Nasional (Format: 00.NNNNNN)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Urut Anggota (NNNNNN) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                max="999999"
                value={regSequence}
                onChange={(e) => setRegSequence(e.target.value)}
                placeholder="Contoh: 1, 89, 120"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Anggota <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Contoh: Kak Siti Rahmawati"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK (16 Digit Angka) <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Contoh: 3201015501040001"
                maxLength={16}
                value={regNik}
                onChange={(e) => setRegNik(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {/* Jika Wilayah: Input Provinsi, Kabupaten/Kota (regencies), dan Kecamatan (districts) */}
            {regLevel === 'WILAYAH' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Provinsi (Data Laporan & Filtering)
                  </label>
                  <Select
                    value={regProvCode}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      setRegProvCode(newProv);
                      const regList = getRegenciesByProvince(newProv);
                      if (regList.length > 0) {
                        setRegKabCode(regList[0].code);
                        const distList = getDistrictsByRegency(regList[0].code);
                        if (distList.length > 0) {
                          setRegKecCode(distList[0].districtCode3);
                        }
                      }
                    }}
                    options={PROVINCES.map((p) => ({
                      value: p.code,
                      label: `${p.code} - ${p.name}`,
                    }))}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    *Kode provinsi TIDAK digunakan pada nomor KTA wilayah, namun tersimpan di database.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kabupaten / Kota (PPKK dari regencies.csv) <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={regKabCode}
                    onChange={(e) => {
                      const newKab = e.target.value;
                      setRegKabCode(newKab);
                      const distList = getDistrictsByRegency(newKab);
                      if (distList.length > 0) {
                        setRegKecCode(distList[0].districtCode3);
                      }
                    }}
                    options={availableRegencies.map((r) => ({
                      value: r.code,
                      label: `${r.code} - ${r.name}`,
                    }))}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={regKecCode}
                    onChange={(e) => setRegKecCode(e.target.value)}
                    options={availableDistricts.map((d) => ({
                      value: d.districtCode3,
                      label: d.name.startsWith('Kecamatan ') || d.name.startsWith('KECAMATAN ') ? d.name : `Kecamatan ${d.name}`,
                    }))}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peminatan 4 Krida SAKA
              </label>
              <Select
                value={regKridaId}
                onChange={(e) => setRegKridaId(e.target.value)}
                options={KRIDA_MASTER.map((k) => ({ value: k.id, label: k.name }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkatan Golongan Pramuka
              </label>
              <Select
                value={regLevelKeanggotaan}
                onChange={(e) => setRegLevelKeanggotaan(e.target.value)}
                options={TINGKAT_GOLONGAN_PRAMUKA.map((t) => ({ value: t, label: t }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Terbitkan KTA Resmi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
