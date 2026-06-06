import { postForm, get } from '@/api/client';
import type {
  TreeAnalysis,
  TreeMeta,
  TreesHistoryResponse,
  TreesQuotaResponse,
} from '@/api/types';

export async function analyzeTreeImage(
  imageUri: string,
  meta?: TreeMeta,
): Promise<TreeAnalysis> {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() ?? 'upload.jpg';
  const extension = filename.split('.').pop()?.toLowerCase();
  const mimeType =
    extension === 'png'
      ? 'image/png'
      : extension === 'webp'
        ? 'image/webp'
        : 'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  if (meta?.farmerId) formData.append('farmerId', meta.farmerId);
  if (meta?.county) formData.append('county', meta.county);
  if (meta?.landAcres != null) {
    formData.append('landAcres', String(meta.landAcres));
  }
  if (meta?.location) formData.append('location', meta.location);
  if (meta?.notes) formData.append('notes', meta.notes);

  return postForm<TreeAnalysis>('/v1/trees/analyze', formData);
}

export async function fetchTreesHistory(
  limit = 20,
  cursor?: string,
): Promise<TreesHistoryResponse> {
  return get<TreesHistoryResponse>('/v1/trees/history', { limit, cursor });
}

export async function fetchTreesQuota(): Promise<TreesQuotaResponse> {
  return get<TreesQuotaResponse>('/v1/trees/quota');
}
