'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabaseClient';
import { makeStorage } from '@/lib/storageShim';
import { LOLE_SHELL } from '@/lib/loleShell';

// Engine tarafından kullanılan global köprü
declare global {
  interface Window {
    storage?: unknown;
    __loleBoot?: { email: string; signOut: () => Promise<void> };
    __loleBooted?: boolean;
  }
}

export default function AppPage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'checking' | 'booting' | 'ready' | 'nosession'>(
    'checking'
  );

  useEffect(() => {
    let cancelled = false;
    const sb = getSupabase();

    // v54: Supabase jetonu yenilenirken getSession() KISA SURE null donebiliyor.
    // Eskiden bu an /login'e atiyor, kullanici bir anda giris ekraninda buluyordu
    // ("sayfa kendiliginden yenilendi" sikayetinin bir sebebi buydu). Artik
    // birkac kez, artan araliklarla tekrar denenir; gercekten oturum yoksa gidilir.
    const oturumAl = async () => {
      for (let i = 0; i < 4; i++) {
        const { data } = await sb.auth.getSession();
        if (data.session) return data.session;
        if (cancelled) return null;
        await new Promise((r) => setTimeout(r, 300 + i * 500));
      }
      const { data } = await sb.auth.getSession();
      return data.session ?? null;
    };

    (async () => {
      const session = await oturumAl();
      if (cancelled) return;

      if (!session) {
        setStatus('nosession');
        router.replace('/login');
        return;
      }
      const data = { session };

      // Zaten başlatıldıysa tekrar başlatma (aynı sekmede yeniden mount'a karşı)
      if (window.__loleBooted) {
        setStatus('ready');
        return;
      }

      const user = data.session.user;
      const userId = user.id;
      const email = user.email || '';

      // 1) window.storage'ı Supabase kv_store ile besle
      window.storage = makeStorage(sb, userId);

      // 2) Giriş/çıkış köprüsü
      window.__loleBoot = {
        email,
        signOut: async () => {
          try {
            await sb.auth.signOut();
          } catch {
            /* yoksay */
          }
          window.__loleBooted = false;
          window.location.href = '/login';
        },
      };

      // 3) Uygulama kabuğunu (DOM) yerleştir
      if (rootRef.current) {
        rootRef.current.innerHTML = LOLE_SHELL;
      }

      // 4) Motoru (klasik global script) yükle → boot IIFE çalışır
      window.__loleBooted = true;
      setStatus('booting');
      const scr = document.createElement('script');
      scr.src = '/engine.js';
      scr.async = false;
      scr.onload = () => !cancelled && setStatus('ready');
      document.body.appendChild(scr);
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <>
      {status === 'checking' && (
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#46536e',
            fontSize: 14,
          }}
        >
          Yükleniyor…
        </div>
      )}
      <div id="lole-root" ref={rootRef} />
    </>
  );
}
