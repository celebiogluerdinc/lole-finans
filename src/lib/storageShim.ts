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
  get(key: string, shared?: boolean): Promise<{ value: string; updatedAt?: string | null } | null>;
  set(key: string, value: string, shared?: boolean): Promise<boolean>;
  delete(key: string, shared?: boolean): Promise<boolean>;
  list(prefix: string, shared?: boolean): Promise<{ keys: string[] }>;
  /** B1-F3: yalnızca updated_at okuyan hafif sorgu (bayatlama tespiti için). */
  head(key: string, shared?: boolean): Promise<{ updatedAt: string | null } | null>;
  /**
   * B1: Compare-And-Set — updated_at fencing token olarak kullanılır (şema değişikliği yok).
   * Beklenen sürüm eşleşirse yazar; eşleşmezse { ok:false, current } döner (mevcut satır ile).
   * Satır hiç yoksa insert eder. Motor tarafı bu yol çalışmazsa DÜZ set'e düşer (fail-open).
   */
  setCas(
    key: string,
    value: string,
    shared: boolean | undefined,
    expectedUpdatedAt: string | null
  ): Promise<
    | { ok: true; updatedAt: string }
    | { ok: false; current: { value: string; updatedAt: string | null } | null }
  >;
  /**
   * v56: satırların GERÇEK bayt boyutu. Tahmin değil ölçüm.
   * `method` hangi yolun kullanıldığını söyler: 'rpc' (veritabanında hesaplandı)
   * ya da 'indirme' (değerler indirilip ölçüldü). Ayrıntı için uygulamaya bakın.
   */
  sizes(
    prefix?: string,
    shared?: boolean
  ): Promise<{
    items: { key: string; bytes: number }[];
    total: number;
    method: 'rpc' | 'indirme';
    downloadedBytes: number;
  }>;
}

const TABLE = 'kv_store';

/**
 * v56b: `%` ve `_` SQL LIKE joker karakterleridir. Bugün tüm önekler sabit ve
 * ASCII olduğu için sömürülebilir bir durum yok, ama `_` içeren bir anahtar öneki
 * sessizce DAHA GENİŞ eşleşir (hata vermez) — bu da yanlış satırları silmeye ya da
 * saymaya kadar gidebilir. Önek her zaman kaçışlanır.
 */
const likeEscape = (v: string) => (v || '').replace(/([%_\\])/g, '\\$1');

