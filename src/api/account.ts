import { get } from '@/api/client';
import type { UsageResponse } from '@/api/types';

export async function fetchUsage(): Promise<UsageResponse> {
  return get<UsageResponse>('/v1/usage');
}
