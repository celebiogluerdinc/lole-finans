import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Orijinal uygulama tüm kalıcı veriyi `window.storage` adında basit bir
 * anahtar-değer (KV) arabirimi üzerinden saklıyordu (Claude artifact deposu):
 *
 *    window.storage.get(key, shared)    -> { value: string } | null
 *    window.storage.set(key, value, shared) -> truthy
 *    window.storage.delete(key, shared)
 *    window.storage.list(prefix, shared) -> { keys: string[] }
 *
 * Burada AYNI arabirimi Supabase `kv_store` tablosuyla birebir uyguluyoruz.
 * Böylece 3500 satırlık iş mantığına HİÇ dokunmadan veri artık kullanıcının
 * kendi Supabase projesinde saklanıyor.
 *
 * `shared=true`  -> tüm ekip aynı satırı paylaşır (scope='shared')
 * `shared=false` -> yalnızca giriş yapan kullanıcıya özel (scope=kullanıcı uuid)
 */
export interface LoleStorage {
  get(key: string, shared?: boolean): Promise<{ value: string } | null>;
  set(key: string, value: string, shared?: boolean): Promise<boolean>;
  delete(key: string, shared?: boolean): Promise<boolean>;
  list(prefix: string, shared?: boolean): Promise<{ keys: string[] }>;
}

const TABLE = 'kv_store';

export function makeStorage(sb: SupabaseClient, userId: string): LoleStorage {
  const scopeOf = (shared?: boolean) => (shared ? 'shared' : userId);

  return {
    async get(key, shared) {
      const { data, error } = await sb
        .from(TABLE)
        .select('value')
        .eq('scope', scopeOf(shared))
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { value: data.value as string };
    },

    async set(key, value, shared) {
      const { error } = await sb
        .from(TABLE)
        .upsert(
          {
            scope: scopeOf(shared),
            key,
            value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'scope,key' }
        );
      if (error) throw error;
      return true;
    },

    async delete(key, shared) {
      const { error } = await sb
        .from(TABLE)
        .delete()
        .eq('scope', scopeOf(shared))
        .eq('key', key);
      if (error) throw error;
      return true;
    },

    async list(prefix, shared) {
      const { data, error } = await sb
        .from(TABLE)
        .select('key')
        .eq('scope', scopeOf(shared))
        .like('key', `${prefix}%`);
      if (error) throw error;
      return { keys: (data || []).map((r: { key: string }) => r.key) };
    },
  };
}
