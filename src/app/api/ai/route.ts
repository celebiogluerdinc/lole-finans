/**
 * AI KÖPRÜSÜ — tarayıcıdaki uygulama Anthropic'e doğrudan çıkamaz (CORS +
 * anahtar gizliliği). Bu route istekleri sunucudan iletir; anahtar yalnızca
 * Vercel ortam değişkeninde durur (ANTHROPIC_API_KEY).
 *
 * Güvenlik önlemleri:
 *  1) Model SUNUCUDA sabit — istemcinin gönderdiği body.model yok sayılır.
 *  2) IP başına dakikada RL_MAX istek sınırı (bellek içi; Vercel'de best-effort).
 *  3) Supabase JWT ZORUNLU — Supabase yapılandırılmışsa Authorization başlığı
 *     olmayan istek 401 alır.
 *
 * v48 DENETİM DÜZELTMELERİ:
 *  • Kimlik doğrulama fail-open idi: başlık HİÇ gönderilmezse doğrulama bloğu
 *    çalışmıyordu; uç nokta URL'yi bilen herkes için kimliksiz bir Claude
 *    proxy'siydi. max_tokens'ın 8000'e çıkması bunun maliyetini 4'e katlıyordu.
 *  • messages hiç doğrulanmıyordu ve gövde boyutu sınırsızdı — asıl maliyet
 *    vektörü GİRİŞ jetonu tarafındaydı.
 *  • 429 gövdesi "dakikada en fazla 10" diyordu, gerçek sınır 30'du.
 *  • Meclis tek toplantıda 11-13 çağrı yapıyor; 30 sınırı iki toplantıya yetmiyordu.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MODEL = 'claude-sonnet-4-5'; // sunucuda kilitli — body.model dikkate alınmaz

const RL = new Map<string, number[]>();
const RL_MAX = 60; // v48: Yönetim Meclisi tek toplantıda 11-13 çağrı yapıyor (6 uzman × 2 tur + başkan)
const RL_WIN_MS = 60_000;
/**
 * v48 DENETİM (KRİTİK): önceki sınırlar (400.000 / 300.000 karakter) bir ekstre
 * fotoğrafının base64'ünü almıyordu — 1600px/q85 bir telefon fotoğrafı 590.000
 * karaktere çıkıyor. Sonuç: özellik gerçek fotoğrafla HİÇ çalışmıyor, kullanıcıya
 * "fotoğrafınız bulanık" deniyordu. Görsel ve metin ayrı sınırlara bağlandı.
 */
const GOVDE_MAX = 6_000_000;  // tüm gövde (4 sayfa görsel + metin için pay)
const METIN_MAX = 300_000;    // messages içindeki DÜZ METİN toplamı
const GORSEL_MAX = 1_500_000; // tek görselin base64 uzunluğu (~1,1 MB ikili)
const GORSEL_TOPLAM = 4_500_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // v48: RL.size > 5000 iken RL.clear() HERKESİN sayacını sıfırlıyordu — artık
  // yalnızca penceresi dolmuş girdiler atılır.
  if (RL.size > 5000) {
    for (const [k, v] of RL) {
      if (!v.length || now - v[v.length - 1] >= RL_WIN_MS) RL.delete(k);
    }
  }
  const arr = (RL.get(ip) || []).filter((t) => now - t < RL_WIN_MS);
  if (arr.length >= RL_MAX) {
    RL.set(ip, arr);
    return true;
  }
  arr.push(now);
  RL.set(ip, arr);
  return false;
}

type Mesaj = { role: string; content: unknown };
type Blok = { type?: string; text?: unknown; source?: { data?: unknown } };

