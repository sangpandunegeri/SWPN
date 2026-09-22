import React from 'react';
import {
  Users,
  Compass,
  ShoppingBag,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  QrCode,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Card, Badge, Button, Avatar } from '../../../components/ui';
import { useAuthStore } from '../../../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { formatCurrencyIDR } from '../../../utils/formatters';
import { KridaGridSection } from '../../krida/components/KridaGridSection';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { setActiveView } = useUIStore();

  const metrics = [
    {
      label: 'Total Anggota SAKA',
      value: '24.850',
      change: '+14% bln ini',
      icon: <Users className="w-5 h-5 text-[#0066B3]" />,
      accent: 'border-t-[#0066B3]',
    },
    {
      label: 'Destinasi Terverifikasi',
      value: '1.420',
      change: '38 Provinsi',
      icon: <Compass className="w-5 h-5 text-[#009B4D]" />,
      accent: 'border-t-[#009B4D]',
    },
    {
      label: 'Katalog UMKM & Produk',
      value: '3.640',
      change: 'Rp 480 jt vol',
      icon: <ShoppingBag className="w-5 h-5 text-[#F7941D]" />,
      accent: 'border-t-[#F7941D]',
    },
    {
      label: 'Artikel & Agenda Terbit',
      value: '890',
      change: '24 Agenda aktif',
      icon: <Newspaper className="w-5 h-5 text-[#6A1B9A]" />,
      accent: 'border-t-[#6A1B9A]',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'Verifikasi KTA Anggota Baru Kwarda Jabar',
      desc: 'Admin Wilayah memvalidasi 12 anggota KRIDA PEMANDU pangkalan Bogor.',
      time: '10 menit yang lalu',
      badge: 'Membership',
      badgeVariant: 'blue' as const,
    },
    {
      id: '2',
      title: 'Pendaftaran Destinasi Desa Wisata Nglanggeran',
      desc: 'Tourism Manager memverifikasi homestay dan jalur trekking edukasi.',
      time: '45 menit yang lalu',
      badge: 'Tourism',
      badgeVariant: 'green' as const,
    },
    {
      id: '3',
      title: 'Publikasi Panduan Jambore Pariwisata 2026',
      desc: 'Redaksi menerbitkan jadwal dan agenda resmi perkemahan nasional.',
      time: '2 jam yang lalu',
      badge: 'Content',
      badgeVariant: 'purple' as const,
    },
    {
      id: '4',
      title: 'Pemesanan Suvenir Kriya Rotan Dayak',
      desc: 'Pesanan #SPWN-8821 diproses oleh supplier mitra binaan Kalimantan Timur.',
      time: '4 jam yang lalu',
      badge: 'Commerce',
      badgeVariant: 'orange' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1F33] via-[#003E6D] to-[#0066B3] text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
            <span>Digital Tourism Ecosystem Platform</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Selamat Datang, {currentUser.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Anda terhubung dengan wewenang <span className="font-semibold text-white">{currentUser.roleName}</span> ({currentUser.province || 'Nasional'}).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="warning"
            onClick={() => setActiveView('member-achievement')}
            leftIcon={<Award className="w-4 h-4" />}
          >
            Pencapaian Saya
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setActiveView('skk-learning')}
            leftIcon={<GraduationCap className="w-4 h-4" />}
          >
            SKK Learning
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => setActiveView('kta-verification')}
            leftIcon={<QrCode className="w-4 h-4" />}
          >
            Cek KTA
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <Card key={idx} padding="md" className={`border-t-4 ${m.accent}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{m.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{m.value}</h3>
                <p className="text-[11px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{m.change}</span>
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100">
                {m.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grid: Map Telemetry Placeholder & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Indonesia Distribution Preview */}
        <Card padding="lg" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sebaran Ekosistem Pariwisata Nusantara</h3>
              <p className="text-xs text-slate-500">Pemetaan terpusat 38 provinsi di Indonesia.</p>
            </div>
            <Badge variant="green" dot>Sinkronisasi Aktif</Badge>
          </div>

          <div className="h-64 rounded-xl bg-gradient-to-br from-slate-900 to-[#003E6D] p-6 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">Cakupan Wilayah</span>
                <h4 className="text-lg font-bold text-white">38 Kwarda / Provinsi Terkoneksi</h4>
              </div>
              <Badge variant="blue" className="bg-white/20 text-white border-white/20">Real-time GAS Hub</Badge>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/10">
              <div>
                <p className="text-[10px] text-slate-300">Pangkalan Terbanyak</p>
                <p className="text-xs font-bold text-white">Jawa Barat (4.210)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-300">Destinasi Terpopuler</p>
                <p className="text-xs font-bold text-white">Bali & NTT (340)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-300">Transaksi UMKM</p>
                <p className="text-xs font-bold text-white">Yogyakarta (Rp 120M)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Timeline */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Terkini</h3>
            <Badge variant="neutral">Real-time</Badge>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act) => (
              <div key={act.id} className="text-xs space-y-1 border-b border-slate-100 last:border-0 pb-2.5 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">{act.title}</span>
                  <Badge size="sm" variant={act.badgeVariant}>{act.badge}</Badge>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">{act.desc}</p>
                <p className="text-slate-400 text-[10px]">{act.time}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4 Krida SAKA Pariwisata Section */}
      <KridaGridSection />
    </div>
  );
};
