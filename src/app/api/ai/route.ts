/**
 * AI KÖPRÜSÜ — tarayıcıdaki uygulama Anthropic'e doğrudan çıkamaz (CORS +
 * anahtar gizliliği). Bu route istekleri sunucudan iletir; anahtar yalnızca
 * Vercel ortam değişkeninde durur (ANTHROPIC_API_KEY).
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: 'ANTHROPIC_API_KEY tanımlı değil (Vercel > Settings > Environment Variables).' }, { status: 500 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return Response.json({ error: 'Geçersiz istek' }, { status: 400 }); }
  const payload = {
    model: (body.model as string) || 'claude-sonnet-4-5',
    max_tokens: Math.min(Number(body.max_tokens) || 900, 2000),
    system: body.system,
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