export function makeStorage(sb: SupabaseClient, userId: string): LoleStorage {
  const scopeOf = (shared?: boolean) => (shared ? 'shared' : userId);

  return {
    async get(key, shared) {
      const { data, error } = await sb
        .from(TABLE)
        .select('value, updated_at')
        .eq('scope', scopeOf(shared))
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { value: data.value as string, updatedAt: (data.updated_at as string) ?? null };
    },

    async head(key, shared) {
      const { data, error } = await sb
        .from(TABLE)
        .select('updated_at')
        .eq('scope', scopeOf(shared))
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { updatedAt: (data.updated_at as string) ?? null };
    },

    async setCas(key, value, shared, expectedUpdatedAt) {
      const scope = scopeOf(shared);
      const now = new Date().toISOString();
      const readCurrent = async () => {
        const { data } = await sb
          .from(TABLE)
          .select('value, updated_at')
          .eq('scope', scope)
          .eq('key', key)
          .maybeSingle();
        return data
          ? { value: data.value as string, updatedAt: (data.updated_at as string) ?? null }
          : null;
      };
      if (!expectedUpdatedAt) {
        // Satır yok varsayımı → insert; çakışırsa (satır varmış) mevcut durumu döndür
        const { error } = await sb.from(TABLE).insert({ scope, key, value, updated_at: now });
        if (!error) return { ok: true, updatedAt: now };
        return { ok: false, current: await readCurrent() };
      }
      const { data, error } = await sb
        .from(TABLE)
        .update({ value, updated_at: now })
        .eq('scope', scope)
        .eq('key', key)
        .eq('updated_at', expectedUpdatedAt)
        .select('updated_at');
      if (error) throw error;
      if (data && data.length) return { ok: true, updatedAt: now };
      // 0 satır güncellendi → ya sürüm değişti ya satır yok
      const current = await readCurrent();
      if (!current) {
        const ins = await sb.from(TABLE).insert({ scope, key, value, updated_at: now });
        if (!ins.error) return { ok: true, updatedAt: now };
      }
      return { ok: false, current };
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
        .like('key', `${likeEscape(prefix)}%`);
      if (error) throw error;
      return { keys: (data || []).map((r: { key: string }) => r.key) };
    },

    /**
     * v56: GERÇEK boyut ölçümü.
     *
     * Ayarlar ekranındaki "Bulut Depolama Kullanımı" kutusu eskiden canlı verinin
     * uzunluğunu 14 ile çarpıp TAHMİN üretiyordu; bu tahmin hem yanlış tavana
     * (20 MB — uygulamanın Claude artifact dönemindeki sınırı) göre ölçüyor hem de
     * yedeklerin gzip'li olduğunu saymıyordu. Sonuç: %134 gibi asılsız "Kritik"
     * uyarıları. Burada satırların gerçek bayt boyutunu okuyoruz.
     *
     * İki yol var:
     *  1) `kv_sizes` RPC'si kuruluysa boyutlar veritabanında hesaplanır — ucuz ve
     *     kesin. Kurulum SQL'i (Supabase > SQL Editor, bir kez çalıştırılır):
     *
     *       create or replace function kv_sizes(p_scope text, p_prefix text default '')
     *       returns table(key text, bytes bigint)
     *       language sql stable security invoker as $$
     *         select key, octet_length(value)::bigint
     *         from kv_store
     *         where scope = p_scope and key like p_prefix || '%'
     *       $$;
     *
     *  2) RPC yoksa (varsayılan durum) satırların değerleri indirilip ölçülür.
     *     Kesin sonuç verir ama indirme maliyeti vardır; bu yüzden YALNIZCA
     *     kullanıcı "🔎 Gerçek boyutu ölç" düğmesine bastığında çağrılır.
     */
    async sizes(prefix = '', shared) {
      const scope = scopeOf(shared);

      // 1) ucuz yol — RPC kuruluysa
      try {
        const { data, error } = await sb.rpc('kv_sizes', { p_scope: scope, p_prefix: prefix });
        if (!error && Array.isArray(data)) {
          const items = (data as { key: string; bytes: number | string }[]).map((r) => ({
            key: r.key,
            bytes: Number(r.bytes) || 0,
          }));
          return {
            items,
            total: items.reduce((s, i) => s + i.bytes, 0),
            method: 'rpc' as const,
            downloadedBytes: 0,
          };
        }
      } catch {
        /* RPC kurulu değil — indirme yoluna düş */
      }

      // 2) yedek yol — değerleri indirip ölç
      // v56b: PostgREST'in varsayılan satır sınırı sonucu SESSİZCE kırpabilir ve
      // toplam eksik çıkar. Açık bir üst sınır koyup aşıldığında hata veriyoruz —
      // eksik bir toplamı "gerçek ölçüm" diye göstermektense ölçüm yapmamak yeğdir.
      const SATIR_SINIRI = 5000;
      const { data, error } = await sb
        .from(TABLE)
        .select('key, value')
        .eq('scope', scope)
        .like('key', `${likeEscape(prefix)}%`)
        .limit(SATIR_SINIRI);
      if (error) throw error;
      if ((data || []).length >= SATIR_SINIRI) {
        throw new Error(
          `Çok fazla kayıt (${SATIR_SINIRI}+) — ölçüm eksik kalacağı için iptal edildi.`
        );
      }
      const enc = new TextEncoder();
      const items: { key: string; bytes: number }[] = (data || []).map(
        (r: { key: string; value: string | null }) => ({
          key: r.key,
          bytes: r.value ? enc.encode(r.value).length : 0,
        })
      );
      const total = items.reduce((s: number, i: { bytes: number }) => s + i.bytes, 0);
      return { items, total, method: 'indirme' as const, downloadedBytes: total };
    },
  };
}
