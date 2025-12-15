import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL veya Anon Key bulunamadı. localStorage kullanılacak.');
  console.warn('Environment variables kontrol edin: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
} else {
  console.log('✅ Supabase bağlantısı kuruldu:', supabaseUrl.substring(0, 30) + '...');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

