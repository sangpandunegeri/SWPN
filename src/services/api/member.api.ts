/**
 * SPWN Apps 2.0 - Member API Client Module
 * Location: src/services/api/member.api.ts
 */

import { apiClient, ApiResponse } from './apiClient';
import { SpwnUser } from './auth.api';

export interface MemberListParams {
  page?: number;
  limit?: number;
  search?: string;
  provinsi_id?: string;
  tingkatan?: string;
  status?: string;
}

export interface RegisterMemberPayload {
  nama_lengkap: string;
  nik: string;
  email?: string;
  telepon?: string;
  provinsi_id: string;
  kwartir_cabang?: string;
  tingkatan: string;
  krida?: string;
}

export interface UpdateMemberPayload {
  id: string;
  nama_lengkap?: string;
  telepon?: string;
  email?: string;
  alamat?: string;
  foto?: string;
  krida?: string;
}

export const memberApi = {
  /**
   * Mengambil daftar anggota terpaginasi
   */
  list: async (params?: MemberListParams): Promise<ApiResponse<SpwnUser[]>> => {
    return apiClient.get<SpwnUser[]>('member.list', params as Record<string, string | number>);
  },

  /**
   * Mengambil detail profil anggota berdasarkan ID atau no_kta
   */
  detail: async (idOrNoKta: string): Promise<ApiResponse<SpwnUser>> => {
    return apiClient.get<SpwnUser>('member.detail', { id: idOrNoKta });
  },

  /**
   * Mendaftarkan anggota baru
   */
  register: async (payload: RegisterMemberPayload): Promise<ApiResponse<SpwnUser>> => {
    return apiClient.post<SpwnUser>('member.register', payload as unknown as Record<string, unknown>);
  },

  /**
   * Memperbarui data anggota
   */
  update: async (payload: UpdateMemberPayload): Promise<ApiResponse<SpwnUser>> => {
    return apiClient.post<SpwnUser>('member.update', payload as unknown as Record<string, unknown>);
  },

  /**
   * Menonaktifkan anggota (Super Admin / Admin Pusat)
   */
  deactivate: async (id: string, reason: string): Promise<ApiResponse<SpwnUser>> => {
    return apiClient.post<SpwnUser>('member.deactivate', { id, reason });
  }
};