/** Geçerliyse null, değilse kullanıcıya gösterilecek nedeni döndürür. */
function mesajlarNeden(m: unknown): string | null {
  if (!Array.isArray(m) || !m.length || m.length > 40) return 'Geçersiz mesaj biçimi.';
  let metin = 0, gorsel = 0;
  for (const x of m) {
    if (!x || typeof x !== 'object') return 'Geçersiz mesaj biçimi.';
    const r = (x as Mesaj).role;
    if (r !== 'user' && r !== 'assistant') return 'Geçersiz mesaj biçimi.';
    const c = (x as Mesaj).content;
    if (typeof c === 'string') metin += c.length;
    else if (Array.isArray(c)) {
      if (c.length > 20) return 'Geçersiz mesaj biçimi.';
      for (const b of c as Blok[]) {
        if (!b || typeof b !== 'object') return 'Geçersiz mesaj biçimi.';
        if (b.type === 'text') metin += String(b.text ?? '').length;
        else if (b.type === 'image') {
          const d = b.source && typeof b.source === 'object' ? String((b.source as { data?: unknown }).data ?? '') : '';
          if (d.length > GORSEL_MAX) return 'Fotoğraf çok büyük — sayfayı yakından, tek parça çekip tekrar deneyin.';
          gorsel += d.length;
        } else return 'Geçersiz mesaj biçimi.';
      }
    } else return 'Geçersiz mesaj biçimi.';
    if (metin > METIN_MAX) return 'Gönderilen veri çok büyük — daha dar bir dönem seçin.';
    if (gorsel > GORSEL_TOPLAM) return 'Tek seferde çok fazla sayfa — daha az sayfayla deneyin.';
  }
  return null;
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: 'ANTHROPIC_API_KEY tanımlı değil (Vercel > Settings > Environment Variables).' }, { status: 500 });

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'bilinmiyor';
  if (rateLimited(ip)) {
    return Response.json(
      { error: { message: `Çok fazla istek — dakikada en fazla ${RL_MAX} AI çağrısı yapılabilir, lütfen kısa bir süre bekleyin.` } },
      { status: 429, headers: { 'Retry-After': '30' } }
    );
  }

  // Supabase JWT doğrulaması — Supabase yapılandırılmışsa ZORUNLU.
  const auth = req.headers.get('authorization');
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supaUrl && anon) {
    if (!auth || !auth.startsWith('Bearer ')) {
      return Response.json({ error: { message: 'Oturum bulunamadı — lütfen giriş yapın.' } }, { status: 401 });
    }
    try {
      const u = await fetch(`${supaUrl}/auth/v1/user`, {
        headers: { apikey: anon, Authorization: auth },
        cache: 'no-store',
      });
      if (u.status === 401 || u.status === 403) {
        return Response.json({ error: { message: 'Oturum doğrulanamadı — lütfen yeniden giriş yapın.' } }, { status: 401 });
      }
    } catch {
      /* doğrulama servisi erişilemez — fail-open, istek devam eder (Supabase kesintisinde uygulama kırılmasın) */
    }
  }

  const ham = await req.text().catch(() => '');
  if (!ham) return Response.json({ error: 'Geçersiz istek' }, { status: 400 });
  if (ham.length > GOVDE_MAX) {
    return Response.json({ error: { message: 'İstek çok büyük — daha az veriyle deneyin.' } }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try { body = JSON.parse(ham); } catch { return Response.json({ error: 'Geçersiz istek' }, { status: 400 }); }

  const neden = mesajlarNeden(body.messages);
  if (neden) {
    return Response.json({ error: { message: neden } }, { status: neden === 'Geçersiz mesaj biçimi.' ? 400 : 413 });
  }

  const payload = {
    model: MODEL,
    // v48: ekstre fotoğrafı okuma 40+ satır JSON döndürebiliyor — 2000 yetmiyordu
    max_tokens: Math.min(Math.max(1, Number(body.max_tokens) || 900), 8000),
    system: typeof body.system === 'string' ? body.system.slice(0, 8000) : undefined,
    messages: body.messages,
  };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(payload),
  });
  const j = await r.json().catch(() => ({}));
  return Response.json(j, { status: r.status });
}
