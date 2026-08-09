/**
 * HAFTALIK OTOMATİK YEDEK E-POSTASI
 * Vercel Cron tarafından her Pazartesi 06:00 UTC'de (09:00 TR) çağrılır
 * (bkz. vercel.json). Tüm şirketlerin verisini Supabase'ten okur ve
 * yedek dosyası olarak e-posta ekinde gönderir.
 *
 * AKTİF OLMASI İÇİN Vercel > Project > Settings > Environment Variables:
 *   SUPABASE_SERVICE_ROLE_KEY  = Supabase > Settings > API > service_role  (GİZLİ!)
 *   RESEND_API_KEY             = resend.com ücretsiz hesabından API anahtarı
 *   BACKUP_EMAIL               = celebiogluerdinc@gmail.com  (opsiyonel; varsayılan bu)
 * Anahtarlar yoksa hiçbir şey yapmaz, hata ile döner (veriye dokunmaz).
 */
export const dynamic = 'force-dynamic';

const MAIN_KEY = 'lole-finans-v1-ekip'; // uygulamanın ortak veri anahtarı (DKEY+'-ekip')

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resend = process.env.RESEND_API_KEY;
  const to = process.env.BACKUP_EMAIL || 'celebiogluerdinc@gmail.com';

  if (!url || !service || !resend) {
    return Response.json(
      { ok: false, error: 'Eksik ayar: SUPABASE_SERVICE_ROLE_KEY ve RESEND_API_KEY ortam değişkenleri gerekli.' },
      { status: 500 }
    );
  }

  // 1) Tüm şirketlerin ortak verisini oku (salt-okunur)
  const r = await fetch(
    `${url}/rest/v1/kv_store?scope=eq.shared&key=eq.${encodeURIComponent(MAIN_KEY)}&select=value`,
    { headers: { apikey: service, Authorization: `Bearer ${service}` }, cache: 'no-store' }
  );
  if (!r.ok) {
    return Response.json({ ok: false, error: 'Supabase okunamadı: ' + r.status }, { status: 502 });
  }
  const rows = (await r.json()) as Array<{ value: string }>;
  const data = rows?.[0]?.value;
  if (!data) {
    return Response.json({ ok: false, error: 'Yedeklenecek veri bulunamadı (kv_store boş).' }, { status: 404 });
  }

  // 2) E-posta ile gönder (ek: tam sistem yedeği JSON)
  const today = new Date().toISOString().slice(0, 10);
  const b64 = Buffer.from(data, 'utf8').toString('base64');
  const mail = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resend}` },
    body: JSON.stringify({
      from: 'LOLE Finans <onboarding@resend.dev>',
      to: [to],
      subject: `LOLE Finans — haftalık otomatik yedek (${today})`,
      text:
        'Merhaba,\n\nTÜM şirketleri kapsayan haftalık sistem yedeğiniz ektedir.\n' +
        'Bu dosyayı güvenli bir yerde saklayın.\n\n' +
        'Geri yükleme gerekirse: Uygulama > Ayarlar > Sistem Yedeğini Yükle.\n\n' +
        'Bu e-posta her Pazartesi otomatik gönderilir.',
      attachments: [{ filename: `lole-sistem-yedegi-${today}.json`, content: b64 }],
    }),
  });
  const mj = await mail.json().catch(() => ({}));
  if (!mail.ok) {
    return Response.json({ ok: false, error: 'E-posta gönderilemedi', detail: mj }, { status: 502 });
  }
  return Response.json({ ok: true, sentTo: to, bytes: data.length, date: today });
}
