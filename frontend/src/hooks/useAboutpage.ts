import { useState, useEffect } from 'react';
import type { AboutpageEntry, StrapiSingleResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;

interface UseAboutpageResult {
  data: AboutpageEntry | null;
  loading: boolean;
  error: string | null;
}

export function useAboutpage(): UseAboutpageResult {
  const [data, setData] = useState<AboutpageEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/aboutpage?populate=*`, {
      signal: controller.signal,
      headers: API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json() as Promise<StrapiSingleResponse<AboutpageEntry>>;
      })
      .then((json) => setData(json.data ?? null))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
