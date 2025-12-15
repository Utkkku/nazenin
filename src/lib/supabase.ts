import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safely get environment variables
const getEnvVar = (key: string): string => {
  try {
    return (import.meta.env as any)[key] || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

let supabase: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    console.log('✅ Supabase bağlantısı kuruldu');
  } else {
    console.warn('⚠️ Supabase URL veya Anon Key bulunamadı. localStorage kullanılacak.');
  }
} catch (error) {
  console.error('❌ Supabase client oluşturulurken hata:', error);
  supabase = null;
}

export { supabase };

