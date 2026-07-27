/* =====================================================================
   LOLE Finans & Muhasebe — İş Mantığı Motoru (engine)
   Orijinal tek-dosya uygulamadan taşındı. YALNIZCA 3 altyapı dikişi değişti:
     1) Depolama: window.storage artık Supabase kv_store ile beslenir (React tarafı).
     2) Giriş: özel giriş yerine Supabase Auth (supaAutoLogin köprüsü).
     3) Çıkış: doLogout Supabase oturumunu kapatır ve /login'e yönlendirir.
   Diğer TÜM modüller (16 sayfa) birebir korunmuştur.
   Bu dosya klasik (global) bir script olarak yüklenir; data-act tıklama
   yönlendirmesi window[fonksiyonAdı] üzerinden çalışır — modül olarak SARMAYIN.
   ===================================================================== */
/* ---------- ŞİRKETLER ---------- */
const COMPANIES=[
 {id:'rest', name:'LOLE RESTAURANT', tip:'Restoran işletmesi', color:'#8c2f1b'},
 {id:'pati', name:'LOLE PATISSERIE', tip:'Pastane işletmesi',  color:'#9a5b13'},
 {id:'fact', name:'LOLE FACTORY',    tip:'Üretim tesisi',      color:'#31456e'},
 {id:'loleq',name:'LOLE Q',          tip:'Perakende / mağaza', color:'#4a2a6b'}
];
const GRUP={id:'grup',name:'LOLE GRUP',tip:'Konsolide görünüm'};

/* ---------- VERİ KATMANI ---------- */
const DKEY='lole-finans-v1'; // ⚠️ SAKIN DEĞİŞTİRME: mevcut tüm finansal veri bu anahtar altında saklı — değişirse eski veriye erişim kaybolur (veri silinmez ama görünmez olur)
/* v19: GÖMÜLÜ YEDEK — bulut depolama bir önceki yayından bağımsız/boş çıkarsa (ör. yeni bir artifact sürümü farklı bir depolama alanına düşerse)
   diye, bilinen en son veri anlık görüntüsü DOĞRUDAN KODUN İÇİNE gömülür. Böylece veri, Claude'un artifact/depolama sürekliliğine değil,
   dosyanın kendisine bağlı olarak taşınır. Her güncellemede en güncel yedek buraya işlenecek. Şu an boş — bir sonraki güncellemede doldurulacak. */
const EMBEDDED_SEED=(function(){
 try{ return JSON.parse(`{
 "meta": {
  "created": "2026-07-21T11:05:59.269Z",
  "version": 2,
  "saved": "2026-07-21T15:06:54.504Z"
 },
 "seq": 5,
 "accounts": [
  {
   "id": "r267hm",
   "co": "rest",
   "type": "banka",
   "name": "pos",
   "bankName": "ziraat bankası",
   "iban": "",
   "accNo": "",
   "opening": 0,
   "note": ""
  }
 ],
 "txns": [],
 "pos": [],
 "posEntries": [],
 "cards": [],
 "cardTxns": [],
 "cari": [
  {
   "id": "r1upyx",
   "co": "rest",
   "name": "alp öz",
   "type": "tedarikci",
   "taxNo": "",
   "phone": "",
   "email": "",
   "vadeGun": 30,
   "opening": 0,
   "riskLimit": "",
   "note": ""
  }
 ],
 "cariTxns": [],
 "staff": [
  {
   "id": "r376we",
   "co": "rest",
   "active": "1",
   "name": "ali",
   "pos": "",
   "phone": "",
   "startDate": "2026-07-21",
   "salary": 30000,
   "iban": "",
   "note": ""
  }
 ],
 "staffTxns": [],
 "leaves": [],
 "fixed": [
  {
   "id": "r4eads",
   "co": "rest",
   "type": "fatura",
   "name": "elektrik",
   "payDay": 15,
   "amount": 50000,
   "note": ""
  }
 ],
 "fixedLogs": [],
 "tasks": [],
 "notes": [],
 "cheques": [],
 "stock": [],
 "stockTxns": [],
 "assets": [],
 "budgets": [],
 "ai": {
  "autoBrief": 1
 },
 "aiCache": {
  "brief:rest:2026-07-21": "**LOLE RESTAURANT · 21.07.2026 Sabah Brifingi**\\n\\n• Sistemde bugüne ait herhangi bir finansal kayıt bulunmuyor — gelir, gider, hesap bakiyesi ve kasa bilgisi tamamı sıfır görünüyor; bu veri girişi yapılmadığına ya da bağlantı sorununa işaret edebilir, öncelikli olarak kontrol edilmesini öneririm.\\n\\n• Bugün vadesi gelen ödeme kaydı yok; bu açıdan günü rahat başlatıyorsunuz.\\n\\n• Banka ve nakit bakiyesi 0,00 TL olarak görünüyor — gerçek bakiye bu değilse muhasebe sistemindeki senkronizasyonu gün içinde düzeltin.\\n\\n• Aylık gelir ve gider toplamı da 0,00 TL; Temmuz ayına ait işlemlerin sisteme işlenip işlenmediğini muhasebecinizle teyit edin.\\n\\n• Portföyde çek/senet, bekleyen POS blokajı ve kritik stok uyarısı kaydı bulunmuyor — ancak bunların doğru yansıyıp yansımadığı, veri sorunu giderilmeden kesin söylenemez.\\n\\n• Bugün için somut öneri: Sabah içinde kasiyer veya muhasebe sorumlusundan gerçek kasa ve banka bakiyesini alın, sisteme girin; böylece akşam kapanış karşılaştırmasını sağlıklı yapabilirsiniz."
 },
 "user": {
  "name": "",
  "title": ""
 },
 "users": [
  {
   "id": "u0",
   "username": "erdinc",
   "email": "celebiogluerdinc@gmail.com",
   "role": "super",
   "companies": "all",
   "password": "10ef0dde01b10f4f8136511007c06d729e6527de2866f624e945cbcc09d6047f",
   "addedAt": "2026-07-21T11:06:03.158Z",
   "addedBy": "sistem",
   "rememberHash": "c127d15e937ce83015fdb9241a39249afe04d2ca148726190463d6df66ebf93e"
  }
 ],
 "authPw": {
  "user": "17fd087b70259c35a1e9964f1f572d19365638ee5a748a23f2deed0ae4e524af",
  "super": "10ef0dde01b10f4f8136511007c06d729e6527de2866f624e945cbcc09d6047f"
 },
 "auditLog": [
  {
   "ts": "2026-07-21T14:59:28.874Z",
   "user": "erdinc",
   "action": "Giriş yapıldı",
   "detail": ""
  },
  {
   "ts": "2026-07-21T11:07:10.945Z",
   "user": "erdinc",
   "action": "Giriş yapıldı",
   "detail": ""
  }
 ],
 "trash": [],
 "cats": {
  "gelir": [
   "Satış Geliri",
   "Diğer Gelir"
  ],
  "gider": [
   "Hammadde & Malzeme",
   "Personel",
   "Kira",
   "Fatura & Abonelik",
   "Vergi & SGK",
   "Pazarlama",
   "Bakım & Onarım",
   "Banka & Komisyon",
   "Diğer Gider"
  ]
 }
}`); }
 catch(e){ console.error('EMBEDDED_SEED ayrıştırma hatası:',e); return null; }
})(); // v29: 2026-07-21 15:06 tarihli güncel Sistem Yedeği gömüldü (hesap+personel+sabit ödeme dahil)
/* v22: Google Sheets / herhangi bir dış adrese otomatik senkron DENENDİ ve tarayıcı loglarıyla KESİN olarak imkansız olduğu doğrulandı —
   artifact'ın Content-Security-Policy'si yalnızca birkaç CDN + www.claudeusercontent.com'a izin veriyor, başka hiçbir dış adrese değil.
   Bu sınırlama koddan değil, Claude.ai'nin kendi güvenlik politikasından kaynaklanıyor; bu yüzden ilgili kod tamamen kaldırıldı.
   Güvenilir yol: gömülü yedek (EMBEDDED_SEED, yukarıda) + Ayarlar'daki Yedek İndir/Panoya Kopyala. */
const DEFAULT_ADMIN_EMAIL='celebiogluerdinc@gmail.com';
var MODE='ekip'; // v7: uygulama artık her zaman çevrimiçi/ortak veri modunda çalışır — kullanıcı girişiyle korunur
const skey=()=>MODE==='ekip'?DKEY+'-ekip':DKEY;
const isTeam=()=>MODE==='ekip';
const blankState=()=>({
 meta:{created:new Date().toISOString(),version:2},
 seq:1,
 accounts:[],txns:[],pos:[],posEntries:[],cards:[],cardTxns:[],
 cari:[],cariTxns:[],staff:[],staffTxns:[],leaves:[],
 fixed:[],fixedLogs:[],tasks:[],notes:[],
 cheques:[],stock:[],stockTxns:[],assets:[],budgets:[],
 ai:{autoBrief:1},aiCache:{},user:{name:'',title:''},users:[],
 authPw:{user:'17fd087b70259c35a1e9964f1f572d19365638ee5a748a23f2deed0ae4e524af',super:'10ef0dde01b10f4f8136511007c06d729e6527de2866f624e945cbcc09d6047f'}, // SHA-256('lole123') / SHA-256('loles')
 auditLog:[], // v13: kritik olayların (giriş/çıkış, kullanıcı/kategori değişikliği, sıfırlama/geri yükleme) kaydı — kim, ne zaman, ne yaptı
 trash:[], // v15: silinen kayıtların 30 gün saklandığı çöp kutusu indeksi ({kind,id,label,deletedAt,deletedBy})
 cats:{gelir:['Satış Geliri','Diğer Gelir'],gider:['Hammadde & Malzeme','Personel','Kira','Fatura & Abonelik','Vergi & SGK','Pazarlama','Bakım & Onarım','Banka & Komisyon','Diğer Gider']}
});
var S=blankState();
var CO=null;
var PAGE='dash';
var saveT=null;
var SESSION=null; // v7: giriş yapan kullanıcı — sayfa yenilenince sıfırlanır, veriler her zaman ortak depoda kalır
var lastActivity=Date.now(); // v11: en son etkileşim zamanı (yalnızca bellekte, cihaza yazılmaz)
var SESSION_TIMEOUT_MS=48*60*60*1000; // 48 saat işlem yapılmazsa oturum otomatik kapanır
function markActivity(){ lastActivity=Date.now(); }
function checkSessionTimeout(){
 if(!SESSION) return;
 if(Date.now()-lastActivity>SESSION_TIMEOUT_MS){
  doLogout();
  toast('⏱ 48 saattir işlem yapılmadığı için oturum kapatıldı, tekrar giriş yapın');
 }
}

function safeParse(s){
 try{const j=JSON.parse(s);if(j&&Array.isArray(j.txns)&&Array.isArray(j.accounts))return j;}catch(e){}
 return null;
}
function withTimeout(p,ms){ // ortak depolama çağrısı yanıt vermezse sonsuza kadar beklemeyi önler
 return new Promise(function(resolve){
  var done=false;
  var t=setTimeout(function(){ if(!done){done=true;resolve(null);} },ms||5000);
  Promise.resolve(p).then(function(v){ if(!done){done=true;clearTimeout(t);resolve(v);} },function(){ if(!done){done=true;clearTimeout(t);resolve(null);} });
 });
}
function fixState(j){ // eksik alanları tamamla (sürüm geçişleri veri kaybetmesin)
 const b=blankState();
 for(const k of Object.keys(b)) if(j[k]===undefined) j[k]=b[k];
 if(!j.cats||!Array.isArray(j.cats.gelir)||!Array.isArray(j.cats.gider)) j.cats=b.cats;
 if(!j.meta) j.meta=b.meta;
 if(!Array.isArray(j.users)||!j.users.length){ // v7: kullanıcı listesi boşsa varsayılan süper yönetici oluştur (kilitlenmeyi önler)
  j.users=[{id:'u0',username:'erdinc',email:DEFAULT_ADMIN_EMAIL,role:'super',companies:'all',password:'10ef0dde01b10f4f8136511007c06d729e6527de2866f624e945cbcc09d6047f',addedAt:new Date().toISOString(),addedBy:'sistem'}];
 }
 (j.users||[]).forEach(function(u){ // v10: eski (yalnızca e-postalı) kayıtlar için otomatik kullanıcı adı türet, kimse dışarıda kalmasın
  if(!u.username){ u.username=String((u.email||'kullanici').split('@')[0]||'kullanici').toLowerCase().replace(/[^a-z0-9_.-]/g,'')||('u'+Math.random().toString(36).slice(2,7)); }
 });
 return j;
}
var loadSource='—'; // v24: bir önceki yüklemenin GERÇEKTE hangi kaynaktan geldiğini kalıcı olarak tutar (Ayarlar'da görünür) — kaçırılabilecek bir toast'a bağımlı kalmamak için
async function loadState(){
 if(!window.storage){ loadSource='depolama-yok→'+(EMBEDDED_SEED?'gömülü yedek':'boş'); S=fixState(EMBEDDED_SEED||S); return; } // bulut depolama yoksa (artifact henüz yayınlanmamış) — varsa gömülü yedekten, yoksa temiz başlar; cihaza yazılmaz
 let a=null;
 for(let attempt=0;attempt<3;attempt++){ // v18: geçici bir ağ/okuma hatasını "veri yok" ile karıştırmamak için 3 deneme
  try{ const r=await withTimeout(window.storage.get(skey(),isTeam()),5000); if(r&&r.value){a=safeParse(r.value);break;} }catch(e){}
  if(attempt<2) await new Promise(res=>setTimeout(res,700*(attempt+1)));
 }
 if(!a){ // 3 denemeden sonra hâlâ ana kayıt yok/bozuk → buluttaki tarihli yedeklerin en yenisini dene
  try{
   const hist=await listBackups();
   if(hist.length){
    const y=await loadBackupByDate(hist[0].date);
    if(y){loadSource='bulut-tarihli-yedek('+hist[0].date+')'; S=fixState(y); setTimeout(()=>toast('Ana kayıt okunamadı — '+dTR(hist[0].date)+' tarihli buluttaki yedekten geri yüklendi'),400); await dailyBackup(); return;}
   }
  }catch(e){}
  if(EMBEDDED_SEED){ // v19: hiçbir kanalda veri bulunamadı ama koda gömülü bir yedek var → önce onu kullan, hemen buluta da yaz
   loadSource='GÖMÜLÜ-YEDEK (bulut boş çıktı)';
   S=fixState(EMBEDDED_SEED);
   setTimeout(()=>toast('☁ Bulutta veri bulunamadı — koda gömülü son yedekten geri yüklendi. Lütfen kontrol edin.'),400);
   saveNow();
   return;
  }
  loadSource='BOŞ (hiçbir kaynakta veri bulunamadı)';
  S=fixState(S);
  // v18: sessizce boş başlamak yerine uyar — gerçekten ilk kullanımsa zararsız, ama bağlantı sorunuysa kullanıcıyı veri girmeden önce durdurur
  setTimeout(()=>toast('ℹ️ Kayıtlı veri bulunamadı. İlk kullanımınızsa normaldir — değilse, veri girmeden önce Ayarlar > "Depolama Bağlantısını Test Et" ile doğrulayın.'),500);
  return; // temiz başlangıç (varsayılan süper yönetici otomatik oluşturulur)
 }
 loadSource='bulut (normal)';
 S=fixState(a);
 purgeOldTrash();
 await dailyBackup();
}
/* ---------- YEDEK GEÇMİŞİ (v9 — TAMAMEN BULUTTA. Cihaza hiçbir şey otomatik yazılmaz.
   Cihaza kayıt YALNIZCA Ayarlar > "Yedek İndir / Panoya Kopyala" düğmelerine bilerek basıldığında olur. ---------- */
var BACKUP_KEEP_DAYS=14;
var lastBackupInfo=null; // bu oturumda yapılan son otomatik bulut yedeği (yalnızca bellekte tutulur, cihaza yazılmaz)
var STORAGE_CAP_BYTES=20*1024*1024; // Anthropic'in artifact başına sabit 20 MB sınırı
var storageWarnShown=false; // bu oturumda eşik uyarısı bir kez gösterildi mi
function computeStorageEstimate(){ // GERÇEK ölçüm değil — Anthropic kullanım sorgulama imkanı sunmuyor; canlı veri + günlük yedeklerden TAHMİN
 var liveSize=JSON.stringify(S).length;
 var backupsSize=liveSize*BACKUP_KEEP_DAYS; // her gün tam kopya alınıyor
 var total=liveSize+backupsSize;
 return {live:liveSize,backups:backupsSize,total:total,pct:total/STORAGE_CAP_BYTES*100};
}
function checkStorageWarning(){ // yalnızca gerçek bir kayıt başarılı olduğunda çağrılır (oturumda bir kez uyarır)
 var u=computeStorageEstimate();
 if(u.pct>=85&&!storageWarnShown){
  storageWarnShown=true;
  toast('⚠ Bulut depolama tahmini %'+u.pct.toFixed(0)+' dolu — Ayarlar\'dan detaya bakın');
 }
 return u;
}
function backupKey(dateISO){ return skey()+'-yedek-'+dateISO; }
async function dailyBackup(){ // günde bir kez, o günkü durumun tarihli bir kopyasını BULUTA yazar
 try{
  if(!window.storage) return;
  const t=todayISO();
  if(lastBackupInfo&&lastBackupInfo.date===t&&lastBackupInfo.ok) return; // bu oturumda bugün için zaten alındı
  const existing=await withTimeout(window.storage.get(backupKey(t),true),5000);
  if(existing&&existing.value){ lastBackupInfo={date:t,ok:true}; return; } // bugünün yedeği bulutta zaten var
  const snap=JSON.stringify(S);
  const res=await withTimeout(window.storage.set(backupKey(t),snap,true),5000);
  lastBackupInfo={date:t,ok:!!res};
  await pruneOldBackups();
 }catch(e){}
}
async function pruneOldBackups(){ // buluttaki son BACKUP_KEEP_DAYS günü aşan yedekleri sil (yalnızca bulut, cihazda zaten hiçbir şey yok)
 try{
  if(!window.storage||!window.storage.list) return;
  const prefix=skey()+'-yedek-';
  const r=await withTimeout(window.storage.list(prefix,true),5000);
  if(!r||!r.keys) return;
  const old=r.keys.filter(k=>{const d=k.slice(prefix.length);return /^\d{4}-\d{2}-\d{2}$/.test(d)&&daysDiff(d)<-BACKUP_KEEP_DAYS;});
  for(const k of old){ try{ await withTimeout(window.storage.delete(k,true),5000); }catch(e){} }
 }catch(e){}
}
async function listBackups(){ // yalnızca buluttaki tarihli yedekleri, azalan sırada döndürür
 try{
  if(!window.storage||!window.storage.list) return [];
  const prefix=skey()+'-yedek-';
  const r=await withTimeout(window.storage.list(prefix,true),5000);
  if(!r||!r.keys) return [];
  return r.keys.map(k=>({date:k.slice(prefix.length)})).filter(b=>/^\d{4}-\d{2}-\d{2}$/.test(b.date)).sort((a,b)=>a.date<b.date?1:-1);
 }catch(e){ return []; }
}
async function loadBackupByDate(dateISO){
 try{ if(window.storage){const r=await withTimeout(window.storage.get(backupKey(dateISO),true),5000); if(r&&r.value){const y=safeParse(r.value); if(y)return y;}} }catch(e){}
 return null;
}
async function openBackupList(){
 document.getElementById('modalBox').innerHTML='<div class="mh"><h3>🗄 Yedek Geçmişi</h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div><div class="mb"><div class="tiny" style="padding:6px 2px">Bulut taranıyor…</div></div>';
 document.getElementById('modalWrap').classList.add('on');
 const list=await listBackups();
 const body=document.getElementById('modalBox');
 if(!body||!document.getElementById('modalWrap').classList.contains('on'))return; // kullanıcı kapattıysa yükleme sonrası yazmayı atla
 if(!list.length){
  body.innerHTML='<div class="mh"><h3>🗄 Yedek Geçmişi</h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div><div class="mb"><p class="mut">Henüz otomatik bulut yedeği oluşmadı — bir sonraki uygulama açılışından itibaren burada birikmeye başlayacak.</p></div>';
  return;
 }
 const rows=list.map(b=>
  '<div class="rem"><span class="dot"></span><span>'+dTR(b.date)+'<br><span class="tiny">🌐 bulut</span></span><button class="btn sm gh" data-act="restoreFromDateAsk" data-arg="'+b.date+'">Geri Yükle</button></div>'
 ).join('');
 body.innerHTML='<div class="mh"><h3>🗄 Yedek Geçmişi <span class="tiny">son '+BACKUP_KEEP_DAYS+' gün · bulutta</span></h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div>'+
  '<div class="mb"><p class="mut" style="margin-bottom:10px">Uygulama her gün ilk açıldığında o günkü durumun bir kopyası otomatik olarak yalnızca buluta alınır — cihazda hiçbir kopya tutulmaz.</p>'+rows+'</div>';
}
function restoreFromDateAsk(dateISO){
 if(!isSuper())return;
 uiConfirm('Tüm veriler '+dTR(dateISO)+' tarihli yedekle DEĞİŞTİRİLECEK. Bu andaki veriler kaybolur (isterseniz önce "Yedek İndir" ile şu anki hâli dışa alın). Devam edilsin mi?',async function(){
  const y=await loadBackupByDate(dateISO);
  if(!y){toast('Yedek okunamadı');return;}
  S=fixState(y);logAudit('Bulut yedeğinden geri yüklendi',dateISO);
  saveNow();toast(dTR(dateISO)+' tarihli yedek geri yüklendi');goSelect();
 },{danger:1,title:'Yedeği Geri Yükle',yes:'Evet, Geri Yükle'});
}
var saveErr=false;
var dirty=false; // son değişiklik buluta başarıyla yazıldı mı — yalnızca bellekte tutulur, cihaza yazılmaz
var pendingSaves=0; // hâlâ yanıt bekleyen (veya yeniden denenen) bulut kaydı sayısı
var lastSaveFailed=false;
function updateSaveBadge(){
 var el=document.getElementById('saveBadge');
 if(!el)return;
 if(pendingSaves>0){ el.className='chip w'; el.textContent='⏳ Kaydediliyor…'; }
 else if(lastSaveFailed){ el.className='chip n'; el.textContent='⚠ Kaydedilemedi'; }
 else{ el.className='chip p'; el.textContent='✓ Kaydedildi'; }
}
function attemptCloudSave(tryNo){ // başarısız olursa artan aralıklarla en fazla 2 kez daha dener; her denemede EN GÜNCEL S gönderilir
 var j=JSON.stringify(S);
 try{
  withTimeout(window.storage.set(skey(),j,isTeam()),8000).then(function(res){
   if(res){
    pendingSaves=Math.max(0,pendingSaves-1);
    saveErr=false;lastSaveFailed=false;dirty=false;
    updateSaveBadge();
    checkStorageWarning();
   }else if(tryNo<2){
    setTimeout(function(){attemptCloudSave(tryNo+1);},800*(tryNo+1));
   }else{
    pendingSaves=Math.max(0,pendingSaves-1);
    lastSaveFailed=true;
    updateSaveBadge();
    if(!saveErr){saveErr=true;toast('⚠ Bulut kaydı başarısız! Ayarlar > Yedek İndir ile verinizi hemen dışa alın.');}
   }
  });
 }catch(err){ // v17: window.storage.set senkron hata fırlatırsa artık sessizce takılıp kalmıyor
  pendingSaves=Math.max(0,pendingSaves-1);
  lastSaveFailed=true;
  updateSaveBadge();
  var msg=(err&&err.message)?err.message:String(err);
  console.error('LOLE bulut kayıt hatası (attemptCloudSave):',err);
  if(!saveErr){saveErr=true;toast('⚠ Bulut kaydı hata verdi: '+msg);}
 }
}
function saveNow(){ // YALNIZCA buluta (ortak/çevrimiçi depo) kaydeder — cihaza otomatik hiçbir şey yazılmaz
 S.meta.saved=new Date().toISOString();
 if(!window.storage){
  if(!saveErr){saveErr=true;toast('⚠ Bulut depolama bulunamadı (artifact yayınlanmamış olabilir) — Ayarlar > Yedek İndir ile verinizi hemen dışa alın.');}
  return false;
 }
 pendingSaves++;
 updateSaveBadge();
 attemptCloudSave(0);
 return true;
}
function save(){
 dirty=true;
 clearTimeout(saveT);
 saveT=setTimeout(saveNow,150);
}
/* v17: İzole depolama testi — S state'inden bağımsız, ham window.storage API'sini dener ve TAM hatayı gösterir */
async function testStorage(){
 var out=document.getElementById('storageTestResult');
 if(out)out.textContent='⏳ Test çalışıyor…';
 try{
  if(!window.storage){
   if(out)out.textContent='❌ window.storage API mevcut değil. Bu genelde: (1) artifact henüz yayınlanmadığında, (2) dosya indirilip doğrudan açıldığında, ya da (3) başka bir sitede (GitHub Pages/Netlify vb.) barındırıldığında olur. Bu uygulama yalnızca claude.ai üzerinde, yayınlanmış hâliyle çalışır.';
   return;
  }
  var testKey='__lole_test_'+Date.now();
  var testVal='ping-'+Math.random().toString(36).slice(2);
  // v33: gerçek kayıt akışıyla birebir karşılaştırılabilir olsun diye 3 deneme + zengin hata detayı
  var setRes=null,lastErr=null,attempts=0;
  for(var i=0;i<3;i++){
   attempts=i+1;
   try{ setRes=await window.storage.set(testKey,testVal,false); lastErr=null; if(setRes)break; }
   catch(e){ lastErr=e; }
   if(i<2) await new Promise(function(res){setTimeout(res,600*(i+1));});
  }
  function errDetail(e){
   if(!e)return '';
   var parts=[];
   if(e.name)parts.push('ad:'+e.name);
   if(e.message)parts.push('mesaj:'+e.message);
   if(e.code!==undefined)parts.push('kod:'+e.code);
   if(e.status!==undefined)parts.push('durum:'+e.status);
   return parts.length?(' ['+parts.join(', ')+']'):(' ['+String(e)+']');
  }
  if(!setRes){
   if(out)out.textContent='❌ Yazma başarısız ('+attempts+' denemede) — '+(lastErr?'istisna fırlattı'+errDetail(lastErr):'set() boş/null döndürdü, istisna yok')+'. Cihaz: '+(navigator.userAgent||'').slice(0,90);
   console.error('LOLE depolama testi — yazma başarısız:',lastErr);
   return;
  }
  var getRes=await window.storage.get(testKey,false);
  if(!getRes||getRes.value!==testVal){ if(out)out.textContent='❌ Okuma başarısız ya da yazılan değerle eşleşmiyor ('+attempts+'. denemede yazma başarılı olmuştu).'; return; }
  try{await window.storage.delete(testKey,false);}catch(e){}
  if(out)out.textContent='✅ Başarılı ('+attempts+'. denemede) — yazma/okuma/silme çalışıyor. Sorun devam ediyorsa asıl kayıt anahtarına özgü olabilir; bir işlem ekleyip üstteki "Kaydedildi" rozetine bakın.';
 }catch(err){
  var msg=(err&&err.message)?err.message:String(err);
  var extra=(err&&err.name)?(' (ad: '+err.name+')'):'';
  if(out)out.textContent='❌ İstisna fırlattı: '+msg+extra+'. Cihaz: '+(navigator.userAgent||'').slice(0,90);
  console.error('LOLE depolama testi hatası:',err);
 }
}
/* Sekme kapanırken / arka plana alınırken bekleyen değişiklikleri buluta yazmayı dener.
   beforeunload'da ayrıca: kayıt hâlâ uçuşta veya başarısızsa, tarayıcının kendi
   "kapatmak istediğinize emin misiniz" uyarısını tetikler — bu, cihazda hiçbir şey
   tutmadan yine de kullanıcıya son bir fırsat/uyarı verir (localStorage'a alternatif). */
window.addEventListener('pagehide',()=>{ if(dirty){clearTimeout(saveT);saveNow();} });
window.addEventListener('beforeunload',(e)=>{
 if(dirty){clearTimeout(saveT);saveNow();}
 if(pendingSaves>0||lastSaveFailed){
  e.preventDefault();
  e.returnValue='Kaydedilmemiş bir değişiklik olabilir. Birkaç saniye bekleyip tekrar kapatmayı deneyin (veya Ayarlar > Yedek İndir ile dışa alın).';
  return e.returnValue;
 }
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&dirty){clearTimeout(saveT);saveNow();}});

const nid=()=> 'r'+(S.seq++).toString(36)+Date.now().toString(36).slice(-4);
function stampCreate(rec){ rec.createdBy=SESSION?SESSION.username:''; rec.createdAt=new Date().toISOString(); return rec; } // v16: kaydı kimin oluşturduğunu damgalar
function stampUpdate(rec,orig){ rec.createdBy=orig?orig.createdBy:rec.createdBy; rec.createdAt=orig?orig.createdAt:rec.createdAt; rec.updatedBy=SESSION?SESSION.username:''; rec.updatedAt=new Date().toISOString(); return rec; }

/* ---------- YARDIMCILAR ---------- */
const TRY=new Intl.NumberFormat('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt=n=>TRY.format(+n||0)+' ₺';
const fmt0=n=>new Intl.NumberFormat('tr-TR',{maximumFractionDigits:0}).format(Math.round(+n||0))+' ₺';
const fmtBytes=n=>{n=+n||0;if(n>=1024*1024)return (n/1024/1024).toFixed(2)+' MB';if(n>=1024)return (n/1024).toFixed(0)+' KB';return n+' B';};
const kfmt=n=>{n=+n||0;const a=Math.abs(n);if(a>=1e6)return (n/1e6).toLocaleString('tr-TR',{maximumFractionDigits:1})+' M';if(a>=1e3)return (n/1e3).toLocaleString('tr-TR',{maximumFractionDigits:0})+' B';return Math.round(n).toString();};
const todayISO=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const monthISO=()=>todayISO().slice(0,7);
const dTR=iso=>{if(!iso)return'';const[y,m,d]=iso.split('-');return d+'.'+m+'.'+y;};
const AYLAR=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const mTR=p=>{const[y,m]=p.split('-');return AYLAR[+m-1]+' '+y;};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const daysDiff=iso=>Math.round((new Date(iso+'T12:00')-new Date(todayISO()+'T12:00'))/86400000);
const addDays=(iso,n)=>{const d=new Date(iso+'T12:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10);};
const clampDay=(y,m,day)=>{const last=new Date(y,m,0).getDate();return y+'-'+String(m).padStart(2,'0')+'-'+String(Math.min(day,last)).padStart(2,'0');};
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('on');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('on'),2400);}
const byCo=(arr,co)=>arr.filter(x=>x.co===co&&!x.deletedAt);
const coName=id=>id==='grup'?'LOLE GRUP':(COMPANIES.find(c=>c.id===id)||{}).name||'';
window.addEventListener('error',e=>{try{toast('Hata: '+e.message);}catch(_){}});

/* ---------- MERKEZİ OLAY SİSTEMİ ----------
 Bazı önizleme ortamları elementlerin üzerine yazılmış onclick komutlarını (CSP) engeller.
 Bu yüzden TÜM etkileşim data-act öznitelikleriyle tek bir dinleyiciden yürütülür. */
document.addEventListener('click',function(e){
 markActivity();
 var t=e.target;
 var el=(t&&t.closest)?t.closest('[data-act]'):null;
 if(!el)return;
 var fn=window[el.getAttribute('data-act')];
 if(typeof fn!=='function')return;
 if(el.tagName==='BUTTON'&&el.getAttribute('type')!=='submit')e.preventDefault();
 var args=el.hasAttribute('data-arg')?el.getAttribute('data-arg').split('~'):[];
 try{fn.apply(null,args);}catch(err){try{toast('Hata: '+err.message);}catch(_){}}
});
document.addEventListener('change',function(e){
 markActivity();
 var f=e.target&&e.target.getAttribute?e.target.getAttribute('data-actv'):null;
 if(!f||typeof window[f]!=='function')return;
 try{window[f](e.target.value,e.target);}catch(err){try{toast('Hata: '+err.message);}catch(_){}}
});
document.addEventListener('submit',function(e){
 if(e.target&&e.target.id==='mForm')submitModal(e);
});
function printPage(){try{window.print();}catch(e){}}
function moreGo(p){document.getElementById('moreSheet').classList.remove('on');if(p==='_select')goSelect();else go(p);}
function closeSheet(){document.getElementById('moreSheet').classList.remove('on');}

/* ---------- GRAFİK MOTORU (SVG) ---------- */
const PAL=['#0f4c5c','#e07a3f','#2a9d8f','#a24a68','#5b7bb4','#c9a227','#7d5ba6','#3f8f5f','#b45f4d','#64748b'];
const hashColor=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%997;return PAL[h%PAL.length];};

/* Halka grafik + açıklama listesi */
function chartDonut(items,centerLabel){
 items=items.filter(i=>i.value>0);
 const tot=items.reduce((s,i)=>s+i.value,0);
 if(tot<=0)return '<div class="empty">Gösterilecek veri yok</div>';
 const R=52,C=2*Math.PI*R;let off=C*0.25,segs='';
 items.forEach((it,i)=>{const len=it.value/tot*C;
  segs+=`<circle r="${R}" cx="70" cy="70" fill="none" stroke="${it.color||PAL[i%PAL.length]}" stroke-width="21" stroke-dasharray="${len-1.5} ${C-len+1.5}" stroke-dashoffset="${off}"><title>${esc(it.label)}: ${fmt0(it.value)}</title></circle>`;
  off-=len;});
 const legend=items.map((it,i)=>`<div class="lgRow"><i style="background:${it.color||PAL[i%PAL.length]}"></i><span class="lgL">${esc(it.label)}</span><b>${fmt0(it.value)}</b><span class="lgP">%${(it.value/tot*100).toFixed(1)}</span></div>`).join('');
 return `<div class="donutWrap"><svg viewBox="0 0 140 140" class="donut">${segs}
   <text x="70" y="66" text-anchor="middle" style="font-size:15px;font-weight:800;fill:var(--ink)">${kfmt(tot)}</text>
   <text x="70" y="82" text-anchor="middle" style="font-size:8.5px;fill:var(--ink3);letter-spacing:.05em">${esc(centerLabel||'TOPLAM ₺')}</text>
  </svg><div class="lgCol">${legend}</div></div>`;
}

/* Alan / çizgi grafik (çok serili) */
function chartArea(series,labels,h){
 h=h||210;
 const W=640,pad=42,padB=26,padT=12;
 const n=Math.max(2,...series.map(s=>s.values.length));
 const max=Math.max(1,...series.map(s=>Math.max(...s.values)));
 const X=i=>pad+i*(W-pad-14)/(n-1);
 const Y=v=>h-padB-(v/max)*(h-padB-padT);
 let grid='';
 for(let i=0;i<=4;i++){const v=max*i/4,y=Y(v);
  grid+=`<line x1="${pad}" y1="${y}" x2="${W-14}" y2="${y}" stroke="#e6eaf1" stroke-width="1"/><text x="${pad-6}" y="${y+3}" text-anchor="end" style="font-size:9.5px;fill:#94a0b0">${kfmt(v)}</text>`;}
 let paths='';
 for(const s of series){
  const pts=s.values.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ');
  paths+=`<polygon points="${X(0).toFixed(1)},${(h-padB).toFixed(1)} ${pts} ${X(s.values.length-1).toFixed(1)},${(h-padB).toFixed(1)}" fill="${s.color}" opacity="0.13"/>
   <polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
  s.values.forEach((v,i)=>{paths+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" fill="${s.color}"><title>${esc(labels[i]||'')}: ${fmt0(v)}</title></circle>`;});
 }
 const step=Math.ceil(n/9);
 let xl='';
 labels.forEach((l,i)=>{if(i%step===0||i===n-1)xl+=`<text x="${X(i).toFixed(1)}" y="${h-8}" text-anchor="middle" style="font-size:9.5px;fill:#94a0b0">${esc(l)}</text>`;});
 const lg=series.map(s=>`<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('');
 return `<svg viewBox="0 0 ${W} ${h}" class="chartSvg">${grid}${paths}${xl}</svg><div class="legend">${lg}</div>`;
}

/* Dikey çubuk grafik (gruplu, değer etiketli) */
function chartVBars(groups,h){
 h=h||200;
 const max=Math.max(1,...groups.flatMap(g=>g.bars.map(b=>b.value)));
 return `<div class="vb" style="height:${h}px">`+groups.map(g=>
  `<div class="vbG"><div class="vbBars">`+
   g.bars.map(b=>{const pct=Math.max(1.5,b.value/max*100);
    return `<div class="vbB" title="${esc(b.name||'')}: ${fmt0(b.value)}"><span class="vbV">${kfmt(b.value)}</span><i style="height:${pct}%;background:${b.color}"></i></div>`;}).join('')+
  `</div><span class="vbL">${esc(g.label)}</span></div>`).join('')+`</div>`;
}

/* Yatay çubuk listesi */
function chartHBars(items,color){
 const max=Math.max(1,...items.map(i=>Math.abs(i.value)));
 if(!items.length)return '<div class="empty">Veri yok</div>';
 return items.map(i=>`<div class="hb"><div class="hbT"><span>${esc(i.label)}</span><b>${fmt0(i.value)}</b></div>
  <div class="hbTrack"><div class="hbFill" style="width:${Math.abs(i.value)/max*100}%;background:${i.color||color||'var(--acc)'}"></div></div></div>`).join('');
}

/* Segment sekme kontrolü */
function seg(items,cur,fn){return '<div class="seg">'+items.map(i=>`<button class="${i[0]===cur?'on':''}" data-act="${fn}" data-arg="${i[0]}">${i[1]}${i[2]!==undefined?'<span class=\"ct\">'+i[2]+'</span>':''}</button>`).join('')+'</div>';}

/* Mini eğilim çizgisi */
function spark(values,color){
 if(!values||values.length<2)return '';
 const min=Math.min(...values),max=Math.max(...values),rng=(max-min)||1;
 const pts=values.map((v,i)=>(i/(values.length-1)*100).toFixed(1)+','+(26-(v-min)/rng*22).toFixed(1)).join(' ');
 return `<svg viewBox="0 0 100 30" preserveAspectRatio="none" class="spark"><polyline points="${pts}" fill="none" stroke="${color||'var(--acc)'}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}

/* ---------- HESAPLAMALAR ---------- */
function accBalance(a){
 let b=+a.opening||0;
 for(const t of S.txns){
  if(t.co!==a.co||t.deletedAt)continue;
  if(t.type==='gelir'&&t.accId===a.id)b+=+t.amount;
  else if(t.type==='gider'&&t.accId===a.id)b-=+t.amount;
  else if(t.type==='virman'){if(t.accId===a.id)b-=+t.amount;if(t.accId2===a.id)b+=+t.amount;}
 }
 return b;
}
function accRangeFlow(a,from,to){ // seçili tarih aralığında bir hesabın dönem başı/giriş/çıkış/dönem sonu özeti
 let opening=+a.opening||0,into=0,out=0;
 for(const t of S.txns){
  if(t.co!==a.co||t.deletedAt)continue;
  let d=0;
  if(t.type==='gelir'&&t.accId===a.id)d=+t.amount;
  else if(t.type==='gider'&&t.accId===a.id)d=-t.amount;
  else if(t.type==='virman'){if(t.accId===a.id)d-=+t.amount;if(t.accId2===a.id)d+=+t.amount;}
  if(!d)continue;
  if(t.date<from)opening+=d;
  else if(t.date<=to){ if(d>0)into+=d; else out+=-d; }
 }
 return {opening,into,out,closing:opening+into-out};
}
function accSeries(a,days){ // son N gün, gün sonu bakiyeleri (tek geçiş)
 days=days||30;
 const start=addDays(todayISO(),-(days-1));
 let base=+a.opening||0;const delta={};
 for(const t of S.txns){
  if(t.co!==a.co||t.deletedAt)continue;
  let d=0;
  if(t.type==='gelir'&&t.accId===a.id)d=+t.amount;
  else if(t.type==='gider'&&t.accId===a.id)d=-t.amount;
  else if(t.type==='virman'){if(t.accId===a.id)d-= +t.amount;if(t.accId2===a.id)d+= +t.amount;}
  if(!d)continue;
  if(t.date<start)base+=d; else delta[t.date]=(delta[t.date]||0)+d;
 }
 const out=[];let run=base;
 for(let i=0;i<days;i++){const dt=addDays(start,i);run+=delta[dt]||0;out.push(run);}
 return out;
}
function dailySeries(co,days){ // gelir/gider günlük serileri (tek geçiş)
 const start=addDays(todayISO(),-(days-1));
 const g={},x={};
 for(const t of S.txns){
  if(t.co!==co||t.type==='virman'||t.date<start||t.deletedAt)continue;
  if(t.type==='gelir')g[t.date]=(g[t.date]||0)+ +t.amount;
  else x[t.date]=(x[t.date]||0)+ +t.amount;
 }
 const labels=[],gv=[],xv=[];
 for(let i=0;i<days;i++){const dt=addDays(start,i);labels.push(dt.slice(8)+'.'+dt.slice(5,7));gv.push(g[dt]||0);xv.push(x[dt]||0);}
 return {labels,gelir:gv,gider:xv};
}
function monthSeries(co,n,cat){ // son N ay {p,label,gelir,gider}
 const out=[];
 for(let i=n-1;i>=0;i--){
  const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);
  const p=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  let g=0,x=0;
  for(const t of S.txns){
   if(t.co!==co||t.type==='virman'||!t.date.startsWith(p)||t.deletedAt)continue;
   if(cat&&t.cat!==cat)continue;
   if(t.type==='gelir')g+=+t.amount;else x+=+t.amount;
  }
  out.push({p,label:AYLAR[+p.slice(5)-1].slice(0,3),gelir:g,gider:x});
 }
 return out;
}
function cariBalance(c){
 let b=+c.opening||0;
 for(const t of S.cariTxns) if(t.cariId===c.id&&!t.deletedAt) b+= t.type==='borc'? +t.amount : -t.amount;
 return b;
}
function cardDebt(card){
 let b=0;
 for(const t of S.cardTxns) if(t.cardId===card.id&&!t.deletedAt) b+= t.type==='harcama'? +t.amount : -t.amount;
 return b;
}
function nextDue(day){
 const t=new Date();let y=t.getFullYear(),m=t.getMonth()+1;
 let d=clampDay(y,m,day);
 if(daysDiff(d)<0){m++;if(m>12){m=1;y++;}d=clampDay(y,m,day);}
 return d;
}
function sumRange(co,from,to){
 let g=0,x=0,byCat={},byCatG={};
 for(const t of S.txns){
  if(t.co!==co||t.type==='virman'||t.deletedAt)continue;
  if(t.date<from||t.date>to)continue;
  if(t.type==='gelir'){g+=+t.amount;byCatG[t.cat||'Diğer']=(byCatG[t.cat||'Diğer']||0)+ +t.amount;}
  else {x+=+t.amount; byCat[t.cat||'Diğer']=(byCat[t.cat||'Diğer']||0)+ +t.amount;}
 }
 return {gelir:g,gider:x,net:g-x,byCat,byCatG};
}
function kdvSummary(co,from,to){ // KDV tahsil edilen (gelir) / ödenen (gider) — tutarlar KDV dahil girildiği varsayılır: kdv=tutar×oran/(100+oran)
 let tahsil=0,odenen=0; const byRate={};
 for(const t of S.txns){
  if(t.co!==co||t.type==='virman'||t.deletedAt||!t.vat)continue;
  if(t.date<from||t.date>to)continue;
  const v=+t.vat||0; if(!v)continue;
  const kdvAmt=+t.amount*v/(100+v);
  if(t.type==='gelir')tahsil+=kdvAmt; else odenen+=kdvAmt;
  const key=(t.type==='gelir'?'Tahsil ':'Ödenen ')+'%'+v;
  byRate[key]=(byRate[key]||0)+kdvAmt;
 }
 return {tahsil,odenen,net:tahsil-odenen,byRate};
}
function prevPeriodOf(from,to){ // seçili dönemle aynı uzunlukta, hemen öncesindeki dönem (karşılaştırma için)
 const span=Math.round((new Date(to+'T12:00')-new Date(from+'T12:00'))/86400000)+1;
 const pTo=addDays(from,-1);
 return {from:addDays(pTo,-(span-1)),to:pTo};
}
function pctChange(cur,prev){ if(!prev)return cur?100:0; return (cur-prev)/Math.abs(prev)*100; }

/* ---------- HATIRLATICILAR ---------- */
function reminders(co){
 const out=[];
 for(const c of byCo(S.cards,co)){const debt=cardDebt(c);if(debt<=0)continue;const d=nextDue(+c.dueDay);const df=daysDiff(d);if(df<=10)out.push({d,df,t:'Kredi kartı: '+c.name+' son ödeme',a:debt});}
 const per=monthISO();
 for(const f of byCo(S.fixed,co)){
  const paid=S.fixedLogs.some(l=>l.fixedId===f.id&&l.period===per);
  if(paid)continue;
  const d=nextDue(+f.payDay);const df=daysDiff(d);
  if(df<=12)out.push({d,df,t:({kira:'Kira',vergi:'Vergi',sgk:'SGK',fatura:'Fatura'})[f.type]+': '+f.name,a:+f.amount});
 }
 for(const t of S.cariTxns){
  if(t.co!==co||!t.vade)continue;const df=daysDiff(t.vade);
  if(df<=7){const c=S.cari.find(x=>x.id===t.cariId)||{};
   out.push({d:t.vade,df,t:(t.type==='borc'?'Tahsilat vadesi: ':'Ödeme vadesi: ')+(c.name||'?'),a:+t.amount});}
 }
 for(const p of S.posEntries){
  if(p.co!==co||p.status!=='bekliyor')continue;const df=daysDiff(p.settleDate);
  if(df<=3)out.push({d:p.settleDate,df,t:'POS hesaba geçiş: '+((S.pos.find(x=>x.id===p.posId)||{}).name||''),a:+p.net});
 }
 for(const c of S.cheques){
  if(c.co!==co||c.durum!=='portfoy')continue;const df=daysDiff(c.vade);
  if(df<=7)out.push({d:c.vade,df,t:(c.tip==='alinan'?'Çek tahsil vadesi: ':'Çek ödeme vadesi: ')+c.kisi,a:+c.tutar});
 }
 for(const it of S.stock){
  if(it.co!==co)continue;const q=stockQty(it);
  if(+(it.min||0)>0&&q<=+it.min)out.push({d:todayISO(),df:0,t:'Kritik stok: '+it.name+' ('+q+' '+(it.unit||'')+' kaldı)',a:null});
 }
 for(const g of S.tasks){
  if(g.co!==co||g.status==='tamam')continue;const df=daysDiff(g.due);
  if(df<=3)out.push({d:g.due,df,t:'Görev: '+g.title+(g.who?' ('+g.who+')':''),a:null});
 }
 out.sort((a,b)=>a.d<b.d?-1:1);
 return out;
}
function remClass(df){return df<=0?'d-red':df<=3?'d-org':'d-yel';}
function remLbl(df){return df<0?Math.abs(df)+' gün gecikti':df===0?'BUGÜN':df===1?'yarın':df+' gün sonra';}

/* ---------- GEZİNME ---------- */
const PAGES=[
 {id:'dash', ic:'⌂', t:'Ana Sayfa'},
 {id:'ai',   ic:'✦', t:'AI Asistan'},
 {id:'acc',  ic:'🏦',t:'Banka & Kasa'},
 {id:'tx',   ic:'⇅', t:'Gelir - Gider'},
 {id:'pos',  ic:'💳',t:'POS İşlemleri'},
 {id:'card', ic:'💠',t:'Kredi Kartları'},
 {id:'cari', ic:'👥',t:'Cari Hesaplar'},
 {id:'staff',ic:'🧑‍🍳',t:'Personel & Maaş'},
 {id:'fixed',ic:'📅',t:'Sabit Ödemeler'},
 {id:'cek',  ic:'🧾',t:'Çek & Senet'},
 {id:'stok', ic:'📦',t:'Stok Takibi'},
 {id:'asset',ic:'🏷',t:'Demirbaş'},
 {id:'budget',ic:'🎯',t:'Bütçe Kontrolü'},
 {id:'rep',  ic:'📊',t:'Raporlar'},
 {id:'task', ic:'✔', t:'Görev & Duyuru'},
 {id:'set',  ic:'⚙', t:'Ayarlar'}
];
function goSelect(){CO=null;document.getElementById('app').classList.remove('on');document.getElementById('selectScreen').style.display='flex';renderSelect();}
function renderSelect(){
 const g=document.getElementById('coGrid');
 let h='';
 for(const c of COMPANIES){
  if(!canAccessCo(c.id))continue;
  const accs=byCo(S.accounts,c.id);let bal=0;for(const a of accs)bal+=accBalance(a);
  const t=sumRange(c.id,todayISO(),todayISO());
  h+=`<button class="coCard" style="--cc:${c.color}" data-act="enterCo" data-arg="${c.id}">
    <div class="nm">${c.name}</div><div class="tp">${c.tip}</div>
    <div class="bal">Nakit + Banka <b>${fmt0(bal)}</b><span class="tiny">Bugünkü ciro: ${fmt0(t.gelir)}</span></div></button>`;
 }
 if(canAccessCo('grup')){
  h+=`<button class="coCard grup" data-act="enterCo" data-arg="grup">
   <div class="nm">LOLE GRUP</div><div class="tp">${GRUP.tip}</div>
   <div class="bal">4 şirket karşılaştırmalı<b>Konsolide Rapor →</b></div></button>`;
 }
 g.innerHTML=h||'<p class="tiny" style="color:#aab4c9;grid-column:1/-1;text-align:center">Henüz erişiminiz olan bir şirket yok. Yöneticinizle iletişime geçin.</p>';
 var uh=document.getElementById('uHello');
 if(uh)uh.textContent=(S.user&&S.user.name)?('👤 Hoş geldiniz, '+S.user.name):'👤 Adınızı tanıtın';
 var sh=document.getElementById('sessHello');
 if(sh)sh.innerHTML=SESSION?('Giriş yapan: <b>'+esc(SESSION.username)+'</b>'+(SESSION.role==='super'?' <span class="chip w">Süper Yönetici</span>':' <span class="chip g">Kullanıcı</span>')+' &nbsp;·&nbsp; <button data-act="doLogout" style="text-decoration:underline;color:#c9d1e3">Çıkış Yap</button>'):'';
 var bc=document.getElementById('sysBackupCenter');
 if(bc)bc.innerHTML=isSuper()?
  `<div style="width:100%;max-width:560px;margin:22px auto 0;text-align:left;background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.09);border-radius:20px;padding:22px 24px;backdrop-filter:blur(6px);color:#eef1f7;animation:pop .5s both">
    <h2 style="font-size:14.5px;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:8px">🗄 Veri Yedekleme Merkezi</h2>
    <p style="font-size:12.5px;color:#aab4c9;margin-bottom:14px;line-height:1.5">Tek dosya, TÜM şirketler: ${COMPANIES.map(c=>c.name).join(' · ')}. Şirket bazlı değil, sistem geneli — hangi şirketi seçtiğinizin önemi yok.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
     <button class="btn" data-act="dlBackup">⬇ Sistem Yedeği Al (tüm şirketler)</button>
     <button class="btn gh" data-act="pickBackupFile" data-arg="upFileSys">⬆ Sistem Yedeğini Yükle</button>
    </div>
    <input type="file" id="upFileSys" accept=".json" style="display:none" data-actv="upBackupPick">
    <p style="font-size:11px;margin-top:10px;color:#8492ac">⚠ Yükleme, mevcut TÜM şirketlerin verisinin üzerine yazar. Yüklemeden önce güncel bir yedek almanız önerilir.</p>
   </div>`:'';
}
function enterCo(id){
 if(!canAccessCo(id)){toast('Bu şirkete erişim yetkiniz yok');return;}
 CO=id;
 document.body.dataset.co=id;
 document.getElementById('selectScreen').style.display='none';
 document.getElementById('app').classList.add('on');
 document.getElementById('sideCo').textContent=coName(id);
 buildNav();
 go(id==='grup'?'grup':'dash');
}
function buildNav(){
 const pages= CO==='grup'
   ? [{id:'grup',ic:'📊',t:'Grup Raporu'},{id:'set',ic:'⚙',t:'Ayarlar'}]
   : PAGES;
 document.getElementById('sideNav').innerHTML=
  pages.map(p=>`<button data-p="${p.id}" data-act="go" data-arg="${p.id}"><span class="ic">${p.ic}</span>${p.t}</button>`).join('')
  +`<button data-act="globalSearch"><span class="ic">🔍</span>Genel Arama</button>`;
 const mainTabs= CO==='grup'
  ? [{id:'grup',ic:'📊',t:'Rapor'},{id:'set',ic:'⚙',t:'Ayarlar'}]
  : [{id:'dash',ic:'⌂',t:'Ana Sayfa'},{id:'tx',ic:'⇅',t:'İşlemler'},{id:'_add',ic:'+',t:''},{id:'rep',ic:'📊',t:'Raporlar'},{id:'_more',ic:'☰',t:'Menü'}];
 document.getElementById('bnavIn').innerHTML=mainTabs.map(p=>
  p.id==='_add'?`<button class="fab" data-act="quickAdd">+</button>`
  :`<button data-p="${p.id}" data-act="${p.id==='_more'?'openMore':'go'}" data-arg="${p.id==='_more'?'':p.id}"><span class="ic">${p.ic}</span>${p.t}</button>`).join('');
 document.getElementById('moreIn').innerHTML=
  (CO==='grup'?[]:PAGES).map(p=>`<button data-act="moreGo" data-arg="${p.id}"><span class="ic">${p.ic}</span>${p.t}</button>`).join('')
  +`<button data-act="globalSearch"><span class="ic">🔍</span>Genel Arama</button><button data-act="moreGo" data-arg="_select"><span class="ic">⇄</span>Şirket Değiştir</button>`;
}
function openMore(){document.getElementById('moreSheet').classList.add('on');}
function go(p){
 PAGE=p;
 document.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
 const R={dash:rDash,ai:rAi,acc:rAcc,tx:rTx,pos:rPos,card:rCard,cari:rCari,staff:rStaff,fixed:rFixed,cek:rCek,stok:rStock,asset:rAsset,budget:rBudget,rep:rRep,task:rTask,set:rSet,grup:rGrup};
 (R[p]||rDash)();
 updateSaveBadge();
 try{window.scrollTo(0,0);}catch(e){}
}
function topbar(title,btnHtml){
 return `<div class="topbar"><div class="tt"><span class="spine"></span><div style="position:relative">
  <div class="eyebrow" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><button class="coSwitch" data-act="toggleCoMenu"><span class="dot"></span>${coName(CO)} ▾</button><span class="hidem">${dTR(todayISO())}</span>${isTeam()?'<span class="chip w" title="Ekip modu — ortak veri">🌐 Ekip</span>':''}<span id="saveBadge" class="chip g" title="Bulut kayıt durumu">✓ Kaydedildi</span></div>
  ${coMenuHtml()}
  <h1>${title}</h1></div></div>
  <div class="tb-actions"><button class="userChip" data-act="userForm" title="Profili düzenle">👤 ${esc(userName())}</button>${btnHtml||''}</div></div>`;
}

/* ---------- MODAL FORM & ONAY (tarayıcı confirm/prompt KULLANILMAZ) ---------- */
var modalCb=null,modalFields=null;
function parseAmt(v){ // "1.500,75" / "1500.75" / "1500,5" / "1500" hepsini kabul et
 v=String(v==null?'':v).trim().replace(/\s|₺|TL/gi,'');
 if(v==='')return NaN;
 if(v.includes(',')&&v.includes('.')) v=v.replace(/\./g,'').replace(',','.');
 else if(v.includes(',')) v=v.replace(',','.');
 return parseFloat(v);
}
function openForm(title,fields,onSubmit,init){
 init=init||{};
 modalCb=onSubmit;
 modalFields=[];
 for(const f of fields){ if(f.row)modalFields.push(...f.row); else modalFields.push(f); }
 const body=fields.map(f=>{
  if(f.row) return '<div class="frow">'+f.row.map(x=>fldHtml(x,init)).join('')+'</div>';
  return fldHtml(f,init);
 }).join('');
 /* ÖNEMLİ: <form> KULLANILMAZ — sandbox ortamlarında form gönderimi engellendiği için
    kaydetme tamamen düğme + betikle yapılır. */
 document.getElementById('modalBox').innerHTML=
  `<div class="mh"><h3>${title}</h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div>
   <div class="mb"><div id="mForm">${body}</div></div>
   <div class="mf"><button type="button" class="btn gh" data-act="closeModal">Vazgeç</button><button type="button" class="btn" id="mSave" data-act="doSubmit">Kaydet</button></div>`;
 const fEl=document.getElementById('mForm');
 fEl.addEventListener('submit',submitModal); // eski test/entegrasyon uyumu
 fEl.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target&&e.target.tagName!=='TEXTAREA'){e.preventDefault();doSubmit();} });
 document.getElementById('mSave').onclick=doSubmit; // delegasyona ek doğrudan bağ (çifte güvence)
 document.getElementById('modalWrap').classList.add('on');
 setTimeout(()=>{const el=document.querySelector('#mForm input,#mForm select');if(el)try{el.focus();}catch(e){}},60);
}
function fldHtml(f,init){
 const v=init[f.name]!==undefined?init[f.name]:(f.def!==undefined?f.def:'');
 let inp='';
 if(f.type==='select') inp=`<select name="${f.name}">${(f.opts||[]).map(o=>{const val=Array.isArray(o)?o[0]:o,lbl=Array.isArray(o)?o[1]:o;return `<option value="${esc(val)}" ${String(val)===String(v)?'selected':''}>${esc(lbl)}</option>`;}).join('')}</select>`;
 else if(f.type==='textarea') inp=`<textarea name="${f.name}" rows="3">${esc(v)}</textarea>`;
 else if(f.type==='number') inp=`<input name="${f.name}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v)}" placeholder="${esc(f.ph||'0')}">`;
 else if(f.type==='checks'){const arr=Array.isArray(v)?v:[];inp=`<div class="checkGrp">${(f.opts||[]).map(o=>{const val=Array.isArray(o)?o[0]:o,lbl=Array.isArray(o)?o[1]:o;return `<label class="ckOpt"><input type="checkbox" name="${f.name}" value="${esc(val)}" ${arr.indexOf(val)!==-1?'checked':''}> ${esc(lbl)}</label>`;}).join('')}</div>`;}
 else inp=`<input name="${f.name}" type="${f.type||'text'}" value="${esc(v)}" placeholder="${esc(f.ph||'')}">`;
 return `<div class="fld"><label>${f.label}${f.req?' *':''}</label>${inp}</div>`;
}
function doSubmit(){
 const box=document.getElementById('mForm');
 if(!box||!modalCb)return;
 const o={};let bad=null;
 for(const f of (modalFields||[])){
  if(f.type==='checks'){
   const els=box.querySelectorAll('[name="'+f.name+'"]:checked');
   o[f.name]=Array.prototype.map.call(els,function(x){return x.value;});
   continue;
  }
  const el=box.querySelector('[name="'+f.name+'"]');
  if(!el)continue;
  el.style.borderColor='';
  let val=el.value;
  if(f.type==='number'){
   const n=parseAmt(val);
   if(val!==''&&isNaN(n)){bad=bad||[f,el,'sayı olmalı'];}
   else if(f.req&&(val===''||isNaN(n))){bad=bad||[f,el,'zorunlu'];}
   else if(!isNaN(n)&&f.min!==undefined&&n<+f.min){bad=bad||[f,el,'en az '+f.min+' olmalı'];}
   val=isNaN(n)?'':n;
  }else if(f.req&&String(val).trim()===''){bad=bad||[f,el,'zorunlu'];}
  o[f.name]=val;
 }
 if(bad){
  bad[1].style.borderColor='var(--neg)';
  try{bad[1].focus();}catch(e){}
  toast('"'+bad[0].label.replace(/\s*\(.*\)/,'')+'" alanı '+bad[2]);
  return;
 }
 const cb=modalCb;
 closeModal();
 cb(o);
}
function submitModal(e){ if(e&&e.preventDefault)e.preventDefault(); doSubmit(); return false; }
function closeModal(){document.getElementById('modalWrap').classList.remove('on');modalCb=null;modalFields=null;}
function uiConfirm(msg,onYes,opt){
 opt=opt||{};
 document.getElementById('modalBox').innerHTML=
  `<div class="mh"><h3>${esc(opt.title||'Onay')}</h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div>
   <div class="mb"><p style="font-size:14px;line-height:1.55">${esc(msg)}</p></div>
   <div class="mf"><button class="btn gh" data-act="closeModal">Vazgeç</button><button class="btn ${opt.danger?'solidDng':''}" id="cfYes">${esc(opt.yes||'Evet, Devam')}</button></div>`;
 window.__cfCb=onYes;
 document.getElementById('cfYes').onclick=cfRun;
 document.getElementById('modalWrap').classList.add('on');
}
function cfRun(){var cb=window.__cfCb;window.__cfCb=null;closeModal();if(cb)cb();}
/* Tek noktadan silme kayıt defteri (data-act="del" data-arg="tür~id") */
function softDelete(arr,id,kind,labelFn){
 var rec=arr.find(function(x){return x.id===id;});
 if(!rec)return null;
 rec.deletedAt=new Date().toISOString();
 rec.deletedBy=SESSION?SESSION.username:'';
 var lbl='';try{lbl=labelFn?labelFn(rec):'';}catch(e){}
 S.trash=S.trash||[];
 S.trash.unshift({kind:kind,id:id,label:lbl,deletedAt:rec.deletedAt,deletedBy:rec.deletedBy});
 if(S.trash.length>500)S.trash.length=500;
 return rec;
}
function cascadeSoftDelete(arr,matchFn){
 arr.forEach(function(t){ if(matchFn(t)&&!t.deletedAt){ t.deletedAt=new Date().toISOString(); t.deletedBy=SESSION?SESSION.username:''; } });
}
function del(kind,id){
 const R={
  acc:['Hesap silinsin mi? (Hareket kayıtları korunur, çöp kutusuna taşınır)',()=>{softDelete(S.accounts,id,'acc',r=>'Hesap: '+r.name);}],
  tx:['İşlem silinsin mi? (Çöp kutusuna taşınır, 30 gün içinde geri getirilebilir)',()=>{softDelete(S.txns,id,'tx',r=>(r.type==='gelir'?'Gelir':r.type==='gider'?'Gider':'Virman')+': '+fmt0(r.amount)+(r.desc?' - '+r.desc:r.cat?' - '+r.cat:''));}],
  pos:['POS tanımı silinsin mi?',()=>{softDelete(S.pos,id,'pos',r=>'POS: '+r.name);}],
  posE:['POS girişi silinsin mi?',()=>{softDelete(S.posEntries,id,'posE',r=>'POS girişi: '+fmt0(r.net)+' ('+r.date+')');}],
  card:['Kart ve hareketleri silinsin mi? (Çöp kutusuna taşınır)',()=>{softDelete(S.cards,id,'card',r=>'Kart: '+r.name);cascadeSoftDelete(S.cardTxns,t=>t.cardId===id);}],
  cardT:['Kayıt silinsin mi?',()=>{softDelete(S.cardTxns,id,'cardT',r=>'Kart hareketi: '+fmt0(r.amount));}],
  cari:['Cari ve tüm hareketleri silinsin mi? (Çöp kutusuna taşınır)',()=>{softDelete(S.cari,id,'cari',r=>'Cari: '+r.name);cascadeSoftDelete(S.cariTxns,t=>t.cariId===id);}],
  cariT:['Hareket silinsin mi?',()=>{softDelete(S.cariTxns,id,'cariT',r=>'Cari hareketi: '+fmt0(r.amount));}],
  staff:['Personel pasife alınsın mı? (Kayıtları korunur)',()=>{const s=S.staff.find(z=>z.id===id);if(s)s.active='0';}],
  staffPerma:['Personel kaydı KALICI olarak silinsin mi? (Çöp kutusuna taşınır, 30 gün içinde geri getirilebilir; ödeme ve izin geçmişi birlikte gizlenir)',()=>{softDelete(S.staff,id,'staffPerma',r=>'Personel (kalıcı): '+r.name);cascadeSoftDelete(S.staffTxns,t=>t.staffId===id);cascadeSoftDelete(S.leaves,t=>t.staffId===id);}],
  staffT:['Kayıt silinsin mi?',()=>{softDelete(S.staffTxns,id,'staffT',r=>'Personel ödemesi: '+fmt0(r.amount));}],
  leave:['İzin silinsin mi?',()=>{softDelete(S.leaves,id,'leave',()=>'İzin kaydı');}],
  fixed:['Tanım silinsin mi?',()=>{softDelete(S.fixed,id,'fixed',r=>'Sabit ödeme: '+r.name);}],
  fixedL:['Ödeme kaydı ve bağlı gider silinsin mi? (Çöp kutusuna taşınır)',()=>{const l=S.fixedLogs.find(z=>z.id===id);softDelete(S.fixedLogs,id,'fixedL',r=>'Ödeme kaydı: '+fmt0(r.amount));if(l&&l.txnId)cascadeSoftDelete(S.txns,t=>t.id===l.txnId);}],
  task:['Görev silinsin mi?',()=>{softDelete(S.tasks,id,'task',r=>'Görev: '+r.title);}],
  note:['Duyuru silinsin mi?',()=>{softDelete(S.notes,id,'note',()=>'Duyuru');}],
  cek:['Çek/senet kaydı silinsin mi?',()=>{softDelete(S.cheques,id,'cek',r=>'Çek/Senet: '+(r.kisi||'')+' '+fmt0(r.tutar));}],
  stok:['Ürün ve stok hareketleri silinsin mi? (Çöp kutusuna taşınır)',()=>{softDelete(S.stock,id,'stok',r=>'Ürün: '+r.name);cascadeSoftDelete(S.stockTxns,t=>t.itemId===id);}],
  stokT:['Stok hareketi silinsin mi?',()=>{softDelete(S.stockTxns,id,'stokT',()=>'Stok hareketi');}],
  asset:['Demirbaş silinsin mi?',()=>{softDelete(S.assets,id,'asset',r=>'Demirbaş: '+r.name);}],
  budget:['Bütçe kalemi silinsin mi?',()=>{softDelete(S.budgets,id,'budget',r=>'Bütçe: '+r.cat);}]
 }[kind];
 if(R)askDel(R[0],R[1]);
}
function askDel(msg,fn){ uiConfirm(msg||'Bu kayıt silinsin mi?',()=>{fn();save();toast('Kayıt çöp kutusuna taşındı — 30 gün içinde geri getirilebilir');go(PAGE);},{danger:1,title:'Silme Onayı',yes:'Evet, Sil'}); }
function restoreTrash(idxStr){
 if(!isSuper())return;
 const idx=+idxStr;
 const entry=(S.trash||[])[idx];
 if(!entry){toast('Kayıt bulunamadı');return;}
 const ARR={acc:S.accounts,tx:S.txns,pos:S.pos,posE:S.posEntries,card:S.cards,cardT:S.cardTxns,cari:S.cari,cariT:S.cariTxns,
  staffT:S.staffTxns,leave:S.leaves,staffPerma:S.staff,fixed:S.fixed,fixedL:S.fixedLogs,task:S.tasks,note:S.notes,cek:S.cheques,stok:S.stock,stokT:S.stockTxns,asset:S.assets,budget:S.budgets};
 const arr=ARR[entry.kind];
 const rec=arr?arr.find(x=>x.id===entry.id):null;
 if(!rec){toast('Kayıt bulunamadı (belki kalıcı silinmiş)');S.trash=(S.trash||[]).filter((e,i)=>i!==idx);save();return;}
 delete rec.deletedAt;delete rec.deletedBy;
 if(entry.kind==='card')S.cardTxns.forEach(t=>{if(t.cardId===entry.id&&t.deletedAt){delete t.deletedAt;delete t.deletedBy;}});
 if(entry.kind==='cari')S.cariTxns.forEach(t=>{if(t.cariId===entry.id&&t.deletedAt){delete t.deletedAt;delete t.deletedBy;}});
 if(entry.kind==='stok')S.stockTxns.forEach(t=>{if(t.itemId===entry.id&&t.deletedAt){delete t.deletedAt;delete t.deletedBy;}});
 if(entry.kind==='staffPerma'){rec.active='0';S.staffTxns.forEach(t=>{if(t.staffId===entry.id&&t.deletedAt){delete t.deletedAt;delete t.deletedBy;}});S.leaves.forEach(t=>{if(t.staffId===entry.id&&t.deletedAt){delete t.deletedAt;delete t.deletedBy;}});}
 if(entry.kind==='fixedL'&&rec.txnId){const t=S.txns.find(x=>x.id===rec.txnId);if(t&&t.deletedAt){delete t.deletedAt;delete t.deletedBy;}}
 S.trash=(S.trash||[]).filter((e,i)=>i!==idx);
 logAudit('Kayıt geri getirildi',entry.label||entry.kind);
 save();toast('Kayıt geri getirildi');go(PAGE);
}
function purgeOldTrash(){ // 30 günden eski silinmiş kayıtları kalıcı olarak temizler
 try{
  if(!S.trash||!S.trash.length)return;
  const cutoff=addDays(todayISO(),-30);
  const keep=[],purge=[];
  S.trash.forEach(e=>{ (e.deletedAt&&e.deletedAt.slice(0,10)<cutoff)?purge.push(e):keep.push(e); });
  if(!purge.length)return;
  const ARR={acc:S.accounts,tx:S.txns,pos:S.pos,posE:S.posEntries,card:S.cards,cardT:S.cardTxns,cari:S.cari,cariT:S.cariTxns,
   staffT:S.staffTxns,leave:S.leaves,staffPerma:S.staff,fixed:S.fixed,fixedL:S.fixedLogs,task:S.tasks,note:S.notes,cek:S.cheques,stok:S.stock,stokT:S.stockTxns,asset:S.assets,budget:S.budgets};
  purge.forEach(e=>{ const arr=ARR[e.kind]; if(arr){ const i=arr.findIndex(x=>x.id===e.id); if(i>-1)arr.splice(i,1); } });
  S.trash=keep;
 }catch(e){}
}

const accOpts=(co,empty)=>{const l=byCo(S.accounts,co).filter(a=>a.active!=='0').map(a=>[a.id,(a.type==='kasa'?'💵 ':'🏦 ')+a.name]);return empty?[['','— Seçin —']].concat(l):l;};
const cariOpts=co=>[['','— Cari yok —']].concat(byCo(S.cari,co).filter(c=>c.active!=='0').map(c=>[c.id,c.name]));
const catOpts=t=>S.cats[t].map(c=>[c,c]);

function quickAdd(){
 if(CO==='grup')return;
 openForm('Hızlı İşlem',[
  {name:'w',label:'İşlem türü',type:'select',opts:[['gelir','Gelir ekle'],['gider','Gider ekle'],['virman','Hesaplar arası virman'],['task','Görev oluştur'],['ai','✦ AI Asistanına sor']]}
 ],o=>{ if(o.w==='ai') openAiChat(); else if(o.w==='task') addTaskForm(); else if(o.w==='virman') virmanForm(); else addTxnForm(o.w); });
}

/* ---------- ANA SAYFA ---------- */
function rDash(){
 const co=CO;
 const accs=byCo(S.accounts,co);
 let bal=0;for(const a of accs)bal+=accBalance(a);
 const t=sumRange(co,todayISO(),todayISO());
 const m=sumRange(co,monthISO()+'-01',todayISO());
 let posBek=0;for(const p of S.posEntries)if(p.co===co&&p.status==='bekliyor')posBek+=+p.net;
 const rems=reminders(co);
 const overdue=rems.filter(r=>r.df<=0).length;
 const recent=S.txns.filter(x=>x.co===co).sort((a,b)=>b.date<a.date?-1:b.date>a.date?1:0).slice(0,10);
 const ds=dailySeries(co,30);
 const dun=sumRange(co,addDays(todayISO(),-1),addDays(todayISO(),-1));
 const fark=dun.gelir?((t.gelir-dun.gelir)/dun.gelir*100):0;

 document.getElementById('main').innerHTML= topbar('Ana Sayfa',
  `<button class="btn" data-act="quickAdd">＋ Hızlı İşlem</button>`)+
 (overdue?`<div class="card" style="background:linear-gradient(135deg,var(--neg),#e0564f);border:0;margin-bottom:12px"><h2 style="color:#fff;margin-bottom:0">⚠ ${overdue} vadesi geçmiş ödeme var — aşağıdaki Ödeme Hatırlatıcıları'na bakın</h2></div>`:'')+
 `<div class="grid g4" style="margin-bottom:16px">
   <div class="kpi p"><div class="l">Bugünkü Ciro</div><div class="v">${fmt0(t.gelir)}</div><div class="s">${dun.gelir?('Düne göre '+(fark>=0?'▲ +':'▼ ')+fark.toFixed(1)+'%'):'Bu ay: '+fmt0(m.gelir)}</div></div>
   <div class="kpi n"><div class="l">Bugünkü Gider</div><div class="v">${fmt0(t.gider)}</div><div class="s">Bu ay: ${fmt0(m.gider)}</div></div>
   <div class="kpi a"><div class="l">Nakit + Banka</div><div class="v">${fmt0(bal)}</div><div class="s">${accs.length} hesap</div></div>
   <div class="kpi"><div class="l">Blokajdaki POS</div><div class="v">${fmt0(posBek)}</div><div class="s">Aylık net: ${fmt0(m.net)}</div></div>
  </div>
  <div class="grid g2">
   <div class="card"><h2>Ödeme Hatırlatıcıları <span class="chip ${rems.some(r=>r.df<=0)?'n':'g'}">${rems.length}</span></h2>
    ${rems.length? rems.slice(0,9).map(r=>`<div class="rem ${remClass(r.df)}"><span class="dot"></span><span>${esc(r.t)}<br><span class="tiny">${dTR(r.d)} · ${remLbl(r.df)}</span></span>${r.a!=null?`<span class="amt">${fmt0(r.a)}</span>`:''}</div>`).join('')
     :'<div class="empty"><b>Yaklaşan ödeme yok</b>Kredi kartı, sabit ödeme ve cari vadeleri burada görünür.</div>'}
   </div>
   <div class="card"><h2>Hesap Bakiyeleri <button class="btn sm gh" data-act="go" data-arg="acc">Detay →</button></h2>
    ${accs.length? chartHBars(accs.map(a=>({label:(a.type==='kasa'?'💵 ':'🏦 ')+a.name,value:accBalance(a),color:hashColor(a.bankName||a.name)})))
     :'<div class="empty"><b>Hesap yok</b>Banka & Kasa ekranından hesap ekleyin.</div>'}
   </div>
  </div>
  <div id="briefBox"></div>
  ${fcCard(30)}
  <div class="card"><h2>Son 30 Gün Nakit Akışı</h2>
   ${chartArea([{name:'Gelir',color:'#177e4d',values:ds.gelir},{name:'Gider',color:'#c0392b',values:ds.gider}],ds.labels,210)}
  </div>
  <div class="card"><h2>Son İşlemler <button class="btn sm gh" data-act="go" data-arg="tx">Tümü →</button></h2>
   ${recent.length? '<table><thead><tr><th>Tarih</th><th>İşlem</th><th class="hidem">Kategori</th><th class="num">Tutar</th></tr></thead><tbody>'+
    recent.map(x=>txRow(x)).join('')+'</tbody></table>'
    :'<div class="empty"><b>Henüz işlem yok</b>"+ Hızlı İşlem" ile başlayın veya Ayarlar ekranından Örnek Veri yükleyin.</div>'}
  </div>`;
 renderBriefCard();
}
function txRow(x){
 const acc=S.accounts.find(a=>a.id===x.accId)||{};
 const cls=x.type==='gelir'?'p':x.type==='gider'?'n':'g';
 const lbl=x.type==='virman'?'Virman':x.type==='gelir'?'Gelir':'Gider';
 const who=x.createdBy?(' · '+(x.updatedBy&&x.updatedBy!==x.createdBy?'düzenleyen: '+x.updatedBy:'ekleyen: '+x.createdBy)):'';
 return `<tr><td>${dTR(x.date)}</td><td><span class="chip ${cls}">${lbl}</span> ${esc(x.desc||'')}<div class="tiny">${esc(acc.name||(x.src==='card'?'Kredi kartı':''))}${esc(who)}</div></td><td class="hidem">${esc(x.cat||'')}</td><td class="num" style="color:${x.type==='gelir'?'var(--pos)':x.type==='gider'?'var(--neg)':'var(--ink2)'}">${x.type==='gider'?'-':''}${fmt(x.amount)}</td></tr>`;
}

/* ---------- BANKA & KASA (kart görünümü + grafikler) ---------- */
var accTab='all';
function setAccTab(v){accTab=v;rAcc();}
function rAcc(){
 const allAccs=byCo(S.accounts,CO); // v32: TÜM hesaplar (aktif+pasif) — toplamlar bundan hesaplanır, pasif bir hesabın bakiyesi asla sessizce kaybolmaz
 const all=allAccs.filter(a=>a.active!=='0'); // yalnızca aktif — kart listesi ve sekmeler için
 const inactiveAccs=allAccs.filter(a=>a.active==='0');
 const list=all.filter(a=>accTab==='all'||a.type===accTab);
 const rows=list.map(a=>({a,b:accBalance(a)}));
 const allRows=allAccs.map(a=>({a,b:accBalance(a)})); // toplamlar İÇİN pasif dahil tüm hesaplar
 const toplam=allRows.reduce((s,r)=>s+r.b,0);
 const kasaT=allRows.filter(r=>r.a.type==='kasa').reduce((s,r)=>s+r.b,0);
 const bankaT=allRows.filter(r=>r.a.type==='banka').reduce((s,r)=>s+r.b,0);

 document.getElementById('main').innerHTML= topbar('Banka & Kasa',
  `<button class="btn gh" data-act="virmanForm">⇄ Virman</button><button class="btn" data-act="accForm">＋ Hesap Ekle</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi a"><div class="l">Toplam Bakiye</div><div class="v">${fmt0(toplam)}</div></div>
   <div class="kpi"><div class="l">💵 Kasa Toplamı</div><div class="v">${fmt0(kasaT)}</div></div>
   <div class="kpi"><div class="l">🏦 Banka Toplamı</div><div class="v">${fmt0(bankaT)}</div></div>
  </div>
  ${seg([['all','Tümü',all.length],['banka','🏦 Bankalar',all.filter(a=>a.type==='banka').length],['kasa','💵 Kasalar',all.filter(a=>a.type==='kasa').length]],accTab,'setAccTab')}
  ${rows.length?`<div class="card"><h2>Bakiye Dağılımı</h2>
   ${chartDonut(rows.map(r=>({label:r.a.name,value:Math.max(0,r.b),color:hashColor(r.a.bankName||r.a.name)})),'TOPLAM ₺')}
  </div>`:''}
  ${rows.length? `<div class="grid g2">`+rows.map(({a,b})=>{
   const col=hashColor(a.bankName||a.name);
   const sp=accSeries(a,30);
   return `<div class="card accCard" style="--ac:${col}">
    <div class="accHead"><span class="avat" style="background:${col}">${esc((a.bankName||a.name).charAt(0).toUpperCase())}</span>
     <div><b>${esc(a.name)}</b><div class="tiny">${a.type==='kasa'?'Nakit Kasa':esc(a.bankName||'Banka')}</div></div>
     <span class="chip ${a.type==='kasa'?'w':'g'}" style="margin-left:auto">${a.type==='kasa'?'KASA':'BANKA'}</span></div>
    ${a.iban?`<div class="tiny" style="margin:6px 0 0">IBAN: ${esc(a.iban)}</div>`:''}
    <div class="accBal"><div><div class="tiny">Güncel Bakiye</div><b style="font-size:21px;color:${b<0?'var(--neg)':'var(--ink)'}">${fmt(b)}</b></div>
     <div class="sparkBox">${spark(sp,col)}<div class="tiny" style="text-align:right">30 günlük seyir</div></div></div>
    <div class="cardBtns">
     <button class="btn sm" data-act="addTxnFromAcc" data-arg="gelir~${a.id}">＋ Gelir</button>
     <button class="btn sm" data-act="addTxnFromAcc" data-arg="gider~${a.id}">－ Gider</button>
     <button class="btn sm gh" data-act="virmanForm" data-arg="${a.id}">⇄ Virman</button>
     <button class="btn sm gh" data-act="accEkstre" data-arg="${a.id}">📄 Ekstre</button>
     <button class="btn sm gh" data-act="accForm" data-arg="${a.id}">✎ Düzenle</button>
     <button class="btn sm gh" data-act="accDeactivate" data-arg="${a.id}">⏸ Pasife Al</button>
     <button class="btn sm dng" data-act="del" data-arg="acc~${a.id}">Sil</button>
    </div></div>`;
  }).join('')+`</div>`
  :`<div class="card"><div class="empty"><b>Bu sekmede hesap yok</b>Önce bir kasa ve banka hesabı ekleyin; tüm gelir-giderler bu hesaplara işlenir.</div></div>`}
  ${inactiveAccs.length?`<div class="card"><h2>⏸ Pasif Hesaplar <span class="tiny">(${inactiveAccs.length}) — bakiyeleri toplamlara dahil edilmeye devam eder, sadece işlem seçim listelerinden gizlenir</span></h2>
   <table><thead><tr><th>Hesap</th><th class="num">Bakiye</th><th class="rowact"></th></tr></thead><tbody>
   ${inactiveAccs.map(a=>`<tr><td><span class="avat sm" style="background:${hashColor(a.bankName||a.name)}">${esc((a.bankName||a.name).charAt(0))}</span> ${esc(a.name)} <span class="tiny">${a.type==='kasa'?'Kasa':esc(a.bankName||'Banka')}</span></td>
   <td class="num">${fmt(accBalance(a))}</td>
   <td class="rowact"><button class="btn sm gh" data-act="accReactivate" data-arg="${a.id}">↩ Aktif Et</button><button class="btn sm dng" data-act="del" data-arg="acc~${a.id}">🗑 Sil</button></td></tr>`).join('')}
   </tbody></table></div>`:''}
  <div id="ekstreBox"></div>`;
 document.getElementById('main').insertAdjacentHTML('beforeend',modSum('acc'));
}
function accDeactivate(id){
 const a=S.accounts.find(x=>x.id===id);if(!a)return;
 a.active='0';logAudit('Hesap pasife alındı',a.name);save();toast(a.name+' pasife alındı — bakiyesi toplamlarda görünmeye devam eder');go('acc');
}
function accReactivate(id){
 const a=S.accounts.find(x=>x.id===id);if(!a)return;
 a.active='1';logAudit('Hesap yeniden aktif edildi',a.name);save();toast(a.name+' yeniden aktif edildi');go('acc');
}
function accForm(id){
 const init=id?S.accounts.find(a=>a.id===id):{type:'banka'};
 openForm(id?'Hesabı Düzenle':'Yeni Hesap',[
  {name:'type',label:'Hesap türü',type:'select',opts:[['banka','Banka Hesabı'],['kasa','Nakit Kasa']]},
  {name:'name',label:'Hesap adı',req:1,ph:'Ör: Ziraat Vadesiz / Ana Kasa'},
  {name:'bankName',label:'Banka adı (kasa ise boş bırakın)',ph:'Ziraat Bankası'},
  {name:'iban',label:'IBAN',ph:'TR__ ____ ____ ...'},
  {row:[{name:'accNo',label:'Hesap no'},{name:'opening',label:'Açılış bakiyesi (₺)',type:'number',def:0}]},
  {name:'note',label:'Not',type:'textarea'}
 ],o=>{
  if(id)Object.assign(init,o);
  else S.accounts.push({id:nid(),co:CO,...o});
  save();toast('Hesap kaydedildi');go('acc');
 },init||{});
}
function virmanForm(fromId){
 const opts=accOpts(CO);
 if(opts.length<2)return toast('Virman için en az 2 hesap gerekli');
 openForm('Hesaplar Arası Virman',[
  {name:'accId',label:'Gönderen hesap',type:'select',opts,req:1},
  {name:'accId2',label:'Alan hesap',type:'select',opts,req:1},
  {row:[{name:'amount',label:'Tutar (₺)',type:'number',req:1,min:0.01},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]},
  {name:'desc',label:'Açıklama',ph:'Kasadan bankaya'}
 ],o=>{
  if(o.accId===o.accId2)return toast('Aynı hesaba virman yapılamaz');
  S.txns.push({id:nid(),co:CO,type:'virman',...o,amount:+o.amount});
  save();toast('Virman kaydedildi');go(PAGE);
 },fromId?{accId:fromId}:{});
}
function accEkstre(id){
 const a=S.accounts.find(x=>x.id===id);if(!a)return;
 const list=S.txns.filter(t=>t.co===CO&&(t.accId===id||t.accId2===id)).sort((x,y)=>x.date<y.date?-1:1);
 let run=+a.opening||0;
 const rows=list.map(t=>{
  let delta=0;
  if(t.type==='gelir')delta=+t.amount; else if(t.type==='gider')delta=-t.amount;
  else delta=(t.accId===id?-1:1)*t.amount;
  run+=delta;
  return `<tr><td>${dTR(t.date)}</td><td>${esc(t.desc||t.cat||(t.type==='virman'?'Virman':''))}</td><td class="num" style="color:${delta>=0?'var(--pos)':'var(--neg)'}">${fmt(delta)}</td><td class="num">${fmt(run)}</td>
  <td class="rowact">${t.type!=='virman'?'<button data-act="editTxn" data-arg="'+t.id+'">✎</button>':''}<button data-act="del" data-arg="tx~${t.id}">🗑</button></td></tr>`;
 }).reverse().join('');
 document.getElementById('ekstreBox').innerHTML=
  `<div class="card"><h2>Ekstre — ${esc(a.name)} <button class="btn sm gh" data-act="printPage">🖨 Yazdır</button></h2>
   <div class="mut" style="margin-bottom:8px">Açılış bakiyesi: <b>${fmt(a.opening)}</b> · Güncel bakiye: <b>${fmt(run)}</b> · ${list.length} hareket</div>
   ${rows?'<table><thead><tr><th>Tarih</th><th>Açıklama</th><th class="num">Tutar</th><th class="num">Bakiye</th><th class="rowact"></th></tr></thead><tbody>'+rows+'</tbody></table>':'<div class="empty">Bu hesapta hareket yok.</div>'}</div>`;
 try{document.getElementById('ekstreBox').scrollIntoView({behavior:'smooth'});}catch(e){}
}

/* ---------- GELİR-GİDER ---------- */
var txFilter={type:'',cat:'',from:'',to:''};
function txSetType(v){txFilter.type=v;rTx();}
function txSetCat(v){txFilter.cat=v;rTx();}
function txSetFrom(v){txFilter.from=v;rTx();}
function txSetTo(v){txFilter.to=v;rTx();}
function txClear(){txFilter={type:'',cat:'',from:'',to:''};rTx();}
function rTx(){
 let list=S.txns.filter(t=>t.co===CO);
 const f=txFilter;
 if(f.type)list=list.filter(t=>t.type===f.type);
 if(f.cat)list=list.filter(t=>t.cat===f.cat);
 if(f.from)list=list.filter(t=>t.date>=f.from);
 if(f.to)list=list.filter(t=>t.date<=f.to);
 list.sort((a,b)=>a.date<b.date?1:-1);
 const g=list.filter(t=>t.type==='gelir').reduce((s,t)=>s+ +t.amount,0);
 const x=list.filter(t=>t.type==='gider').reduce((s,t)=>s+ +t.amount,0);
 document.getElementById('main').innerHTML= topbar('Gelir - Gider',
  `<button class="btn gh" data-act="addTxnForm" data-arg="gelir">＋ Gelir</button><button class="btn" data-act="addTxnForm" data-arg="gider">＋ Gider</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
  <div class="kpi p"><div class="l">Gelir (filtreli)</div><div class="v">${fmt0(g)}</div></div>
  <div class="kpi n"><div class="l">Gider (filtreli)</div><div class="v">${fmt0(x)}</div></div>
  <div class="kpi a"><div class="l">Net</div><div class="v">${fmt0(g-x)}</div></div></div>
 <div class="card">
  <div class="filters">
   <select data-actv="txSetType"><option value="">Tümü</option><option ${f.type==='gelir'?'selected':''} value="gelir">Gelir</option><option ${f.type==='gider'?'selected':''} value="gider">Gider</option><option ${f.type==='virman'?'selected':''} value="virman">Virman</option></select>
   <select data-actv="txSetCat"><option value="">Tüm kategoriler</option>${S.cats.gelir.concat(S.cats.gider).map(c=>`<option ${f.cat===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
   <input type="date" value="${f.from}" data-actv="txSetFrom">
   <input type="date" value="${f.to}" data-actv="txSetTo">
   <button class="btn sm gh" data-act="txClear">Temizle</button>
  </div>
  ${list.length? '<table><thead><tr><th>Tarih</th><th>İşlem</th><th class="hidem">Kategori</th><th class="num">Tutar</th><th class="rowact"></th></tr></thead><tbody>'+
   list.slice(0,200).map(t=>txRow(t).replace('</tr>',`<td class="rowact"><button data-act="editTxn" data-arg="${t.id}">✎</button><button data-act="del" data-arg="tx~${t.id}">🗑</button></td></tr>`)).join('')+'</tbody></table>'+(list.length>200?'<div class="tiny" style="padding:8px">İlk 200 kayıt gösteriliyor, filtre kullanın.</div>':'')
   :'<div class="empty"><b>Kayıt bulunamadı</b>Filtreleri değiştirin veya yeni işlem ekleyin.</div>'}
 </div>`;
}
function addTxnForm(type,init){
 if(!byCo(S.accounts,CO).length)return toast('Önce Banka & Kasa ekranından bir hesap ekleyin');
 const isEdit=!!(init&&init.id); // v26: sadece gerçek bir kayıt ID'si varsa "düzenleme" say — yoksa (ör. sadece hesap ön-doldurmak için) her zaman YENİ kayıt oluştur
 openForm(type==='gelir'?'Gelir Ekle':'Gider Ekle',[
  {row:[{name:'amount',label:'Tutar (₺)',type:'number',req:1,min:0.01},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]},
  {name:'cat',label:'Kategori',type:'select',opts:catOpts(type),req:1},
  {name:'accId',label:type==='gelir'?'Hangi hesaba girdi':'Hangi hesaptan çıktı',type:'select',opts:accOpts(CO),req:1},
  {name:'cariId',label:'Cari (opsiyonel)',type:'select',opts:cariOpts(CO)},
  {row:[{name:'vat',label:'KDV %',type:'select',opts:[['','KDV yok'],['1','%1'],['10','%10'],['20','%20']]},{name:'doc',label:'Belge no'}]},
  {name:'desc',label:'Açıklama',ph:'Ör: Sebze hali alımı'}
 ],o=>{
  const rec={id:isEdit?init.id:nid(),co:CO,type,...o,amount:+o.amount};
  if(isEdit){stampUpdate(rec,init);const i=S.txns.findIndex(z=>z.id===init.id);S.txns[i]=rec;}
  else{stampCreate(rec);S.txns.push(rec);}
  save();toast(type==='gelir'?'Gelir kaydedildi':'Gider kaydedildi');go(PAGE);
 },init||{});
}
function addTxnFromAcc(type,accId){ addTxnForm(type,{accId:accId}); } // v26: bir hesap kartından doğrudan gelir/gider eklerken o hesabı ön-seçili getirir
function editTxn(id){
 const t=S.txns.find(x=>x.id===id);if(!t)return;
 if(t.type==='virman')return toast('Virman kaydını silip yeniden oluşturabilirsiniz');
 addTxnForm(t.type,t);
}

/* ---------- POS ---------- */
var posTab='giris';
function setPosTab(v){posTab=v;rPos();}
function rPos(){
 const allPos=byCo(S.pos,CO); // v32: TÜM POS cihazları (aktif+pasif) — geçmiş grafik/karşılaştırmalarda tam veri korunur
 const list=allPos.filter(p=>p.active!=='0'); // yalnızca aktif — cihaz yönetim tablosu için
 const inactivePos=allPos.filter(p=>p.active==='0');
 const ent=byCo(S.posEntries,CO).sort((a,b)=>a.date<b.date?1:-1);
 const bek=ent.filter(e=>e.status==='bekliyor');
 const mo=monthISO();
 const ayEnt=ent.filter(e=>e.date.startsWith(mo));
 const ayKom=ayEnt.reduce((s,e)=>s+ +e.comm,0);
 const ayBrut=ayEnt.reduce((s,e)=>s+ +e.gross,0);
 const share={};for(const e of ayEnt){share[e.posId]=(share[e.posId]||0)+ +e.gross;}
 document.getElementById('main').innerHTML= topbar('POS İşlemleri',
  `<button class="btn gh" data-act="posDefForm">＋ POS Tanımla</button><button class="btn" data-act="posEntryForm">＋ POS Girişi</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi a"><div class="l">Bu Ay POS Ciro (brüt)</div><div class="v">${fmt0(ayBrut)}</div></div>
   <div class="kpi n"><div class="l">Bu Ay Komisyon</div><div class="v">${fmt0(ayKom)}</div><div class="s">Efektif oran: %${ayBrut?(ayKom/ayBrut*100).toFixed(2):'0'}</div></div>
   <div class="kpi"><div class="l">Blokajda Bekleyen</div><div class="v">${fmt0(bek.reduce((s,e)=>s+ +e.net,0))}</div><div class="s">${bek.length} işlem</div></div>
  </div>
  ${seg([['giris','Günlük Girişler',ent.length],['cihaz','Cihazlar & Komisyonlar',list.length]],posTab,'setPosTab')}`+
 (posTab==='cihaz'
 ? `<div class="card"><h2>Tanımlı POS Cihazları</h2>
  ${list.length? '<table><thead><tr><th>POS</th><th>Bağlı Hesap</th><th class="num">Komisyon</th><th class="num">Blokaj</th><th class="num hidem">Bu Ay Ciro</th><th class="rowact"></th></tr></thead><tbody>'+
   list.map(p=>{const a=S.accounts.find(x=>x.id===p.accId)||{};return `<tr><td><span class="avat sm" style="background:${hashColor(p.name)}">${esc(p.name.charAt(0))}</span> <b>${esc(p.name)}</b></td><td>${esc(a.name||'—')}</td><td class="num">%${p.comm}</td><td class="num">${p.blokaj} gün</td><td class="num hidem">${fmt0(share[p.id]||0)}</td>
   <td class="rowact"><button data-act="posDefForm" data-arg="${p.id}">✎</button><button data-act="posDeactivate" data-arg="${p.id}">⏸</button><button data-act="del" data-arg="pos~${p.id}">🗑</button></td></tr>`;}).join('')+'</tbody></table>'
   :'<div class="empty"><b>POS tanımlı değil</b>Banka, komisyon oranı ve blokaj süresiyle POS cihazlarınızı tanımlayın.</div>'}
  </div>
  ${inactivePos.length?`<div class="card"><h2>⏸ Pasif POS Cihazları <span class="tiny">(${inactivePos.length}) — geçmiş verileri raporlarda korunur</span></h2>
   <table><thead><tr><th>POS</th><th>Bağlı Hesap</th><th class="rowact"></th></tr></thead><tbody>
   ${inactivePos.map(p=>{const a=S.accounts.find(x=>x.id===p.accId)||{};return `<tr><td><span class="avat sm" style="background:${hashColor(p.name)}">${esc(p.name.charAt(0))}</span> ${esc(p.name)}</td><td>${esc(a.name||'—')}</td>
   <td class="rowact"><button class="btn sm gh" data-act="posReactivate" data-arg="${p.id}">↩ Aktif Et</button><button class="btn sm dng" data-act="del" data-arg="pos~${p.id}">🗑 Sil</button></td></tr>`;}).join('')}
   </tbody></table></div>`:''}
  ${posCompareCard(allPos,ent)}`
 : `${Object.keys(share).length?`<div class="card"><h2>Bu Ay POS Dağılımı</h2>${chartDonut(allPos.map(p=>({label:p.name,value:share[p.id]||0,color:hashColor(p.name)})),'BRÜT ₺')}</div>`:''}
  <div class="card"><h2>POS Girişleri</h2>
  ${ent.length? '<table><thead><tr><th>Tarih</th><th>POS</th><th class="num">Brüt</th><th class="num hidem">Komisyon</th><th class="num">Net</th><th>Hesaba Geçiş</th><th class="rowact"></th></tr></thead><tbody>'+
   ent.slice(0,60).map(e=>{const p=S.pos.find(x=>x.id===e.posId)||{};
    return `<tr><td>${dTR(e.date)}</td><td>${esc(p.name||'?')}</td><td class="num">${fmt(e.gross)}</td><td class="num hidem" style="color:var(--neg)">-${fmt(e.comm)}</td><td class="num" style="font-weight:700">${fmt(e.net)}</td>
    <td>${e.status==='gecti'?'<span class="chip p">Hesaba geçti ✓</span>':`<span class="chip w">${dTR(e.settleDate)}</span> <button class="btn sm" data-act="posSettle" data-arg="${e.id}">Geçti ✓</button>`}</td>
    <td class="rowact"><button data-act="del" data-arg="posE~${e.id}">🗑</button></td></tr>`;}).join('')+'</tbody></table>'
   :'<div class="empty"><b>POS girişi yok</b>Gün sonu POS toplamlarını girin; komisyon ve net tutar otomatik hesaplanır.</div>'}
  </div>${posCompareCard(allPos,ent)}`);
 document.getElementById('main').insertAdjacentHTML('beforeend',modSum('pos'));
}
function posDeactivate(id){
 const p=S.pos.find(x=>x.id===id);if(!p)return;
 p.active='0';logAudit('POS pasife alındı',p.name);save();toast(p.name+' pasife alındı — geçmiş verileri korunur');go('pos');
}
function posReactivate(id){
 const p=S.pos.find(x=>x.id===id);if(!p)return;
 p.active='1';logAudit('POS yeniden aktif edildi',p.name);save();toast(p.name+' yeniden aktif edildi');go('pos');
}
function posDefForm(id){
 const init=id?S.pos.find(p=>p.id===id):{};
 const opts=accOpts(CO);
 if(!opts.length)return toast('Önce bir banka hesabı ekleyin');
 openForm(id?'POS Düzenle':'Yeni POS',[
  {name:'name',label:'POS adı',req:1,ph:'Ör: Ziraat POS 1'},
  {name:'accId',label:'Bağlı banka hesabı',type:'select',opts,req:1},
  {row:[{name:'comm',label:'Komisyon oranı (%)',type:'number',req:1,def:2,step:'0.01'},{name:'blokaj',label:'Blokaj süresi (gün)',type:'number',req:1,def:1,step:'1'}]}
 ],o=>{ if(id)Object.assign(init,o); else S.pos.push({id:nid(),co:CO,...o}); save();toast('POS kaydedildi');go('pos'); },init||{});
}
function posEntryForm(){
 const opts=byCo(S.pos,CO).filter(p=>p.active!=='0').map(p=>[p.id,p.name+' (%'+p.comm+')']);
 if(!opts.length)return toast('Önce bir POS tanımlayın');
 openForm('POS Girişi (gün sonu)',[
  {name:'posId',label:'POS',type:'select',opts,req:1},
  {row:[{name:'gross',label:'Brüt tutar (₺)',type:'number',req:1,min:0.01},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]}
 ],o=>{
  const p=S.pos.find(x=>x.id===o.posId);
  const comm=+(+o.gross*(+p.comm/100)).toFixed(2);
  const net=+(+o.gross-comm).toFixed(2);
  S.posEntries.push({id:nid(),co:CO,date:o.date,posId:o.posId,gross:+o.gross,comm,net,settleDate:addDays(o.date,+p.blokaj||0),status:'bekliyor'});
  save();toast('POS girişi eklendi · Net '+fmt(net));go('pos');
 });
}
function posSettle(id){
 const e=S.posEntries.find(x=>x.id===id);if(!e)return;
 const p=S.pos.find(x=>x.id===e.posId)||{};
 e.status='gecti';
 S.txns.push({id:nid(),co:CO,type:'gelir',date:todayISO(),amount:+e.gross,cat:'Satış Geliri',accId:p.accId,desc:'POS aktarımı: '+(p.name||'')+' ('+dTR(e.date)+' satışı)'});
 S.txns.push({id:nid(),co:CO,type:'gider',date:todayISO(),amount:+e.comm,cat:'Banka & Komisyon',accId:p.accId,desc:'POS komisyonu: '+(p.name||'')});
 save();toast('Hesaba geçti: brüt gelir + komisyon gideri işlendi');go('pos');
}

/* ---------- KREDİ KARTLARI ---------- */
function rCard(){
 const list=byCo(S.cards,CO);
 const totalDebt=list.reduce((s,c)=>s+Math.max(0,cardDebt(c)),0);
 const totalLimit=list.reduce((s,c)=>s+ +(c.limit||0),0);
 document.getElementById('main').innerHTML= topbar('Kredi Kartları',
  `<button class="btn" data-act="cardForm">＋ Kart Ekle</button>`)+
 (list.length?`<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi n"><div class="l">Toplam Kart Borcu</div><div class="v">${fmt0(totalDebt)}</div></div>
   <div class="kpi"><div class="l">Toplam Limit</div><div class="v">${fmt0(totalLimit)}</div></div>
   <div class="kpi a"><div class="l">Kullanılabilir</div><div class="v">${fmt0(totalLimit-totalDebt)}</div><div class="s">Doluluk: %${totalLimit?(totalDebt/totalLimit*100).toFixed(1):0}</div></div>
  </div>
  ${totalDebt>0?`<div class="card"><h2>Borç Dağılımı (kart bazında)</h2>${chartDonut(list.map(c=>({label:c.name,value:Math.max(0,cardDebt(c)),color:hashColor(c.bank||c.name)})),'BORÇ ₺')}</div>`:''}${cardInstCard(list)}`:'')+
 (list.length? `<div class="grid g2">`+list.map(c=>{
   const debt=cardDebt(c);const avail=+c.limit-debt;const due=nextDue(+c.dueDay);const df=daysDiff(due);
   const pct=Math.min(100,Math.max(0,debt/(+c.limit||1)*100));
   const col=hashColor(c.bank||c.name);
   return `<div class="card accCard" style="--ac:${col}">
    <div class="accHead"><span class="avat" style="background:${col}">${esc((c.bank||c.name).charAt(0).toUpperCase())}</span>
     <div><b>${esc(c.name)}</b><div class="tiny">${esc(c.bank||'')} ${c.last4?'· •••• '+esc(c.last4):''}</div></div>
     ${debt>0?`<span class="chip ${df<=3?'n':'w'}" style="margin-left:auto">${remLbl(df)}</span>`:'<span class="chip p" style="margin-left:auto">Borç yok</span>'}</div>
    <div class="grid g2" style="margin:12px 0 10px">
     <div><div class="tiny">Güncel Borç</div><b style="font-size:20px;color:${debt>0?'var(--neg)':'var(--pos)'}">${fmt(debt)}</b></div>
     <div><div class="tiny">Kullanılabilir</div><b style="font-size:20px">${fmt(avail)}</b></div>
    </div>
    <div style="background:var(--bg);border-radius:99px;height:9px;overflow:hidden;margin-bottom:8px"><div style="width:${pct}%;height:100%;background:${pct>80?'var(--neg)':col};transition:width .3s"></div></div>
    <div class="mut">Limit ${fmt0(c.limit)} · doluluk %${pct.toFixed(0)} · kesim: ayın ${c.cutDay}'i · son ödeme: ayın ${c.dueDay}'i${debt>0?' ('+dTR(due)+')':''}</div>
    <div class="cardBtns">
     <button class="btn sm" data-act="cardTxnForm" data-arg="${c.id}~harcama">＋ Harcama</button>
     <button class="btn sm gh" data-act="cardTxnForm" data-arg="${c.id}~odeme">₺ Ödeme Yap</button>
     <button class="btn sm gh" data-act="cardEkstre" data-arg="${c.id}">📄 Ekstre</button>
     <button class="btn sm gh" data-act="cardForm" data-arg="${c.id}">✎</button>
     <button class="btn sm dng" data-act="del" data-arg="card~${c.id}">Sil</button>
    </div></div>`;}).join('')+`</div><div id="cardEkstreBox"></div>`
  :`<div class="card"><div class="empty"><b>Kayıtlı kart yok</b>Limit, hesap kesim ve son ödeme günleriyle kartlarınızı ekleyin; son ödeme hatırlatmaları ana sayfada görünür.</div></div>`);
 document.getElementById('main').insertAdjacentHTML('beforeend',modSum('card'));
}
function cardForm(id){
 const init=id?S.cards.find(c=>c.id===id):{};
 openForm(id?'Kartı Düzenle':'Yeni Kredi Kartı',[
  {name:'name',label:'Kart adı',req:1,ph:'Ör: İş Bankası Maximum'},
  {row:[{name:'bank',label:'Banka'},{name:'last4',label:'Son 4 hane',ph:'1234'}]},
  {row:[{name:'limit',label:'Limit (₺)',type:'number',req:1},{name:'cutDay',label:'Hesap kesim günü',type:'number',req:1,def:1,step:'1',min:1,max:31}]},
  {row:[{name:'dueDay',label:'Son ödeme günü',type:'number',req:1,def:10,step:'1',min:1,max:31},{name:'note',label:'Not'}]}
 ],o=>{ if(id)Object.assign(init,o); else S.cards.push({id:nid(),co:CO,...o}); save();toast('Kart kaydedildi');go('card'); },init||{});
}
function cardTxnForm(cardId,type){
 const flds= type==='harcama'
  ? [{row:[{name:'amount',label:'Tutar (₺)',type:'number',req:1,min:0.01},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]},
     {row:[{name:'cat',label:'Kategori',type:'select',opts:catOpts('gider'),req:1},{name:'taksit',label:'Taksit',type:'select',opts:[[1,'Tek çekim'],[2,'2 taksit'],[3,'3 taksit'],[4,'4 taksit'],[5,'5 taksit'],[6,'6 taksit'],[9,'9 taksit'],[12,'12 taksit']]}]},
     {name:'desc',label:'Açıklama',ph:'Ör: Metro toptan alışveriş'}]
  : [{row:[{name:'amount',label:'Ödeme tutarı (₺)',type:'number',req:1,min:0.01},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]},
     {name:'accId',label:'Hangi hesaptan ödendi',type:'select',opts:accOpts(CO),req:1}];
 openForm(type==='harcama'?'Kart Harcaması':'Kart Ödemesi',flds,o=>{
  S.cardTxns.push(stampCreate({id:nid(),co:CO,cardId,type,...o,amount:+o.amount,taksit:+o.taksit||1}));
  const c=S.cards.find(x=>x.id===cardId)||{};
  if(type==='odeme'&&o.accId){
   S.txns.push(stampCreate({id:nid(),co:CO,type:'gider',date:o.date,amount:+o.amount,cat:'Banka & Komisyon',accId:o.accId,desc:'Kredi kartı ödemesi: '+(c.name||'')}));
  }
  if(type==='harcama'){
   S.txns.push(stampCreate({id:nid(),co:CO,type:'gider',date:o.date,amount:+o.amount,cat:o.cat,accId:'',desc:(o.desc||'')+((+o.taksit||1)>1?' ('+o.taksit+' taksit, kredi kartı)':' (kredi kartı)'),src:'card'}));
  }
  save();toast(type==='harcama'?'Harcama eklendi':'Ödeme kaydedildi');go('card');
 });
}
function cardEkstre(id){
 const c=S.cards.find(x=>x.id===id);if(!c)return;
 const list=S.cardTxns.filter(t=>t.cardId===id).sort((a,b)=>a.date<b.date?1:-1);
 document.getElementById('cardEkstreBox').innerHTML=
  `<div class="card"><h2>Kart Ekstresi — ${esc(c.name)}</h2>
   ${list.length?'<table><thead><tr><th>Tarih</th><th>İşlem</th><th class="num">Tutar</th><th class="rowact"></th></tr></thead><tbody>'+
    list.map(t=>`<tr><td>${dTR(t.date)}</td><td><span class="chip ${t.type==='odeme'?'p':'n'}">${t.type==='odeme'?'Ödeme':'Harcama'}</span> ${esc(t.desc||t.cat||'')}${(+t.taksit||1)>1?' <span class="chip w">'+t.taksit+' taksit</span>':''}</td><td class="num" style="color:${t.type==='odeme'?'var(--pos)':'var(--neg)'}">${t.type==='odeme'?'-':''}${fmt(t.amount)}</td>
    <td class="rowact"><button data-act="del" data-arg="cardT~${t.id}">🗑</button></td></tr>`).join('')+'</tbody></table>'
    :'<div class="empty">Bu kartta hareket yok.</div>'}</div>`;
 try{document.getElementById('cardEkstreBox').scrollIntoView({behavior:'smooth'});}catch(e){}
}

/* ---------- CARİ HESAPLAR ---------- */
var cariTab='all';
function setCariTab(v){cariTab=v;rCari();}
function rCari(){
 const allCari=byCo(S.cari,CO); // v32: TÜM cariler (aktif+pasif) — toplamlar bundan hesaplanır
 const all=allCari.filter(c=>c.active!=='0'); // yalnızca aktif — liste ve sekmeler için
 const inactiveCari=allCari.filter(c=>c.active==='0');
 const isM=c=>c.type==='musteri'||c.type==='her2';
 const isT=c=>c.type==='tedarikci'||c.type==='her2';
 const list= cariTab==='musteri'? all.filter(isM)
  : cariTab==='tedarikci'? all.filter(isT)
  : cariTab==='diger'? all.filter(c=>c.type==='diger')
  : all;
 const rows=list.map(c=>({c,b:cariBalance(c)}));
 const allRows=allCari.map(c=>({c,b:cariBalance(c)})); // toplamlar İÇİN pasif dahil tüm cariler
 let alacak=0,borc=0;
 for(const r of allRows){if(r.b>0)alacak+=r.b;else borc+=-r.b;}
 const topAlacak=rows.filter(r=>r.b>0).sort((a,b)=>b.b-a.b).slice(0,6);
 const topBorc=rows.filter(r=>r.b<0).sort((a,b)=>a.b-b.b).slice(0,6);
 const TT={musteri:'Müşteri',tedarikci:'Tedarikçi',her2:'Müşteri+Tedarikçi',diger:'Diğer'};
 document.getElementById('main').innerHTML= topbar('Cari Hesaplar',
  `<button class="btn" data-act="cariForm">＋ Cari Ekle</button>`)+
 seg([['all','Tümü',all.length],['musteri','Müşteriler',all.filter(isM).length],['tedarikci','Tedarikçiler',all.filter(isT).length],['diger','Diğer',all.filter(c=>c.type==='diger').length]],cariTab,'setCariTab')+
 `<div class="grid g3" style="margin-bottom:16px">
  <div class="kpi p"><div class="l">Toplam Alacağımız</div><div class="v">${fmt0(alacak)}</div></div>
  <div class="kpi n"><div class="l">Toplam Borcumuz</div><div class="v">${fmt0(borc)}</div></div>
  <div class="kpi"><div class="l">${cariTab==='all'?'Cari Sayısı':cariTab==='musteri'?'Müşteri Sayısı':cariTab==='tedarikci'?'Tedarikçi Sayısı':'Kayıt Sayısı'}</div><div class="v">${list.length}</div></div></div>
 ${cariAgingCard()}
 ${(topAlacak.length||topBorc.length)?`<div class="grid g2">
  <div class="card"><h2>En Yüksek Alacaklarımız</h2>${topAlacak.length?chartHBars(topAlacak.map(r=>({label:r.c.name,value:r.b,color:'var(--pos)'}))):'<div class="empty">Alacak yok</div>'}</div>
  <div class="card"><h2>En Yüksek Borçlarımız</h2>${topBorc.length?chartHBars(topBorc.map(r=>({label:r.c.name,value:-r.b,color:'var(--neg)'}))):'<div class="empty">Borç yok</div>'}</div>
 </div>`:''}
 ${rows.length? `<div class="grid g2">`+rows.map(({c,b})=>{
   const col=hashColor(c.name);
   const vadeli=S.cariTxns.filter(t=>t.cariId===c.id&&t.vade&&daysDiff(t.vade)<=7&&daysDiff(t.vade)>=-30);
   return `<div class="card accCard" style="--ac:${col}">
    <div class="accHead"><span class="avat" style="background:${col}">${esc(c.name.charAt(0).toUpperCase())}</span>
     <div><b>${esc(c.name)}</b><div class="tiny">${esc(c.phone||'')} ${c.taxNo?'· VN: '+esc(c.taxNo):''}</div></div>
     <span class="chip g" style="margin-left:auto">${TT[c.type]||c.type}</span>${(+c.riskLimit>0&&b>+c.riskLimit)?'<span class="chip n">⚠ Limit aşımı</span>':''}</div>
    <div class="accBal" style="margin-top:10px"><div><div class="tiny">Güncel Bakiye</div>
     <b style="font-size:20px;color:${b>0?'var(--pos)':b<0?'var(--neg)':'var(--ink2)'}">${fmt(Math.abs(b))}</b>
     <div class="tiny">${b>0?'bize borçlu':b<0?'biz borçluyuz':'hesap kapalı'}</div></div>
     ${vadeli.length?`<div><span class="chip ${vadeli.some(v=>daysDiff(v.vade)<=0)?'n':'w'}">⏰ ${vadeli.length} vadeli işlem</span></div>`:''}</div>
    <div class="cardBtns">
     <button class="btn sm" data-act="cariTxnForm" data-arg="${c.id}~borc">＋ Borç</button>
     <button class="btn sm" data-act="cariTxnForm" data-arg="${c.id}~alacak">＋ Alacak</button>
     <button class="btn sm gh" data-act="cariInvoiceForm" data-arg="${c.id}">🧾 Faturalaştır</button>
     <button class="btn sm gh" data-act="cariEkstre" data-arg="${c.id}">📄 Ekstre</button>
     <button class="btn sm gh" data-act="cariForm" data-arg="${c.id}">✎</button>
     <button class="btn sm gh" data-act="cariDeactivate" data-arg="${c.id}">⏸ Pasife Al</button>
     <button class="btn sm dng" data-act="del" data-arg="cari~${c.id}">Sil</button>
    </div></div>`;}).join('')+`</div>`
  :'<div class="card"><div class="empty"><b>Bu sekmede cari yok</b>Müşteri ve tedarikçilerinizi ekleyin; borç-alacak ve vade takibi burada yapılır.</div></div>'}
 ${inactiveCari.length?`<div class="card"><h2>⏸ Pasif Cariler <span class="tiny">(${inactiveCari.length}) — bakiyeleri toplamlara dahil edilmeye devam eder, sadece yeni işlem listelerinden gizlenir</span></h2>
  <table><thead><tr><th>Cari</th><th class="num">Bakiye</th><th class="rowact"></th></tr></thead><tbody>
  ${inactiveCari.map(c=>{const b=cariBalance(c);return `<tr><td><span class="avat sm" style="background:${hashColor(c.name)}">${esc(c.name.charAt(0))}</span> ${esc(c.name)} <span class="tiny">${TT[c.type]||c.type}</span></td>
  <td class="num">${fmt(Math.abs(b))} ${b>0?'(bize borçlu)':b<0?'(biz borçluyuz)':''}</td>
  <td class="rowact"><button class="btn sm gh" data-act="cariReactivate" data-arg="${c.id}">↩ Aktif Et</button><button class="btn sm dng" data-act="del" data-arg="cari~${c.id}">🗑 Sil</button></td></tr>`;}).join('')}
  </tbody></table></div>`:''}
 <div id="cariEkstreBox"></div>`;
 document.getElementById('main').insertAdjacentHTML('beforeend',modSum('cari'));
}
function cariDeactivate(id){
 const c=S.cari.find(x=>x.id===id);if(!c)return;
 c.active='0';logAudit('Cari pasife alındı',c.name);save();toast(c.name+' pasife alındı — bakiyesi toplamlarda görünmeye devam eder');go('cari');
}
function cariReactivate(id){
 const c=S.cari.find(x=>x.id===id);if(!c)return;
 c.active='1';logAudit('Cari yeniden aktif edildi',c.name);save();toast(c.name+' yeniden aktif edildi');go('cari');
}
function cariForm(id){
 const init=id?S.cari.find(c=>c.id===id):{type:'tedarikci'};
 openForm(id?'Cari Düzenle':'Yeni Cari',[
  {name:'name',label:'Unvan / Ad',req:1,ph:'Ör: Anadolu Gıda Ltd.'},
  {name:'type',label:'Cari türü',type:'select',opts:[['musteri','Müşteri'],['tedarikci','Tedarikçi'],['her2','Müşteri + Tedarikçi'],['diger','Diğer']]},
  {row:[{name:'taxNo',label:'Vergi No / TCKN'},{name:'phone',label:'Telefon'}]},
  {row:[{name:'email',label:'E-posta',type:'email'},{name:'vadeGun',label:'Varsayılan vade (gün)',type:'number',step:'1',def:30}]},
  {row:[{name:'opening',label:'Açılış bakiyesi ₺ (+ alacağımız / − borcumuz)',type:'number',def:0},{name:'riskLimit',label:'Risk limiti (₺)',type:'number'}]},
  {name:'note',label:'Not',type:'textarea'}
 ],o=>{ if(id)Object.assign(init,o); else S.cari.push({id:nid(),co:CO,...o}); save();toast('Cari kaydedildi');go('cari'); },init||{});
}
function cariTxnForm(cariId,defType){
 const c=S.cari.find(x=>x.id===cariId)||{};
 openForm('Cari Hareket — '+(c.name||''),[
  {name:'type',label:'İşlem',type:'select',opts:[['borc','Borçlandır (satış yaptık / alacağımız arttı)'],['alacak','Alacaklandır (tahsilat / borcumuz arttı)']],req:1,def:defType||'borc'},
  {row:[{name:'amount',label:'Tutar (₺)',type:'number',req:1,min:0.01},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]},
  {name:'nakit',label:'Nakit Hareketi (para gerçekten hesaba girdi/çıktıysa)',type:'select',opts:[['','Yok — sadece cari kaydı (veresiye)'],['gelir','💰 Bu hesaba PARA GİRİŞİ oldu (tahsilat)'],['gider','💸 Bu hesaptan PARA ÇIKIŞI oldu (ödeme)']],def:''},
  {name:'accId',label:'Hangi hesap (nakit hareketi seçtiyseniz)',type:'select',opts:accOpts(CO,1)},
  {name:'vade',label:'Vade tarihi (hatırlatma için)',type:'date',def:c.vadeGun?addDays(todayISO(),+c.vadeGun):''},
  {name:'desc',label:'Açıklama',ph:'Fatura no, işlem detayı...'}
 ],o=>{
  S.cariTxns.push(stampCreate({id:nid(),co:CO,cariId,...o,amount:+o.amount}));
  let nakitMsg='';
  if(o.nakit&&o.accId){ // v28: cari harekete ek olarak, gerçek hesaba işleyen bağlantılı bir gelir/gider kaydı da oluşturur
   S.txns.push(stampCreate({id:nid(),co:CO,type:o.nakit,date:o.date,amount:+o.amount,accId:o.accId,
    cat:o.nakit==='gelir'?'Diğer Gelir':'Diğer Gider',
    desc:(o.nakit==='gelir'?'Cari tahsilat: ':'Cari ödeme: ')+(c.name||'')+(o.desc?' - '+o.desc:'')}));
   nakitMsg=' + nakit hareketi işlendi';
  }else if(o.nakit&&!o.accId){
   nakitMsg=' (⚠ hesap seçilmediği için nakit tarafı işlenmedi — yalnızca cari kaydedildi)';
  }
  const bal=cariBalance(S.cari.find(x=>x.id===cariId));
  if(c.riskLimit&&bal>+c.riskLimit)toast('⚠ Risk limiti aşıldı! Bakiye: '+fmt(bal));
  else toast('Hareket kaydedildi'+nakitMsg);
  save();go('cari');
 });
}
/* v27: FATURALAŞTIR — cari hareketin ÜZERİNE, resmi fatura bilgilerini (no, KDV) ekleyen özel bir giriş yolu.
   Bakiye hesaplaması hâlâ AYNI test edilmiş cariTxns/cariBalance mekanizmasını kullanır — buraya dokunulmadı,
   sadece kaydın üzerine fatura no/KDV gibi ek alanlar ve görsel bir "🧾 Fatura" etiketi ekleniyor. */
function cariInvoiceForm(cariId){
 const c=S.cari.find(x=>x.id===cariId)||{};
 openForm('Faturalaştır — '+(c.name||''),[
  {name:'type',label:'Fatura Yönü',type:'select',opts:[['borc','Kestiğimiz fatura (satış — alacağımız artar)'],['alacak','Aldığımız fatura (alış — borcumuz artar)']],req:1,def:'borc'},
  {row:[{name:'faturaNo',label:'Fatura No',req:1,ph:'Ör: A2026-000145'},{name:'date',label:'Fatura Tarihi',type:'date',def:todayISO(),req:1}]},
  {row:[{name:'amount',label:'Tutar ₺ (KDV dahil)',type:'number',req:1,min:0.01},{name:'vat',label:'KDV %',type:'select',opts:[['','KDV yok'],['1','%1'],['10','%10'],['20','%20']]}]},
  {name:'vade',label:'Vade tarihi',type:'date',def:c.vadeGun?addDays(todayISO(),+c.vadeGun):''},
  {name:'desc',label:'Açıklama (opsiyonel)',ph:'Fatura içeriği / not'}
 ],o=>{
  S.cariTxns.push(stampCreate({id:nid(),co:CO,cariId,...o,amount:+o.amount,fatura:true}));
  const bal=cariBalance(S.cari.find(x=>x.id===cariId));
  logAudit('Cari fatura kaydedildi',(c.name||'')+' — '+o.faturaNo);
  if(c.riskLimit&&bal>+c.riskLimit)toast('⚠ Risk limiti aşıldı! Bakiye: '+fmt(bal));
  else toast('🧾 Fatura kaydedildi: '+o.faturaNo);
  save();go('cari');
 });
}
function cariEkstre(id){
 const c=S.cari.find(x=>x.id===id);if(!c)return;
 const list=S.cariTxns.filter(t=>t.cariId===id).sort((a,b)=>a.date<b.date?-1:1);
 let run=+c.opening||0;
 const rows=list.map(t=>{const d=t.type==='borc'?+t.amount:-t.amount;run+=d;
  const vatTag=(t.fatura&&t.vat)?` <span class="tiny">(KDV %${esc(t.vat)}, tutarı: ${fmt(+t.amount*t.vat/(100+ +t.vat))})</span>`:'';
  const acc=t.nakit&&t.accId?S.accounts.find(x=>x.id===t.accId):null;
  const nakitTag=acc?` <span class="chip p">${t.nakit==='gelir'?'💰':'💸'} ${esc(acc.name)}</span>`:'';
  return `<tr><td>${dTR(t.date)}</td><td>${t.fatura?`<span class="chip g">🧾 ${esc(t.faturaNo||'Fatura')}</span> `:''}${esc(t.desc||'')}${vatTag}${nakitTag} ${t.vade?'<div class="tiny">Vade: '+dTR(t.vade)+'</div>':''}</td>
  <td class="num">${t.type==='borc'?fmt(t.amount):''}</td><td class="num">${t.type==='alacak'?fmt(t.amount):''}</td>
  <td class="num" style="font-weight:600">${fmt(run)}</td>
  <td class="rowact"><button data-act="del" data-arg="cariT~${t.id}">🗑</button></td></tr>`;}).join('');
 document.getElementById('cariEkstreBox').innerHTML=
  `<div class="card"><h2>Cari Ekstre — ${esc(c.name)} <button class="btn sm gh" data-act="printPage">🖨 Yazdır</button>${run>0?'<button class="btn sm gh" data-act="aiCollectMail" data-arg="'+id+'">✦ Tahsilat Maili</button>':''}</h2>
  <div class="mut" style="margin-bottom:8px">Açılış: ${fmt(c.opening)} · Güncel bakiye: <b>${fmt(run)}</b> ${run>0?'(bize borçlu)':run<0?'(biz borçluyuz)':''} · 🧾 ${list.filter(t=>t.fatura).length} fatura · 💳 ${list.filter(t=>t.nakit&&t.accId).length} nakit hareketli kayıt</div>
  ${rows?'<table><thead><tr><th>Tarih</th><th>Açıklama</th><th class="num">Borç</th><th class="num">Alacak</th><th class="num">Bakiye</th><th></th></tr></thead><tbody>'+rows+'</tbody></table>':'<div class="empty">Hareket yok.</div>'}</div>`;
 try{document.getElementById('cariEkstreBox').scrollIntoView({behavior:'smooth'});}catch(e){}
}

/* ---------- PERSONEL & MAAŞ ---------- */
var staffTab='kadro';
function setStaffTab(v){staffTab=v;rStaff();}
function rStaff(){
 const list=byCo(S.staff,CO).filter(s=>s.active!=='0');
 const inactiveList=byCo(S.staff,CO).filter(s=>s.active==='0'); // v31: pasif personeli görüp yönetebilme
 const mo=monthISO();
 const pays=S.staffTxns.filter(t=>t.co===CO).sort((a,b)=>a.date<b.date?1:-1);
 const lvs=S.leaves.filter(l=>l.co===CO).sort((a,b)=>a.start<b.start?1:-1);
 const ayOdeme=pays.filter(t=>t.date.startsWith(mo)&&(t.type==='maas'||t.type==='avans')).reduce((s,t)=>s+ +t.amount,0);
 const ms=monthSeries(CO,6,'Personel');
 const TT={maas:'Maaş',avans:'Avans',prim:'Prim',kesinti:'Kesinti'};
 const LT={yillik:'Yıllık izin',ucretsiz:'Ücretsiz izin',rapor:'Sağlık raporu',mazeret:'Mazeret'};
 const stName=id=>(S.staff.find(x=>x.id===id)||{}).name||'?';

 document.getElementById('main').innerHTML= topbar('Personel & Maaş',
  `<button class="btn gh" data-act="leaveForm">🏖 İzin Gir</button><button class="btn" data-act="staffForm">＋ Personel Ekle</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
  <div class="kpi"><div class="l">Aktif Personel</div><div class="v">${list.length}</div></div>
  <div class="kpi"><div class="l">Aylık Maaş Yükü (tanımlı)</div><div class="v">${fmt0(list.reduce((s,x)=>s+ +(x.salary||0),0))}</div></div>
  <div class="kpi n"><div class="l">Bu Ay Ödenen (maaş+avans)</div><div class="v">${fmt0(ayOdeme)}</div></div></div>
 ${seg([['kadro','Kadro',list.length],['odeme','Ödemeler',pays.length],['izin','İzin & Rapor',lvs.length]],staffTab,'setStaffTab')}`+
 (staffTab==='odeme'
 ? `<div class="card"><h2>Tüm Ödeme Kayıtları</h2>
   ${pays.length?'<table><thead><tr><th>Tarih</th><th>Personel</th><th>Tür</th><th class="hidem">Dönem</th><th class="num">Tutar</th><th class="rowact"></th></tr></thead><tbody>'+
    pays.slice(0,80).map(t=>`<tr><td>${dTR(t.date)}</td><td><span class="avat sm" style="background:${hashColor(stName(t.staffId))}">${esc(stName(t.staffId).charAt(0))}</span> ${esc(stName(t.staffId))}</td>
    <td><span class="chip ${t.type==='kesinti'?'n':t.type==='avans'?'w':'g'}">${TT[t.type]||t.type}</span></td><td class="hidem">${t.period?mTR(t.period):''}</td><td class="num">${fmt(t.amount)}</td>
    <td class="rowact"><button data-act="del" data-arg="staffT~${t.id}">🗑</button></td></tr>`).join('')+'</tbody></table>'
    :'<div class="empty"><b>Ödeme kaydı yok</b>Personel kartlarındaki "₺ Ödeme / Avans" ile kayıt oluşturun.</div>'}</div>`
 : staffTab==='izin'
 ? `<div class="card"><h2>İzin & Rapor Kayıtları</h2>
   ${lvs.length?'<table><thead><tr><th>Personel</th><th>Tür</th><th>Tarih Aralığı</th><th>Durum</th><th class="rowact"></th></tr></thead><tbody>'+
    lvs.map(l=>{const aktif=l.start<=todayISO()&&l.end>=todayISO();
     return `<tr><td><span class="avat sm" style="background:${hashColor(stName(l.staffId))}">${esc(stName(l.staffId).charAt(0))}</span> ${esc(stName(l.staffId))}</td>
     <td>${LT[l.type]||l.type}</td><td>${dTR(l.start)} → ${dTR(l.end)}</td>
     <td>${aktif?'<span class="chip w">🏖 Şu an izinde</span>':l.end<todayISO()?'<span class="chip g">Tamamlandı</span>':'<span class="chip p">Planlandı</span>'}</td>
     <td class="rowact"><button data-act="del" data-arg="leave~${l.id}">🗑</button></td></tr>`;}).join('')+'</tbody></table>'
    :'<div class="empty"><b>İzin kaydı yok</b>"🏖 İzin Gir" ile personel izinlerini planlayın.</div>'}</div>`
 : `${ms.some(m=>m.gider>0)?`<div class="card"><h2>Aylık Personel Gideri (son 6 ay)</h2>
  ${chartVBars(ms.map(m=>({label:m.label,bars:[{value:m.gider,color:'var(--acc)',name:'Personel gideri'}]})),180)}</div>`:''}
 ${list.length? `<div class="grid g2">`+list.map(st=>{
   const col=hashColor(st.name);
   const paid=S.staffTxns.filter(t=>t.staffId===st.id&&t.date.startsWith(mo)&&(t.type==='maas'||t.type==='avans')).reduce((s,t)=>s+ +t.amount,0);
   const pct=Math.min(100,paid/(+st.salary||1)*100);
   const onLeave=S.leaves.some(l=>l.staffId===st.id&&l.start<=todayISO()&&l.end>=todayISO());
   return `<div class="card accCard" style="--ac:${col}">
    <div class="accHead"><span class="avat" style="background:${col}">${esc(st.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase())}</span>
     <div><b>${esc(st.name)}</b><div class="tiny">${esc(st.pos||'')} ${st.phone?'· '+esc(st.phone):''}</div></div>
     ${onLeave?'<span class="chip w" style="margin-left:auto">🏖 İzinde</span>':'<span class="chip p" style="margin-left:auto">Aktif</span>'}</div>
    <div class="grid g2" style="margin:12px 0 8px">
     <div><div class="tiny">Net Maaş</div><b style="font-size:19px">${fmt0(st.salary)}</b></div>
     <div><div class="tiny">Bu Ay Ödenen</div><b style="font-size:19px;color:${paid>0?'var(--acc)':'var(--ink3)'}">${fmt0(paid)}</b></div>
    </div>
    <div style="background:#eceff6;border-radius:99px;height:8px;overflow:hidden"><div class="hbFill" style="width:${pct}%;height:100%;background:${col}"></div></div>
    <div class="tiny" style="margin-top:4px">Bu ay maaşın %${pct.toFixed(0)}'i ödendi</div>
    <div class="cardBtns">
     <button class="btn sm" data-act="staffPayForm" data-arg="${st.id}">₺ Ödeme / Avans</button>
     <button class="btn sm gh" data-act="leaveForm" data-arg="${st.id}">🏖 İzin</button>
     <button class="btn sm gh" data-act="staffHist" data-arg="${st.id}">📄 Geçmiş</button>
     <button class="btn sm gh" data-act="staffForm" data-arg="${st.id}">✎</button>
     <button class="btn sm dng" data-act="del" data-arg="staff~${st.id}">⏏ Çıkış</button>
    </div></div>`;}).join('')+`</div>`
  :'<div class="card"><div class="empty"><b>Personel kaydı yok</b>Personellerinizi ekleyip maaş, avans ve izinlerini buradan takip edin.</div></div>'}
 ${inactiveList.length?`<div class="card"><h2>⏸ Pasif Personel <span class="tiny">(${inactiveList.length}) — işten ayrılan veya hatalı eklenen kayıtlar</span></h2>
  <table><thead><tr><th>Ad</th><th class="hidem">Görev</th><th class="rowact"></th></tr></thead><tbody>
  ${inactiveList.map(s=>`<tr><td><span class="avat sm" style="background:${hashColor(s.name)}">${esc(s.name.charAt(0))}</span> ${esc(s.name)}</td><td class="hidem">${esc(s.pos||'')}</td>
  <td class="rowact"><button class="btn sm gh" data-act="staffReactivate" data-arg="${s.id}">↩ Aktif Et</button><button class="btn sm dng" data-act="del" data-arg="staffPerma~${s.id}">🗑 Kalıcı Sil</button></td></tr>`).join('')}
  </tbody></table></div>`:''}`)+
 `<div id="staffHistBox"></div>`;
 document.getElementById('main').insertAdjacentHTML('beforeend',modSum('staff'));
}
function staffForm(id){
 const init=id?S.staff.find(s=>s.id===id):{active:'1'};
 openForm(id?'Personel Düzenle':'Yeni Personel',[
  {name:'name',label:'Ad Soyad',req:1},
  {row:[{name:'pos',label:'Görev / Pozisyon',ph:'Aşçı, Garson...'},{name:'phone',label:'Telefon'}]},
  {row:[{name:'startDate',label:'İşe giriş',type:'date',def:todayISO()},{name:'salary',label:'Net maaş (₺)',type:'number',req:1}]},
  {name:'iban',label:'IBAN'},
  {name:'note',label:'Not',type:'textarea'}
 ],o=>{ if(id)Object.assign(init,o); else S.staff.push({id:nid(),co:CO,active:'1',...o}); save();toast('Personel kaydedildi');go('staff'); },init||{});
}
function staffPayForm(staffId){
 const st=S.staff.find(x=>x.id===staffId)||{};
 openForm('Ödeme — '+(st.name||''),[
  {name:'type',label:'İşlem türü',type:'select',opts:[['maas','Maaş ödemesi'],['avans','Avans'],['prim','Prim / ikramiye'],['kesinti','Kesinti']],req:1},
  {row:[{name:'amount',label:'Tutar (₺)',type:'number',req:1,min:0.01,def:st.salary||''},{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1}]},
  {name:'period',label:'Dönem',type:'month',def:monthISO()},
  {name:'accId',label:'Hangi hesaptan (maaş/avans için)',type:'select',opts:accOpts(CO,1)},
  {name:'desc',label:'Açıklama'}
 ],o=>{
  S.staffTxns.push(stampCreate({id:nid(),co:CO,staffId,...o,amount:+o.amount}));
  if((o.type==='maas'||o.type==='avans')&&o.accId){
   S.txns.push(stampCreate({id:nid(),co:CO,type:'gider',date:o.date,amount:+o.amount,cat:'Personel',accId:o.accId,desc:(o.type==='maas'?'Maaş: ':'Avans: ')+(st.name||'')+' ('+(o.period||'')+')'}));
  }
  save();toast('Kayıt eklendi');go('staff');
 });
}
function leaveForm(staffId){
 const stf=byCo(S.staff,CO).filter(s=>s.active!=='0');
 if(!stf.length)return toast('Önce personel ekleyin');
 const st=staffId?S.staff.find(x=>x.id===staffId):null;
 const flds=[];
 if(!st)flds.push({name:'staffId',label:'Personel',type:'select',opts:stf.map(s=>[s.id,s.name]),req:1});
 flds.push(
  {name:'type',label:'Tür',type:'select',opts:[['yillik','Yıllık izin'],['ucretsiz','Ücretsiz izin'],['rapor','Sağlık raporu'],['mazeret','Mazeret izni']],req:1},
  {row:[{name:'start',label:'Başlangıç',type:'date',def:todayISO(),req:1},{name:'end',label:'Bitiş',type:'date',def:todayISO(),req:1}]},
  {name:'note',label:'Not'});
 openForm('İzin / Rapor'+(st?' — '+st.name:''),flds,o=>{
  S.leaves.push({id:nid(),co:CO,staffId:staffId||o.staffId,...o});
  save();toast('İzin kaydedildi');staffTab='izin';go('staff');
 });
}
function staffReactivate(id){
 const s=S.staff.find(x=>x.id===id);if(!s)return;
 s.active='1';logAudit('Personel yeniden aktif edildi',s.name);save();toast(s.name+' yeniden aktif edildi');go('staff');
}
function staffHist(id){
 const st=S.staff.find(x=>x.id===id);if(!st)return;
 const pays=S.staffTxns.filter(t=>t.staffId===id).sort((a,b)=>a.date<b.date?1:-1);
 const lvs=S.leaves.filter(l=>l.staffId===id).sort((a,b)=>a.start<b.start?1:-1);
 const TT={maas:'Maaş',avans:'Avans',prim:'Prim',kesinti:'Kesinti'};
 const LT={yillik:'Yıllık izin',ucretsiz:'Ücretsiz izin',rapor:'Sağlık raporu',mazeret:'Mazeret'};
 document.getElementById('staffHistBox').innerHTML=
 `<div class="card"><h2>${esc(st.name)} — Ödeme Geçmişi</h2>
  ${pays.length?'<table><thead><tr><th>Tarih</th><th>Tür</th><th class="hidem">Dönem</th><th class="num">Tutar</th><th></th></tr></thead><tbody>'+
   pays.map(t=>`<tr><td>${dTR(t.date)}</td><td>${TT[t.type]||t.type} <span class="tiny">${esc(t.desc||'')}</span></td><td class="hidem">${t.period?mTR(t.period):''}</td><td class="num">${fmt(t.amount)}</td>
   <td class="rowact"><button data-act="del" data-arg="staffT~${t.id}">🗑</button></td></tr>`).join('')+'</tbody></table>':'<div class="empty">Ödeme kaydı yok.</div>'}
  <h2 style="margin-top:16px">İzinler & Raporlar</h2>
  ${lvs.length?'<table><tbody>'+lvs.map(l=>`<tr><td>${dTR(l.start)} → ${dTR(l.end)}</td><td>${LT[l.type]||l.type}</td><td class="tiny">${esc(l.note||'')}</td>
   <td class="rowact"><button data-act="del" data-arg="leave~${l.id}">🗑</button></td></tr>`).join('')+'</tbody></table>':'<div class="empty">İzin kaydı yok.</div>'}
 </div>`;
 try{document.getElementById('staffHistBox').scrollIntoView({behavior:'smooth'});}catch(e){}
}

/* ---------- SABİT & RESMİ ÖDEMELER ---------- */
const FTYPE={kira:'Kira',vergi:'Vergi',sgk:'SGK',fatura:'Fatura'};
const FCOL={kira:'#a24a68',vergi:'#5b7bb4',sgk:'#2a9d8f',fatura:'#e07a3f'};
var fixedTab='ay';
function setFixedTab(v){fixedTab=v;rFixed();}
function rFixed(){
 const list=byCo(S.fixed,CO);
 const per=monthISO();
 const hist=[];
 for(let i=11;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);
  const p=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  const v=S.fixedLogs.filter(l=>l.co===CO&&l.period===p).reduce((s,l)=>s+ +l.amount,0);
  hist.push({label:AYLAR[+p.slice(5)-1].slice(0,3),bars:[{value:v,color:'var(--acc)',name:'Ödenen sabit gider'}]});}
 const byType={};for(const f of list)byType[f.type]=(byType[f.type]||0)+ +f.amount;
 const aylikYuk=list.reduce((s,f)=>s+ +f.amount,0);
 const odenen=S.fixedLogs.filter(l=>l.co===CO&&l.period===per).reduce((s,l)=>s+ +l.amount,0);
 const logs=S.fixedLogs.filter(l=>l.co===CO).sort((a,b)=>a.paidDate<b.paidDate?1:-1);

 document.getElementById('main').innerHTML= topbar('Sabit & Resmi Ödemeler',
  `<button class="btn" data-act="fixedForm">＋ Ödeme Tanımla</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi"><div class="l">Aylık Sabit Yük (tanımlı)</div><div class="v">${fmt0(aylikYuk)}</div></div>
   <div class="kpi p"><div class="l">${mTR(per)} Ödenen</div><div class="v">${fmt0(odenen)}</div></div>
   <div class="kpi n"><div class="l">Bu Ay Kalan</div><div class="v">${fmt0(Math.max(0,aylikYuk-odenen))}</div></div>
  </div>
  ${seg([['ay','Bu Ay Durumu',list.length],['gecmis','Ödeme Geçmişi',logs.length]],fixedTab,'setFixedTab')}`+
 (fixedTab==='gecmis'
 ? `<div class="card"><h2>Son 12 Ay Ödenen Sabit Giderler</h2>${hist.some(h=>h.bars[0].value>0)?chartVBars(hist,170):'<div class="empty">Henüz ödeme geçmişi yok</div>'}</div>
  <div class="card"><h2>Tüm Ödeme Kayıtları</h2>
  ${logs.length?'<table><thead><tr><th>Dönem</th><th>Ödeme</th><th>Tarih</th><th class="num">Tutar</th><th class="rowact"></th></tr></thead><tbody>'+
   logs.slice(0,80).map(l=>{const f=S.fixed.find(x=>x.id===l.fixedId)||{};
    return `<tr><td>${mTR(l.period)}</td><td><span class="chip g" style="background:${FCOL[f.type]||'#888'}22;color:${FCOL[f.type]||'#555'}">${FTYPE[f.type]||''}</span> ${esc(f.name||'?')}</td><td>${dTR(l.paidDate)}</td><td class="num">${fmt(l.amount)}</td>
    <td class="rowact"><button data-act="del" data-arg="fixedL~${l.id}">🗑</button></td></tr>`;}).join('')+'</tbody></table>'
   :'<div class="empty"><b>Ödeme geçmişi yok</b>Bu Ay sekmesinden "Öde" ile ilk kaydı oluşturun.</div>'}</div>`
 : `${list.length?`<div class="card"><h2>Tür Dağılımı (aylık tanımlı)</h2>${chartDonut(Object.entries(byType).map(([t,v])=>({label:FTYPE[t],value:v,color:FCOL[t]})),'AYLIK ₺')}</div>`:''}
  <div class="card"><h2>${mTR(per)} Ödeme Durumu</h2>
  ${list.length? '<table><thead><tr><th>Ödeme</th><th class="hidem">Gün</th><th class="num">Tutar</th><th>Durum</th><th class="rowact"></th></tr></thead><tbody>'+
   list.map(f=>{
    const log=S.fixedLogs.find(l=>l.fixedId===f.id&&l.period===per);
    const d=nextDue(+f.payDay);const df=daysDiff(d);
    return `<tr><td><span class="chip g" style="background:${FCOL[f.type]}22;color:${FCOL[f.type]}">${FTYPE[f.type]}</span> <b>${esc(f.name)}</b></td>
    <td class="hidem">Her ayın ${f.payDay}'i</td><td class="num">${fmt0(log?log.amount:f.amount)}</td>
    <td>${log?`<span class="chip p">Ödendi ✓ ${dTR(log.paidDate)}</span>`
      :`<span class="chip ${df<=0?'n':df<=5?'w':'g'}">${df<0?'Gecikti':'Bekliyor'} · ${dTR(d)}</span> <button class="btn sm" data-act="payFixed" data-arg="${f.id}">Öde</button>`}</td>
    <td class="rowact"><button title="Geçmiş" data-act="fixedHist" data-arg="${f.id}">📄</button><button data-act="fixedForm" data-arg="${f.id}">✎</button><button data-act="del" data-arg="fixed~${f.id}">🗑</button></td></tr>`;}).join('')+'</tbody></table>'
   :'<div class="empty"><b>Sabit ödeme tanımlı değil</b>Kira, vergi, SGK ve faturalarınızı (elektrik, su, doğalgaz, internet...) sınırsız tanımlayın; her ay tek tıkla "Ödendi" işaretleyin.</div>'}
 </div>`)+`<div id="fixedHistBox"></div>`;
}
function fixedForm(id){
 const init=id?S.fixed.find(f=>f.id===id):{type:'fatura'};
 openForm(id?'Ödeme Düzenle':'Yeni Sabit Ödeme',[
  {name:'type',label:'Tür',type:'select',opts:[['kira','Kira'],['vergi','Vergi'],['sgk','SGK'],['fatura','Fatura / Abonelik']],req:1},
  {name:'name',label:'Ad',req:1,ph:'Ör: Elektrik Faturası / Dükkan Kirası / KDV'},
  {row:[{name:'payDay',label:'Ödeme günü (ayın kaçı)',type:'number',req:1,def:1,step:'1',min:1,max:31},{name:'amount',label:'Ortalama tutar (₺) — opsiyonel',type:'number',ph:'Değişkense boş bırakın'}]},
  {name:'note',label:'Not (abone no vb.)'}
 ],o=>{ if(id)Object.assign(init,o); else S.fixed.push({id:nid(),co:CO,...o}); save();toast('Tanım kaydedildi');go('fixed'); },init||{});
}
function payFixed(fid){
 const f=S.fixed.find(x=>x.id===fid);if(!f)return;
 if(!byCo(S.accounts,CO).length)return toast('Önce Banka & Kasa ekranından bir hesap ekleyin');
 openForm('Ödeme Yap — '+f.name,[
  {row:[{name:'amount',label:'Ödenen tutar (₺)',type:'number',req:1,def:f.amount},{name:'paidDate',label:'Ödeme tarihi',type:'date',def:todayISO(),req:1}]},
  {name:'accId',label:'Hangi hesaptan',type:'select',opts:accOpts(CO),req:1},
  {name:'period',label:'Dönem',type:'month',def:monthISO(),req:1}
 ],o=>{
  const cat= f.type==='kira'?'Kira': f.type==='fatura'?'Fatura & Abonelik':'Vergi & SGK';
  const tx={id:nid(),co:CO,type:'gider',date:o.paidDate,amount:+o.amount,cat,accId:o.accId,desc:FTYPE[f.type]+' ödemesi: '+f.name+' ('+mTR(o.period)+')'};
  S.txns.push(tx);
  S.fixedLogs.push({id:nid(),co:CO,fixedId:fid,period:o.period,amount:+o.amount,paidDate:o.paidDate,txnId:tx.id});
  save();toast(f.name+' ödendi olarak işaretlendi');go('fixed');
 });
}
function fixedHist(fid){
 const f=S.fixed.find(x=>x.id===fid);if(!f)return;
 const logs=S.fixedLogs.filter(l=>l.fixedId===fid).sort((a,b)=>a.period<b.period?1:-1);
 document.getElementById('fixedHistBox').innerHTML=
 `<div class="card"><h2>Ödeme Geçmişi — ${esc(f.name)}</h2>
  ${logs.length?'<table><thead><tr><th>Dönem</th><th>Ödeme Tarihi</th><th class="num">Tutar</th><th></th></tr></thead><tbody>'+
   logs.map(l=>`<tr><td>${mTR(l.period)}</td><td>${dTR(l.paidDate)}</td><td class="num">${fmt(l.amount)}</td>
   <td class="rowact"><button data-act="del" data-arg="fixedL~${l.id}">🗑</button></td></tr>`).join('')+'</tbody></table>'
   :'<div class="empty">Ödeme geçmişi yok.</div>'}</div>`;
 try{document.getElementById('fixedHistBox').scrollIntoView({behavior:'smooth'});}catch(e){}
}

/* ---------- RAPORLAR (şirket) ---------- */
var repRange={from:monthISO()+'-01',to:todayISO()};
function rangePreset(k){return k==='g30'?{from:addDays(todayISO(),-29),to:todayISO()}:k==='yil'?{from:new Date().getFullYear()+'-01-01',to:todayISO()}:{from:monthISO()+'-01',to:todayISO()};}
function repSetFrom(v){repRange.from=v;rRep();}
function repSetTo(v){repRange.to=v;rRep();}
function repPreset(k){repRange=rangePreset(k);rRep();}
function pnlCard(s,prevS,cats,catsG){
 const chg=pctChange(s.net,prevS.net);
 const gRows=catsG.length?catsG.map(x=>'<tr><td>'+esc(x[0])+'</td><td class="num">'+fmt0(x[1])+'</td></tr>').join(''):'<tr><td colspan="2" class="tiny">Bu dönemde gelir kaydı yok</td></tr>';
 const xRows=cats.length?cats.map(x=>'<tr><td>'+esc(x[0])+'</td><td class="num">'+fmt0(x[1])+'</td></tr>').join(''):'<tr><td colspan="2" class="tiny">Bu dönemde gider kaydı yok</td></tr>';
 return '<div class="card"><h2>📑 Kâr / Zarar Tablosu</h2>'+
  '<div style="overflow-x:auto"><table><tbody>'+
   '<tr style="background:var(--acc-soft)"><td colspan="2"><b>GELİRLER</b></td></tr>'+gRows+
   '<tr><td><b>Toplam Gelir</b></td><td class="num" style="color:var(--pos);font-weight:700">'+fmt0(s.gelir)+'</td></tr>'+
   '<tr style="background:var(--acc-soft)"><td colspan="2"><b>GİDERLER</b></td></tr>'+xRows+
   '<tr><td><b>Toplam Gider</b></td><td class="num" style="color:var(--neg);font-weight:700">'+fmt0(s.gider)+'</td></tr>'+
  '</tbody></table></div>'+
  '<div class="grid g3" style="margin-top:14px">'+
   '<div class="kpi '+(s.net>=0?'p':'n')+'"><div class="l">Net Kâr/Zarar</div><div class="v">'+fmt0(s.net)+'</div></div>'+
   '<div class="kpi"><div class="l">Kâr Marjı</div><div class="v">%'+(s.gelir?(s.net/s.gelir*100).toFixed(1):'0')+'</div></div>'+
   '<div class="kpi '+(chg>=0?'p':'n')+'"><div class="l">Önceki Döneme Göre</div><div class="v">'+(chg>=0?'▲ +':'▼ ')+Math.abs(chg).toFixed(1)+'%</div><div class="s">Önceki net: '+fmt0(prevS.net)+'</div></div>'+
  '</div></div>';
}
function cashFlowCard(co,from,to){
 const accs=byCo(S.accounts,co);
 if(!accs.length) return '<div class="card"><h2>💵 Nakit Giriş-Çıkış Raporu</h2><div class="empty">Henüz kayıtlı hesap yok.</div></div>';
 const rows=accs.map(a=>({a,f:accRangeFlow(a,from,to)}));
 const tOpen=rows.reduce((s,r)=>s+r.f.opening,0), tIn=rows.reduce((s,r)=>s+r.f.into,0), tOut=rows.reduce((s,r)=>s+r.f.out,0), tClose=rows.reduce((s,r)=>s+r.f.closing,0);
 const trs=rows.map(r=>'<tr><td>'+(r.a.type==='kasa'?'💵 ':'🏦 ')+esc(r.a.name)+'</td>'+
   '<td class="num">'+fmt0(r.f.opening)+'</td>'+
   '<td class="num" style="color:var(--pos)">+'+fmt0(r.f.into)+'</td>'+
   '<td class="num" style="color:var(--neg)">-'+fmt0(r.f.out)+'</td>'+
   '<td class="num" style="font-weight:700">'+fmt0(r.f.closing)+'</td></tr>').join('');
 return '<div class="card"><h2>💵 Nakit Giriş-Çıkış Raporu <span class="tiny">hesap bazında</span></h2>'+
  '<div style="overflow-x:auto"><table><thead><tr><th>Hesap</th><th class="num">Dönem Başı</th><th class="num">Giriş</th><th class="num">Çıkış</th><th class="num">Dönem Sonu</th></tr></thead><tbody>'+trs+
  '<tr style="background:var(--acc-soft)"><td><b>TOPLAM</b></td><td class="num"><b>'+fmt0(tOpen)+'</b></td><td class="num" style="color:var(--pos)"><b>+'+fmt0(tIn)+'</b></td><td class="num" style="color:var(--neg)"><b>-'+fmt0(tOut)+'</b></td><td class="num"><b>'+fmt0(tClose)+'</b></td></tr>'+
  '</tbody></table></div></div>';
}
function kdvCard(co,from,to){
 const k=kdvSummary(co,from,to);
 const rateRows=Object.entries(k.byRate).sort((a,b)=>b[1]-a[1]);
 if(!k.tahsil&&!k.odenen)return '<div class="card"><h2>🧾 KDV Özeti</h2><div class="empty">Seçili dönemde KDV oranı girilmiş kayıt yok.</div></div>';
 return '<div class="card"><h2>🧾 KDV Özeti <span class="tiny">seçili dönem</span></h2>'+
  '<div class="grid g3">'+
   '<div class="kpi p"><div class="l">Tahsil Edilen (Satış)</div><div class="v">'+fmt0(k.tahsil)+'</div></div>'+
   '<div class="kpi n"><div class="l">Ödenen (Alış/Gider)</div><div class="v">'+fmt0(k.odenen)+'</div></div>'+
   '<div class="kpi '+(k.net>=0?'a':'n')+'"><div class="l">'+(k.net>=0?'Ödenecek KDV':'Devreden KDV')+'</div><div class="v">'+fmt0(Math.abs(k.net))+'</div></div>'+
  '</div>'+
  (rateRows.length?'<table style="margin-top:12px"><thead><tr><th>Oran / Yön</th><th class="num">Tutar</th></tr></thead><tbody>'+
   rateRows.map(([k2,v])=>'<tr><td>'+esc(k2)+'</td><td class="num">'+fmt0(v)+'</td></tr>').join('')+'</tbody></table>':'')+
  '<p class="tiny" style="margin-top:10px">Tutarların KDV dahil girildiği varsayılarak hesaplanır (işlem eklerken seçilen KDV % oranına göre). Bu bir vergi danışmanlığı değildir — beyanname öncesi muhasebecinizle teyit edin.</p></div>';
}
function rRep(){
 const {from,to}=repRange;
 const s=sumRange(CO,from,to);
 const pp=prevPeriodOf(from,to);
 const prevS=sumRange(CO,pp.from,pp.to);
 const cats=Object.entries(s.byCat).sort((a,b)=>b[1]-a[1]);
 const catsG=Object.entries(s.byCatG).sort((a,b)=>b[1]-a[1]);
 const ms=monthSeries(CO,6);
 document.getElementById('main').innerHTML= topbar('Raporlar',
  `<button class="btn gh" data-act="excelDl" data-arg="co">📊 Excel</button><button class="btn gh" data-act="pdfPrint">🖨 PDF</button><button class="btn" data-act="aiSummary" data-arg="co">✦ AI ile Özetle</button><button class="btn gh" data-act="aiCFO">🧠 CFO Analizi</button>`)+
 `<div class="card"><div class="filters">
   <span class="mut" style="align-self:center">Dönem:</span>
   <input type="date" value="${from}" data-actv="repSetFrom">
   <input type="date" value="${to}" data-actv="repSetTo">
   <button class="btn sm gh" data-act="repPreset" data-arg="ay">Bu Ay</button>
   <button class="btn sm gh" data-act="repPreset" data-arg="g30">Son 30 Gün</button>
   <button class="btn sm gh" data-act="repPreset" data-arg="yil">Bu Yıl</button>
  </div>
  <div class="grid g3">
   <div class="kpi p"><div class="l">Toplam Gelir</div><div class="v">${fmt0(s.gelir)}</div></div>
   <div class="kpi n"><div class="l">Toplam Gider</div><div class="v">${fmt0(s.gider)}</div></div>
   <div class="kpi a"><div class="l">Net Sonuç</div><div class="v">${fmt0(s.net)}</div><div class="s">Marj: %${s.gelir?(s.net/s.gelir*100).toFixed(1):0}</div></div>
  </div></div>
  ${pnlCard(s,prevS,cats,catsG)}
  ${kdvCard(CO,from,to)}
  <div class="grid g2">
   <div class="card"><h2>Gider Dağılımı</h2>
    ${cats.length?chartDonut(cats.map(([c,v],i)=>({label:c,value:v,color:PAL[i%PAL.length]})),'GİDER ₺'):'<div class="empty">Seçili dönemde gider yok.</div>'}</div>
   <div class="card"><h2>Gelir Kaynakları</h2>
    ${catsG.length?chartDonut(catsG.map(([c,v],i)=>({label:c,value:v,color:PAL[(i+2)%PAL.length]})),'GELİR ₺'):'<div class="empty">Seçili dönemde gelir yok.</div>'}</div>
  </div>
  <div class="card"><h2>Son 6 Ay Gelir / Gider Trendi</h2>
   ${chartArea([{name:'Gelir',color:'#177e4d',values:ms.map(m=>m.gelir)},{name:'Gider',color:'#c0392b',values:ms.map(m=>m.gider)}],ms.map(m=>m.label),220)}
  </div>
  ${cashFlowCard(CO,from,to)}
  ${fcCard(30)}
  <div id="aiBox"></div>`;
}

/* ---------- GRUP KONSOLİDE RAPORU ---------- */
var grupRange={from:monthISO()+'-01',to:todayISO()};
function grupSetFrom(v){grupRange.from=v;rGrup();}
function grupSetTo(v){grupRange.to=v;rGrup();}
function grupPreset(k){grupRange=rangePreset(k);rGrup();}
function rGrup(){
 const {from,to}=grupRange;
 const rows=COMPANIES.map(c=>{
  const s=sumRange(c.id,from,to);
  let bal=0;for(const a of byCo(S.accounts,c.id))bal+=accBalance(a);
  let alacak=0,borc=0;for(const cr of byCo(S.cari,c.id)){const b=cariBalance(cr);if(b>0)alacak+=b;else borc+=-b;}
  let kartBorc=0;for(const k of byCo(S.cards,c.id))kartBorc+=Math.max(0,cardDebt(k));
  const maasYuku=byCo(S.staff,c.id).filter(x=>x.active!=='0').reduce((s2,x)=>s2+ +(x.salary||0),0);
  return {c,s,bal,alacak,borc,kartBorc,maasYuku};
 });
 const T=k=>rows.reduce((s,r)=>s+(k==='gelir'||k==='gider'||k==='net'?r.s[k]:r[k]),0);
 // grup 6 aylık trend
 const gms=[];
 for(let i=5;i>=0;i--){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);
  const p=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');gms.push({p,label:AYLAR[+p.slice(5)-1].slice(0,3)});}
 const coSeries=COMPANIES.map(c=>{const ms=monthSeries(c.id,6);return {name:c.name.replace('LOLE ',''),color:c.color,values:ms.map(m=>m.gelir)};});

 document.getElementById('main').innerHTML= topbar('LOLE Grup — Konsolide Rapor',
  `<button class="btn gh" data-act="excelDl" data-arg="grup">📊 Excel</button><button class="btn gh" data-act="pdfPrint">🖨 PDF</button><button class="btn" data-act="aiSummary" data-arg="grup">✦ AI ile Özetle</button>`)+
 `<div class="card"><div class="filters">
   <span class="mut" style="align-self:center">Dönem:</span>
   <input type="date" value="${from}" data-actv="grupSetFrom">
   <input type="date" value="${to}" data-actv="grupSetTo">
   <button class="btn sm gh" data-act="grupPreset" data-arg="ay">Bu Ay</button>
   <button class="btn sm gh" data-act="grupPreset" data-arg="g30">Son 30 Gün</button>
   <button class="btn sm gh" data-act="grupPreset" data-arg="yil">Bu Yıl</button>
  </div>
  <div class="grid g4">
   <div class="kpi p"><div class="l">Grup Toplam Gelir</div><div class="v">${fmt0(T('gelir'))}</div></div>
   <div class="kpi n"><div class="l">Grup Toplam Gider</div><div class="v">${fmt0(T('gider'))}</div></div>
   <div class="kpi a"><div class="l">Grup Net</div><div class="v">${fmt0(T('net'))}</div></div>
   <div class="kpi"><div class="l">Grup Nakit + Banka</div><div class="v">${fmt0(T('bal'))}</div></div>
  </div></div>
  <div class="grid g2">
   <div class="card"><h2>Gelir Payları</h2>${chartDonut(rows.map(r=>({label:r.c.name,value:r.s.gelir,color:r.c.color})),'GELİR ₺')}</div>
   <div class="card"><h2>Gelir / Gider Karşılaştırması</h2>
    ${chartVBars(rows.map(r=>({label:r.c.name.replace('LOLE ',''),bars:[{value:r.s.gelir,color:r.c.color,name:'Gelir'},{value:r.s.gider,color:'#c3cad6',name:'Gider'}]})),190)}
    <div class="legend"><span><i style="background:var(--acc)"></i>Gelir (şirket rengi)</span><span><i style="background:#c3cad6"></i>Gider</span></div>
   </div>
  </div>
  <div class="card"><h2>Şirketlerin Aylık Ciro Trendi (6 ay)</h2>
   ${chartArea(coSeries,gms.map(m=>m.label),230)}
  </div>
  <div class="card"><h2>Şirket Karşılaştırma Tablosu</h2>
   <div style="overflow-x:auto"><table><thead><tr><th>Şirket</th><th class="num">Gelir</th><th class="num">Gider</th><th class="num">Net</th><th class="num">Nakit+Banka</th><th class="num">Cari Alacak</th><th class="num">Cari Borç</th><th class="num">Kart Borcu</th><th class="num">Maaş Yükü</th></tr></thead><tbody>
   ${rows.map(r=>`<tr><td><b style="color:${r.c.color}">${r.c.name}</b></td>
    <td class="num" style="color:var(--pos)">${fmt0(r.s.gelir)}</td>
    <td class="num" style="color:var(--neg)">${fmt0(r.s.gider)}</td>
    <td class="num" style="font-weight:700">${fmt0(r.s.net)}</td>
    <td class="num">${fmt0(r.bal)}</td><td class="num">${fmt0(r.alacak)}</td><td class="num">${fmt0(r.borc)}</td>
    <td class="num">${fmt0(r.kartBorc)}</td><td class="num">${fmt0(r.maasYuku)}</td></tr>`).join('')}
   <tr style="background:var(--acc-soft)"><td><b>GRUP TOPLAMI</b></td><td class="num"><b>${fmt0(T('gelir'))}</b></td><td class="num"><b>${fmt0(T('gider'))}</b></td><td class="num"><b>${fmt0(T('net'))}</b></td><td class="num"><b>${fmt0(T('bal'))}</b></td><td class="num"><b>${fmt0(T('alacak'))}</b></td><td class="num"><b>${fmt0(T('borc'))}</b></td><td class="num"><b>${fmt0(T('kartBorc'))}</b></td><td class="num"><b>${fmt0(T('maasYuku'))}</b></td></tr>
   </tbody></table></div></div>
  <div id="aiBox"></div>`;
}

/* ---------- AI RAPOR AJANI ---------- */
function aiDataPack(mode){
 const rng= mode==='grup'?grupRange:repRange;
 if(mode==='grup'){
  return {mode:'grup',donem:rng,sirketler:COMPANIES.map(c=>{
   const s=sumRange(c.id,rng.from,rng.to);let bal=0;for(const a of byCo(S.accounts,c.id))bal+=accBalance(a);
   return {ad:c.name,gelir:s.gelir,gider:s.gider,net:s.net,nakit:bal,giderKirilimi:s.byCat};
  })};
 }
 const s=sumRange(CO,rng.from,rng.to);let bal=0;for(const a of byCo(S.accounts,CO))bal+=accBalance(a);
 return {mode:'sirket',sirket:coName(CO),donem:rng,gelir:s.gelir,gider:s.gider,net:s.net,nakit:bal,giderKirilimi:s.byCat,hatirlatmalar:reminders(CO).slice(0,8).map(r=>r.t+' ('+dTR(r.d)+')')};
}
async function aiSummary(mode){
 const box=document.getElementById('aiBox');
 box.innerHTML='<div class="card"><h2>✦ AI Rapor Ajanı</h2><div class="aiBox">Analiz hazırlanıyor…</div></div>';
 const data=aiDataPack(mode);
 let out='';
 try{
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,messages:[{role:'user',
    content:'Sen bir Türk KOBİ finans danışmanısın. Aşağıdaki muhasebe verilerini kısa ve net Türkçe ile yorumla: 1) Genel durum (2-3 cümle) 2) Dikkat çeken 3 bulgu 3) 2 somut öneri. Rakamları ₺ formatında yaz. Başlık kullanma, madde işareti kullanabilirsin. Veri: '+JSON.stringify(data)}]})});
  const j=await r.json();
  if(j&&j.content) out=j.content.map(c=>c.text||'').join('\n').trim();
 }catch(e){}
 if(!out) out=localAiSummary(data);
 box.innerHTML='<div class="card"><h2>✦ AI Rapor Ajanı <span class="tiny">Yapay zeka tarafından oluşturulmuştur, kontrol ediniz.</span></h2><div class="aiBox">'+esc(out)+'</div></div>';
 try{box.scrollIntoView({behavior:'smooth'});}catch(e){}
}
function localAiSummary(d){
 let L=[];
 if(d.mode==='grup'){
  const t=d.sirketler.reduce((a,s)=>({g:a.g+s.gelir,x:a.x+s.gider,n:a.n+s.net}),{g:0,x:0,n:0});
  const best=d.sirketler.slice().sort((a,b)=>b.net-a.net)[0];
  const worst=d.sirketler.slice().sort((a,b)=>a.net-b.net)[0];
  L.push(`GRUP ÖZETİ (${dTR(d.donem.from)} – ${dTR(d.donem.to)})`);
  L.push(`Toplam gelir ${fmt(t.g)}, toplam gider ${fmt(t.x)}, net sonuç ${fmt(t.n)}.`);
  if(best)L.push(`• En iyi performans: ${best.ad} (net ${fmt(best.net)}).`);
  if(worst&&worst!==best)L.push(`• En zayıf performans: ${worst.ad} (net ${fmt(worst.net)})${worst.net<0?' — zarar var, gider kalemleri incelenmeli.':'.'}`);
  const dusukNakit=d.sirketler.filter(s=>s.nakit<0);
  if(dusukNakit.length)L.push(`• Uyarı: ${dusukNakit.map(s=>s.ad).join(', ')} nakit pozisyonu negatif.`);
  L.push(`Öneri: Kârlılığı düşük şirketlerde en büyük 3 gider kalemini gözden geçirin; grup içi nakit fazlasını ihtiyaç duyan şirkete virmanla yönlendirin.`);
 }else{
  L.push(`${d.sirket} ÖZETİ (${dTR(d.donem.from)} – ${dTR(d.donem.to)})`);
  L.push(`Gelir ${fmt(d.gelir)}, gider ${fmt(d.gider)}, net ${fmt(d.net)}. Nakit+banka: ${fmt(d.nakit)}.`);
  const cats=Object.entries(d.giderKirilimi).sort((a,b)=>b[1]-a[1]);
  if(cats.length){L.push(`• En büyük gider kalemi: ${cats[0][0]} (${fmt(cats[0][1])}, giderin %${(cats[0][1]/(d.gider||1)*100).toFixed(0)}'i).`);}
  if(d.net<0)L.push(`• Dikkat: Dönem zararla kapandı. Gider/gelir dengesi bozulmuş görünüyor.`);
  else if(d.gider>0)L.push(`• Kâr marjı: %${(d.net/(d.gelir||1)*100).toFixed(1)}.`);
  if(d.hatirlatmalar&&d.hatirlatmalar.length)L.push(`• Yaklaşan ödemeler: ${d.hatirlatmalar.slice(0,3).join('; ')}.`);
  L.push(`Öneri: En büyük iki gider kaleminde tedarikçi/fiyat alternatiflerini karşılaştırın ve vadesi yaklaşan ödemeler için nakit planı yapın.`);
 }
 return L.join('\n');
}

/* ---------- GÖREV & DUYURU (kanban pano) ---------- */
var taskTab='pano';var taskWho='';
function setTaskWho(w){taskWho=w;rTask();}
function setTaskTab(v){taskTab=v;rTask();}
const KANBAN=[['acik','Bekliyor','var(--warn)'],['devam','Devam Ediyor','#3a6fb0'],['tamam','Tamamlandı','var(--pos)']];
function rTask(){
 const all=byCo(S.tasks,CO);
 const notes=byCo(S.notes,CO).sort((a,b)=>a.date<b.date?1:-1);
 const acik=all.filter(t=>t.status!=='tamam');
 const geciken=acik.filter(t=>daysDiff(t.due)<0);
 const bugun=acik.filter(t=>daysDiff(t.due)===0);
 const whoSet=[...new Set(all.map(t=>t.who).filter(Boolean))];
 const tasks= taskWho? all.filter(t=>t.who===taskWho) : all;

 document.getElementById('main').innerHTML= topbar('Görev & Duyuru',
  taskTab==='pano'?`<button class="btn" data-act="addTaskForm">＋ Görev Ata</button>`:`<button class="btn" data-act="noteForm">＋ Duyuru</button>`)+
 `<div class="grid g4" style="margin-bottom:16px">
   <div class="kpi"><div class="l">Açık Görev</div><div class="v">${acik.length}</div></div>
   <div class="kpi n"><div class="l">Geciken</div><div class="v">${geciken.length}</div></div>
   <div class="kpi ${bugun.length?'a':''}"><div class="l">Bugün Teslim</div><div class="v">${bugun.length}</div></div>
   <div class="kpi p"><div class="l">Tamamlanan</div><div class="v">${all.length-acik.length}</div></div>
  </div>
  <div class="tabs">
   <button class="${taskTab==='pano'?'on':''}" data-act="setTaskTab" data-arg="pano">📋 Görev Panosu</button>
   <button class="${taskTab==='duyuru'?'on':''}" data-act="setTaskTab" data-arg="duyuru">📢 Duyurular<span class="ct" style="font-size:10px;opacity:.6"> ${notes.length}</span></button>
  </div>`+
 (taskTab==='pano'
 ? `${whoSet.length?`<div class="whoChips"><button class="${taskWho===''?'on':''}" data-act="setTaskWho" data-arg="">Herkes</button>${whoSet.map(w=>`<button class="${taskWho===w?'on':''}" data-act="setTaskWho" data-arg="${esc(w)}">${esc(w)}</button>`).join('')}</div>`:''}
  <div class="kb">${KANBAN.map(([st,lbl,col])=>{
   const items=tasks.filter(t=>(t.status||'acik')===st).sort((a,b)=>a.due<b.due?-1:1);
   return `<div class="kbCol"><h3>${lbl}<span class="ct">${items.length}</span></h3>
    ${items.map(t=>{
     const df=daysDiff(t.due);const done=st==='tamam';
     return `<div class="kbCard" style="--kc:${t.pri==='yuksek'?'var(--neg)':col}">
      <div class="kt" style="${done?'text-decoration:line-through;color:var(--ink3)':''}">${esc(t.title)}</div>
      ${t.desc?`<div class="tiny" style="margin-top:4px">${esc(t.desc)}</div>`:''}
      <div class="km">
       ${t.who?`<span class="avat sm" style="background:${hashColor(t.who)}">${esc(t.who.charAt(0))}</span><span class="tiny" style="font-weight:700">${esc(t.who)}</span>`:'<span class="tiny">Atanmadı</span>'}
       ${t.pri==='yuksek'?'<span class="chip n">Acil</span>':''}
       <span class="chip ${done?'g':df<0?'n':df===0?'w':'g'}" style="margin-left:auto">${done?'✓':'📅 '+dTR(t.due)+' · '+remLbl(df)}</span>
      </div>
      <div class="kbAct">
       ${st==='acik'?`<button class="btn sm gh" data-act="setTaskSt" data-arg="${t.id}~devam">▶ Başlat</button><button class="btn sm" data-act="setTaskSt" data-arg="${t.id}~tamam">✓ Bitir</button>`:''}
       ${st==='devam'?`<button class="btn sm gh" data-act="setTaskSt" data-arg="${t.id}~acik">⏸ Beklet</button><button class="btn sm" data-act="setTaskSt" data-arg="${t.id}~tamam">✓ Bitir</button>`:''}
       ${st==='tamam'?`<button class="btn sm gh" data-act="setTaskSt" data-arg="${t.id}~acik">↩ Geri Aç</button>`:''}
       <button class="btn sm gh" data-act="editTaskForm" data-arg="${t.id}" style="margin-left:auto">✎</button>
       <button class="btn sm dng" data-act="del" data-arg="task~${t.id}">🗑</button>
      </div></div>`;}).join('')||'<div class="empty" style="padding:16px">Görev yok</div>'}
   </div>`;}).join('')}</div>`
 : `<div class="card">${notes.length? notes.map(n=>`<div style="border-left:4px solid ${n.level==='acil'?'var(--neg)':'var(--acc)'};padding:11px 15px;background:#f6f8fc;border-radius:0 12px 12px 0;margin-bottom:10px">
     <b>${esc(n.title)}</b> ${n.level==='acil'?'<span class="chip n">ACİL</span>':''} <span class="tiny">· ${dTR(n.date)}</span>
     <div style="font-size:13.5px;margin-top:4px;white-space:pre-wrap">${esc(n.body)}</div>
     <button class="btn sm gh" style="margin-top:8px" data-act="del" data-arg="note~${n.id}">Sil</button></div>`).join('')
   :'<div class="empty"><b>Duyuru yok</b>Ekibinize duyuru yayınlayın.</div>'}</div>`);
}
function setTaskSt(id,st){const t=S.tasks.find(x=>x.id===id);if(t){t.status=st;save();toast(st==='tamam'?'Görev tamamlandı ✓':st==='devam'?'Görev başlatıldı':'Görev beklemeye alındı');rTask();}}
function tgTask(id){const t=S.tasks.find(x=>x.id===id);if(t){t.status=t.status==='tamam'?'acik':'tamam';save();rTask();}}
function taskFields(init){
 const stf=byCo(S.staff,CO).filter(s=>s.active!=='0').map(s=>s.name);
 const whoFld= stf.length
  ? {name:'who',label:'Atanan personel',type:'select',opts:[['','— Atanmadı —']].concat(stf.map(n=>[n,n]))}
  : {name:'who',label:'Atanan kişi',ph:'Ad Soyad'};
 return [
  {name:'title',label:'Görev başlığı',req:1,ph:'Ör: Gün sonu kasa sayımı'},
  whoFld,
  {row:[{name:'due',label:'Teslim tarihi',type:'date',def:todayISO(),req:1},{name:'pri',label:'Öncelik',type:'select',opts:[['normal','Normal'],['yuksek','Acil']]}]},
  {name:'desc',label:'Açıklama',type:'textarea'}
 ];
}
function addTaskForm(){
 openForm('Görev Ata',taskFields(),o=>{ S.tasks.push({id:nid(),co:CO,status:'acik',...o}); save();toast('Görev atandı');taskTab='pano';go('task'); });
}
function editTaskForm(id){
 const t=S.tasks.find(x=>x.id===id);if(!t)return;
 openForm('Görevi Düzenle',taskFields(t),o=>{ Object.assign(t,o); save();toast('Görev güncellendi');rTask(); },t);
}
function noteForm(){
 openForm('Yeni Duyuru',[
  {name:'title',label:'Başlık',req:1},
  {name:'level',label:'Önem',type:'select',opts:[['normal','Normal'],['acil','Acil']]},
  {name:'body',label:'Duyuru metni',type:'textarea',req:1}
 ],o=>{ S.notes.push({id:nid(),co:CO,date:todayISO(),...o}); save();toast('Duyuru yayınlandı');taskTab='duyuru';go('task'); });
}

/* ---------- AYARLAR ---------- */
function rSet(){
 document.getElementById('main').innerHTML= topbar('Ayarlar','')+
 `<div class="grid g2">
  <div class="card"><h2>Veri Yedekleme Merkezi</h2>
   <p class="mut" style="margin-bottom:12px">Veriler bu yayının tüm yetkili kullanıcıları arasında çevrimiçi ve ortak olarak saklanır (cihazda tutulmaz). Ek güvence için yedeğinizi indirebilir veya kopyalayabilirsiniz.</p>
   <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn" data-act="dlBackup">⬇ Yedek İndir</button>
    <button class="btn gh" data-act="copyBackup">📋 Panoya Kopyala</button>
    ${isSuper()?'<button class="btn gh" data-act="pickBackupFile">⬆ Dosyadan Yükle</button><button class="btn gh" data-act="pasteBackupForm">📥 Yapıştırarak Yükle</button>':''}
    <input type="file" id="upFile" accept=".json" style="display:none" data-actv="upBackupPick">
   </div>
   <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line,#e5e7eb)">
    <button class="btn gh" data-act="testStorage">🔌 Depolama Bağlantısını Test Et</button>
    <div id="storageTestResult" class="tiny" style="margin-top:8px;color:var(--ink3)"></div>
   </div>
   ${isSuper()?'<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn gh" data-act="openBackupList">🗄 Yedek Geçmişi</button><button class="btn gh" data-act="loadDemo">🎲 Örnek Veri Yükle</button></div>':'<p class="tiny" style="margin-top:10px">🔒 Geri yükleme ve örnek veri yükleme yalnızca süper yöneticiye açık — tüm verinin üzerine yazabildiği için.</p>'}
   <p class="tiny" style="margin-top:10px;color:var(--ink3)">🚫 "Tüm verileri sıfırla" özelliği güvenlik amacıyla tamamen kapatılmıştır — hiçbir kullanıcı (süper yönetici dahil) tüm veriyi tek seferde silemez.</p>
  </div>
  <div class="card"><h2>Rapor & Dışa Aktarım Merkezi</h2>
   <p class="mut" style="margin-bottom:12px">Excel raporu artık <b>canlı formüllerle</b> (SUMIFS) birbirine bağlı: Hesaplar/Cariler/Kartlar/Stok bakiyeleri kendi hareket sayfalarından, Özet ise tüm sayfalardan otomatik hesaplanır — Excel'de bir hücreyi değiştirirseniz bağlı toplamlar kendiliğinden güncellenir. ${CO==='grup'?'Grup dosyası karşılaştırma tablosu + 4 şirketin tamamını (şirket başına 18 sayfa) içerir.':'18 sayfa: Özet, Hesaplar, İşlemler, POS, Kartlar + Hareketleri, Cariler + Hareketleri, Personel + Ödemeleri, Sabit Ödemeler + Geçmişi, Çek-Senet, Stok + Hareketleri, Demirbaş, Bütçe, Görevler.'} PDF/yazdırma raporu da aynı derinlikte tüm hareketleri listeler.</p>
   <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn" data-act="excelDl" data-arg="${CO==='grup'?'grup':'co'}">📊 Excel Raporu İndir (formüllü, .xls)</button>
    <button class="btn gh" data-act="pdfPrint">🖨 PDF Olarak Yazdır</button>
    <button class="btn gh" data-act="dlReportHTML">⬇ Rapor Dosyası İndir</button>
   </div>
  </div>
  <div class="card"><h2>Kategori Yönetimi</h2>
   <p class="mut">Gelir Kategorileri</p>
   <div style="margin:6px 0 12px">${S.cats.gelir.map((c,i)=>`<span class="chip g" style="margin:2px">${esc(c)} ${isSuper()?`<button data-act="delCatAsk" data-arg="gelir~${i}" style="color:var(--neg)">×</button>`:''}</span>`).join('')}
    ${isSuper()?'<button class="btn sm gh" data-act="addCat" data-arg="gelir">＋ Ekle</button>':''}</div>
   <p class="mut">Gider Kategorileri</p>
   <div style="margin:6px 0">${S.cats.gider.map((c,i)=>`<span class="chip g" style="margin:2px">${esc(c)} ${isSuper()?`<button data-act="delCatAsk" data-arg="gider~${i}" style="color:var(--neg)">×</button>`:''}</span>`).join('')}
    ${isSuper()?'<button class="btn sm gh" data-act="addCat" data-arg="gider">＋ Ekle</button>':''}
   ${!isSuper()?'<p class="tiny" style="margin-top:8px">🔒 Kategori düzenleme yalnızca süper yöneticiye açık.</p>':''}</div>
  </div>
 </div>
 ${usersCard()}
 ${trashCard()}
 ${auditLogCard()}
 ${modeCard()}
 ${storageUsageCard()}
 ${aiSettingsCard()}
 <div class="card"><h2>Sistem Bilgisi</h2>
  <p class="mut">LOLE Finans & Muhasebe v10.5 (otomatik ekip senkronu ~20 sn) · Tek dosyalık web uygulaması · ${COMPANIES.length} şirket + grup konsolide raporu<br>
  Depolama: 🌐 tamamen bulutta (cihazda otomatik hiçbir şey tutulmaz) · Son kayıt: ${S.meta.saved?new Date(S.meta.saved).toLocaleString('tr-TR'):'—'} · Kullanıcı sayısı: ${(S.users||[]).length} · Bu oturumdaki bulut yedeği: ${lastBackupInfo&&lastBackupInfo.ok?dTR(lastBackupInfo.date)+' ✓':'henüz alınmadı'}<br>
  <b>Bu oturum verisi nereden geldi:</b> ${loadSource} · Cari kayıt sayısı: ${(S.cari||[]).length}<br>
  İşlem kaydı: ${S.txns.length} · Toplam kayıt: ${S.txns.length+S.cariTxns.length+S.cardTxns.length+S.posEntries.length+S.staffTxns.length}</p>
 </div>`;
}
function resetAsk(){ toast('Bu özellik güvenlik nedeniyle devre dışı bırakıldı — hiçbir kullanıcı tüm verileri sıfırlayamaz.'); } // v14: kasıtlı olarak devre dışı — kimse programı sıfırlayamasın
function addCat(t){
 if(!isSuper())return;
 openForm('Yeni '+(t==='gelir'?'Gelir':'Gider')+' Kategorisi',[{name:'name',label:'Kategori adı',req:1}],
  o=>{S.cats[t].push(o.name.trim());logAudit('Kategori eklendi',(t==='gelir'?'Gelir: ':'Gider: ')+o.name.trim());save();toast('Kategori eklendi');rSet();});
}
function delCatAsk(t,i){if(!isSuper())return;delCat(t,+i);}
function delCat(t,i){ if(!isSuper())return; var nm=S.cats[t][i]; uiConfirm('"'+nm+'" kategorisi silinsin mi? (Eski kayıtlar etkilenmez)',()=>{S.cats[t].splice(i,1);logAudit('Kategori silindi',(t==='gelir'?'Gelir: ':'Gider: ')+nm);save();rSet();},{danger:1,yes:'Evet, Sil'}); }
function dlBackup(){
 try{
  const blob=new Blob([JSON.stringify(S,null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='LOLE-yedek-'+todayISO()+'.json';document.body.appendChild(a);a.click();a.remove();
  toast('Yedek indirildi');
 }catch(e){toast('İndirme engellendi — "Panoya Kopyala" seçeneğini kullanın');}
}
async function copyBackup(){
 const j=JSON.stringify(S);
 try{await navigator.clipboard.writeText(j);toast('Yedek panoya kopyalandı ('+Math.round(j.length/1024)+' KB)');}
 catch(e){
  openForm('Yedek Verisi (kopyalayın)',[{name:'j',label:'Aşağıdaki metni seçip kopyalayın',type:'textarea',def:j}],()=>{});
 }
}
function pasteBackupForm(){
 if(!isSuper())return;
 openForm('Yedek Yapıştır',[{name:'j',label:'Yedek JSON metnini buraya yapıştırın',type:'textarea',req:1}],o=>{
  try{const j=JSON.parse(o.j);if(!j.txns||!j.accounts)throw 0;S=fixState(j);logAudit('Yapıştırarak yedek yüklendi','');saveNow();toast('Yedek yüklendi');goSelect();}
  catch(e){toast('Geçersiz yedek verisi');}
 });
}
function pickBackupFile(id){if(!isSuper())return;document.getElementById(id||'upFile').click();}
function upBackupPick(v,el){if(!isSuper())return;upBackup(el);}
function upBackup(inp){
 if(!isSuper())return;
 const f=inp.files[0];if(!f)return;
 const r=new FileReader();
 r.onload=()=>{try{const j=JSON.parse(r.result);if(!j.txns||!j.accounts)throw 0;S=fixState(j);logAudit('Dosyadan yedek yüklendi',f.name||'');saveNow();toast('Yedek yüklendi');goSelect();}catch(e){toast('Geçersiz yedek dosyası');}};
 r.readAsText(f);inp.value='';
}

/* ---------- ZENGİN ÖRNEK VERİ ---------- */
function loadDemo(){
 if(!isSuper())return;
 uiConfirm('Örnek veriler mevcut verilerin YERİNE yüklenecek (180 günlük satış, banka, POS, kart, cari, personel ve sabit ödeme kayıtları). Devam edilsin mi?',()=>{
  genDemo();demoV4Extras();logAudit('Örnek veri yüklendi (mevcut veri değiştirildi)','');saveNow();toast('Örnek veriler yüklendi — 4 şirket dolu');goSelect();
 },{title:'Örnek Veri',yes:'Evet, Yükle'});
}
function genDemo(){
 S=blankState();S.meta.demo=true;
 let seed=20260720;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const SC={rest:1.15,pati:0.72,fact:1.65,loleq:0.55};
 const TEDS=['Anadolu Gıda Tedarik','Marmara Et & Şarküteri','Ege Sebze Hali','Karadeniz Un & Şeker','Öz Ambalaj Sanayi'];
 const MUST=['Vadi Kurumsal Catering','Park AVM Cafe (bayi)'];
 const ADLAR=['Ahmet Yılmaz','Ayşe Demir','Mehmet Kaya','Zeynep Şahin','Mustafa Çelik','Elif Arslan'];
 const ROL={rest:['Şef','Sous Şef','Garson','Garson','Komi','Kasiyer'],pati:['Pasta Şefi','Fırıncı','Tezgahtar','Tezgahtar','Kasiyer','Kurye'],fact:['Üretim Müdürü','Üretim Ustası','Operatör','Operatör','Depocu','Şoför'],loleq:['Mağaza Müdürü','Satış Danışmanı','Satış Danışmanı','Kasiyer','Depocu','Vitrin Uzmanı']};
 const today=todayISO(),per=monthISO();
 const prevPeriod=n=>{const d=new Date();d.setDate(1);d.setMonth(d.getMonth()-n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');};

 for(const c of COMPANIES){const k=SC[c.id];
  const kasa={id:nid(),co:c.id,type:'kasa',name:'Ana Kasa',opening:Math.round(18000*k)};
  const b1={id:nid(),co:c.id,type:'banka',name:'Ziraat Vadesiz',bankName:'Ziraat Bankası',iban:'TR33 0001 0002 3456 7890 '+c.id.toUpperCase(),opening:Math.round(160000*k)};
  const b2={id:nid(),co:c.id,type:'banka',name:'İş Bankası Ticari',bankName:'İş Bankası',iban:'TR64 0006 4000 0011 2345 '+c.id.toUpperCase(),opening:Math.round(85000*k)};
  S.accounts.push(kasa,b1,b2);
  const pos1={id:nid(),co:c.id,name:'Ziraat POS',accId:b1.id,comm:1.89,blokaj:1};
  const pos2={id:nid(),co:c.id,name:'İş Bankası POS',accId:b2.id,comm:2.15,blokaj:2};
  S.pos.push(pos1,pos2);

  // 180 gün satış & işletme giderleri
  for(let i=179;i>=0;i--){
   const d=addDays(today,-i);
   const dow=new Date(d+'T12:00').getDay();
   const boost=(dow===5||dow===6)?1.4:(dow===0?1.15:1);
   const trend=1+(179-i)/179*0.18; // hafif büyüme
   const ciro=Math.round(26000*k*boost*trend*(0.85+rnd()*0.35));
   const nakit=Math.round(ciro*0.34), kart=ciro-nakit;
   S.txns.push({id:nid(),co:c.id,type:'gelir',date:d,amount:nakit,cat:'Satış Geliri',accId:kasa.id,desc:'Gün sonu nakit satış'});
   const p=(i%2)?pos2:pos1;
   const comm=+(kart*p.comm/100).toFixed(2);
   if(i<=2){ // son günler blokajda beklesin
    S.posEntries.push({id:nid(),co:c.id,date:d,posId:p.id,gross:kart,comm,net:+(kart-comm).toFixed(2),settleDate:addDays(d,p.blokaj),status:'bekliyor'});
   }else{
    S.posEntries.push({id:nid(),co:c.id,date:d,posId:p.id,gross:kart,comm,net:+(kart-comm).toFixed(2),settleDate:addDays(d,p.blokaj),status:'gecti'});
    S.txns.push({id:nid(),co:c.id,type:'gelir',date:addDays(d,p.blokaj),amount:kart,cat:'Satış Geliri',accId:p.accId,desc:'POS satışı ('+p.name+')'});
    S.txns.push({id:nid(),co:c.id,type:'gider',date:addDays(d,p.blokaj),amount:comm,cat:'Banka & Komisyon',accId:p.accId,desc:'POS komisyonu'});
   }
   if(i%3===0)S.txns.push({id:nid(),co:c.id,type:'gider',date:d,amount:Math.round(ciro*0.95*0.34),cat:'Hammadde & Malzeme',accId:b1.id,desc:['Toptan gıda alımı','Sebze-meyve alımı','Et & şarküteri','Ambalaj malzemesi'][Math.floor(rnd()*4)]});
   if(dow===1)S.txns.push({id:nid(),co:c.id,type:'gider',date:d,amount:Math.round(2200*k*(0.7+rnd()*0.7)),cat:'Pazarlama',accId:b2.id,desc:'Sosyal medya reklamı'});
   if(rnd()<0.05)S.txns.push({id:nid(),co:c.id,type:'gider',date:d,amount:Math.round(2600*k*(0.5+rnd())),cat:'Bakım & Onarım',accId:kasa.id,desc:'Ekipman bakım-onarım'});
  }

  // kredi kartları
  const cardDefs=[['İş Bankası Maximum','İş Bankası',11],['Garanti Bonus','Garanti BBVA',24]];
  for(const[nm,bk,due]of cardDefs){
   const card={id:nid(),co:c.id,name:nm,bank:bk,last4:String(4000+Math.floor(rnd()*5999)),limit:Math.round(140000*k),cutDay:due-9,dueDay:due};
   S.cards.push(card);
   for(let j=0;j<5;j++){
    const d=addDays(today,-Math.floor(rnd()*45));
    const amt=Math.round(4500*k*(0.5+rnd()*1.6));
    const cat=['Hammadde & Malzeme','Bakım & Onarım','Diğer Gider'][Math.floor(rnd()*3)];
    S.cardTxns.push({id:nid(),co:c.id,cardId:card.id,type:'harcama',date:d,amount:amt,cat,desc:'Kart harcaması'});
    S.txns.push({id:nid(),co:c.id,type:'gider',date:d,amount:amt,cat,accId:'',desc:'Kart harcaması ('+nm+')',src:'card'});
   }
   const ode=Math.round(9000*k);
   S.cardTxns.push({id:nid(),co:c.id,cardId:card.id,type:'odeme',date:addDays(today,-12),amount:ode});
   S.txns.push({id:nid(),co:c.id,type:'gider',date:addDays(today,-12),amount:ode,cat:'Banka & Komisyon',accId:b1.id,desc:'Kredi kartı ödemesi: '+nm});
  }

  // cariler
  TEDS.slice(0,3+Math.floor(rnd()*3)).forEach((nm,ix)=>{
   const cr={id:nid(),co:c.id,type:'tedarikci',name:nm,phone:'0532 4'+String(10+ix)+' '+String(20+ix)+' '+String(30+ix),vadeGun:30,opening:0,taxNo:String(1234500000+ix*7)};
   S.cari.push(cr);
   for(let j=0;j<3;j++){
    const d=addDays(today,-Math.floor(rnd()*60));
    S.cariTxns.push({id:nid(),co:c.id,cariId:cr.id,type:'alacak',amount:Math.round(12000*k*(0.5+rnd()*1.5)),date:d,vade:addDays(d,30),desc:'Mal alım faturası'});
   }
   S.cariTxns.push({id:nid(),co:c.id,cariId:cr.id,type:'borc',amount:Math.round(15000*k*(0.6+rnd())),date:addDays(today,-Math.floor(rnd()*20)),desc:'Ödeme yapıldı'});
  });
  MUST.forEach((nm,ix)=>{
   const cr={id:nid(),co:c.id,type:'musteri',name:nm,phone:'0533 6'+String(40+ix)+' '+String(50+ix)+' '+String(60+ix),vadeGun:15,opening:0};
   S.cari.push(cr);
   const d=addDays(today,-Math.floor(rnd()*15));
   S.cariTxns.push({id:nid(),co:c.id,cariId:cr.id,type:'borc',amount:Math.round(22000*k*(0.6+rnd())),date:d,vade:addDays(d,15),desc:'Kurumsal satış faturası'});
  });

  // personel: son 2 ay maaşları ödendi, bu ay 2 avans
  ADLAR.forEach((nm,ix)=>{
   const st={id:nid(),co:c.id,name:nm,pos:ROL[c.id][ix],phone:'0530 1'+String(10+ix)+' 2'+String(20+ix)+' 3'+String(ix),startDate:'2024-0'+(1+ix%9)+'-15',salary:Math.round((38000+ix*4200)*Math.sqrt(k)),active:'1'};
   S.staff.push(st);
   for(let m=1;m<=2;m++){
    const p2=prevPeriod(m);const pd=p2+'-0'+(3+ix%3);
    S.staffTxns.push({id:nid(),co:c.id,staffId:st.id,type:'maas',date:pd,amount:st.salary,period:p2,accId:b1.id});
    S.txns.push({id:nid(),co:c.id,type:'gider',date:pd,amount:st.salary,cat:'Personel',accId:b1.id,desc:'Maaş: '+nm+' ('+p2+')'});
   }
   if(ix<2){
    const ad=addDays(today,-3-ix*2),av=Math.round(st.salary*0.2);
    S.staffTxns.push({id:nid(),co:c.id,staffId:st.id,type:'avans',date:ad,amount:av,period:per,accId:kasa.id});
    S.txns.push({id:nid(),co:c.id,type:'gider',date:ad,amount:av,cat:'Personel',accId:kasa.id,desc:'Avans: '+nm});
   }
  });
  S.leaves.push({id:nid(),co:c.id,staffId:S.staff[S.staff.length-2].id,start:addDays(today,-1),end:addDays(today,3),type:'yillik',note:'Yıllık izin'});

  // sabit ödemeler + 3 aylık ödeme geçmişi
  const fixDefs=[['kira','İşyeri Kirası',5,Math.round(65000*k)],['sgk','SGK Primi',26,Math.round(38000*k)],['vergi','KDV Beyannamesi',28,Math.round(24000*k)],['fatura','Elektrik Faturası',20,Math.round(13500*k)],['fatura','Su Faturası',18,Math.round(2600*k)],['fatura','İnternet & Telefon',12,Math.round(1900*k)],['fatura','Doğalgaz Faturası',22,Math.round(6200*k)]];
  for(const[tp,nm,gun,amt]of fixDefs){
   const fx={id:nid(),co:c.id,type:tp,name:nm,payDay:gun,amount:amt};
   S.fixed.push(fx);
   for(let m=1;m<=3;m++){
    const p3=prevPeriod(m);
    const paidDate=p3+'-'+String(gun).padStart(2,'0');
    const val=Math.round(amt*(0.92+rnd()*0.16));
    const tx={id:nid(),co:c.id,type:'gider',date:paidDate,amount:val,cat:tp==='kira'?'Kira':tp==='fatura'?'Fatura & Abonelik':'Vergi & SGK',accId:b1.id,desc:FTYPE[tp]+' ödemesi: '+nm+' ('+mTR(p3)+')'};
    S.txns.push(tx);
    S.fixedLogs.push({id:nid(),co:c.id,fixedId:fx.id,period:p3,amount:val,paidDate,txnId:tx.id});
   }
   // bu ay: günü geçmiş olanlardan bazıları ödensin, kalanlar hatırlatıcıda görünsün
   if(+today.slice(8)>gun&&rnd()<0.5){
    const paidDate=per+'-'+String(gun).padStart(2,'0');
    const val=Math.round(amt*(0.95+rnd()*0.1));
    const tx={id:nid(),co:c.id,type:'gider',date:paidDate,amount:val,cat:tp==='kira'?'Kira':tp==='fatura'?'Fatura & Abonelik':'Vergi & SGK',accId:b1.id,desc:FTYPE[tp]+' ödemesi: '+nm+' ('+mTR(per)+')'};
    S.txns.push(tx);
    S.fixedLogs.push({id:nid(),co:c.id,fixedId:fx.id,period:per,amount:val,paidDate,txnId:tx.id});
   }
  }

  // çek & senet
  S.cheques.push(
   {id:nid(),co:c.id,tip:'alinan',tur:'cek',kisi:MUST[0],banka:'Ziraat Bankası',no:'A'+Math.floor(100000+rnd()*899999),tutar:Math.round(45000*k),vade:addDays(today,4),durum:'portfoy'},
   {id:nid(),co:c.id,tip:'alinan',tur:'senet',kisi:MUST[1],banka:'',no:'S'+Math.floor(1000+rnd()*8999),tutar:Math.round(28000*k),vade:addDays(today,25),durum:'portfoy'},
   {id:nid(),co:c.id,tip:'verilen',tur:'cek',kisi:TEDS[0],banka:'İş Bankası',no:'B'+Math.floor(100000+rnd()*899999),tutar:Math.round(36000*k),vade:addDays(today,12),durum:'portfoy'},
   {id:nid(),co:c.id,tip:'alinan',tur:'cek',kisi:MUST[0],banka:'Garanti BBVA',no:'C'+Math.floor(100000+rnd()*899999),tutar:Math.round(19000*k),vade:addDays(today,-20),durum:'kapandi'});
  // stok
  const stokDefs=[['Un (Tip 650)','kg',18,320,100],['Ayçiçek Yağı','lt',72,140,60],['Toz Şeker','kg',32,45,80],['Ambalaj Kutusu','adet',6.5,900,300],['Kahve Çekirdeği','kg',540,42,15],['Süt','lt',26,110,50]];
  stokDefs.forEach((d,ix)=>{
   const it={id:nid(),co:c.id,name:d[0],unit:d[1],cost:d[2],qty:d[3],min:d[4]};
   S.stock.push(it);
   S.stockTxns.push({id:nid(),co:c.id,itemId:it.id,type:'giris',qty:Math.round(d[3]*0.4),date:addDays(today,-6-ix),desc:'Tedarik alımı'});
   S.stockTxns.push({id:nid(),co:c.id,itemId:it.id,type:'cikis',qty:Math.round(d[3]*(ix===2?1.35:0.5)),date:addDays(today,-2),desc:'Üretim kullanımı'});
  });
  // demirbaş
  [['Konveksiyonlu Fırın','Mutfak ekipmanı','Mutfak',185000],['Sanayi Buzdolabı','Soğutma','Depo',96000],['POS Cihazı x2','Elektronik','Kasa',14000],['Salon Mobilya Takımı','Mobilya','Salon',120000]].forEach((d,ix)=>{
   S.assets.push({id:nid(),co:c.id,name:d[0],cat:d[1],loc:d[2],date:addDays(today,-200-ix*40),cost:Math.round(d[3]*k),durum:ix===1?'bakim':'aktif'});
  });
  // bütçe
  [['Hammadde & Malzeme',0.36],['Personel',0.22],['Kira',0.08],['Pazarlama',0.03],['Fatura & Abonelik',0.04],['Bakım & Onarım',0.02]].forEach(d=>{
   S.budgets.push({id:nid(),co:c.id,cat:d[0],amount:Math.round(26000*k*30*d[1])});
  });
  // görev & duyuru
  S.tasks.push(
   {id:nid(),co:c.id,title:'Gün sonu kasa sayımı',who:ADLAR[2],due:today,pri:'normal',status:'acik'},
   {id:nid(),co:c.id,title:'Ekipman bakım & temizliği',who:ADLAR[4],due:addDays(today,2),pri:'normal',status:'devam'},
   {id:nid(),co:c.id,title:'Tedarikçi fiyat listelerini güncelle',who:ADLAR[0],due:addDays(today,-2),pri:'yuksek',status:'acik'},
   {id:nid(),co:c.id,title:'Aylık stok sayımı',who:ADLAR[1],due:addDays(today,-5),pri:'normal',status:'tamam'});
  S.notes.push({id:nid(),co:c.id,date:addDays(today,-1),title:'Aylık ekip toplantısı',body:'Cuma günü saat 15:00\'te aylık değerlendirme toplantısı yapılacaktır. Tüm ekibin katılımı beklenmektedir.',level:'normal'});
 }
}

/* ---------- BAŞLAT + KENDİ KENDİNE TEST ---------- */
function __probe(){window.__probeOK=true;}
function selfTest(){
 try{
  window.__probeOK=false;
  var b=document.createElement('button');
  b.setAttribute('data-act','__probe');b.style.display='none';
  document.body.appendChild(b);
  b.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  b.remove();
  var okStore=!!window.storage;
  if(window.__probeOK){
   toast(okStore?'Sistem hazır ✓ Butonlar çalışıyor, veriler buluta kaydediliyor':'⚠ Butonlar çalışıyor ama bulut depolama bulunamadı — bu genelde artifact henüz yayınlanmadığı için olur. Yayınlamadan veri kalıcı kaydedilmez.');
  }else{
   var d=document.createElement('div');
   d.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99;background:#c2403c;color:#fff;padding:10px 14px;font-size:13px;text-align:center;font-weight:600';
   d.textContent='⚠ Bu görüntüleyici dokunmaları engelliyor. Lütfen dosyayı indirip Chrome / Safari tarayıcısında açın.';
   document.body.appendChild(d);
  }
 }catch(e){}
}
(async function(){
 await loadState();
 var autoOk=await supaAutoLogin();
 if(autoOk){
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('selectScreen').style.display='flex';
  toast('Hoş geldiniz — '+SESSION.username);
  renderSelect();
 }else{
  if(window.__loleBoot&&window.__loleBoot.signOut)window.__loleBoot.signOut();
 }
 setInterval(checkSessionTimeout,60000); // her dakika 48 saatlik hareketsizlik kontrolü
 var le=document.getElementById('loginUser');
 var lp=document.getElementById('loginPw');
 var loginEnter=function(e){if(e.key==='Enter'){e.preventDefault();loginSubmit();}};
 if(le)le.addEventListener('keydown',loginEnter);
 if(lp)lp.addEventListener('keydown',loginEnter);
 var mw=document.getElementById('modalWrap');
 if(mw)mw.addEventListener('click',function(e){if(e.target===mw)closeModal();});
 var ms=document.getElementById('moreSheet');
 if(ms)ms.addEventListener('click',function(e){if(e.target===ms)ms.classList.remove('on');});
 setTimeout(selfTest,400);
})();

/* ================== v3 EKLENTİLERİ ================== */

/* ---------- MODÜL ALTI DÖKÜM & ÖZETLER ---------- */
function foot(cols){return '<tr class="tfoot">'+cols.map(c=>`<td class="${c[1]||''}">${c[0]}</td>`).join('')+'</tr>';}
function modSum(kind){
 const co=CO;
 if(kind==='acc'){
  const accsF=byCo(S.accounts,co).filter(a=>accTab==='all'||a.type===accTab);
  const ids=new Set(accsF.map(a=>a.id));
  const list=S.txns.filter(t=>t.co===co&&(ids.has(t.accId)||ids.has(t.accId2))).sort((a,b)=>a.date<b.date?1:-1);
  if(!list.length)return '';
  let gir=0,cik=0;
  const perAcc=accsF.map(a=>{
   let g=0,x=0;
   for(const t of list){
    if(t.type==='gelir'&&t.accId===a.id)g+=+t.amount;
    else if(t.type==='gider'&&t.accId===a.id)x+=+t.amount;
    else if(t.type==='virman'){if(t.accId2===a.id)g+=+t.amount;if(t.accId===a.id)x+=+t.amount;}
   }
   gir+=g;cik+=x;
   return `<tr><td><b>${esc(a.name)}</b></td><td class="num" style="color:var(--pos)">${fmt(g)}</td><td class="num" style="color:var(--neg)">${fmt(x)}</td><td class="num"><b>${fmt(accBalance(a))}</b></td></tr>`;
  }).join('');
  const rows=list.slice(0,30).map(t=>txRow(t)).join('');
  const bakiyeToplam=accsF.reduce((s,a)=>s+accBalance(a),0); // v25 düzeltme: satırlardaki Güncel Bakiye toplamıyla artık birebir tutarlı (açılış bakiyeleri dahil)
  return `<div class="card"><h2>Hesap Bazlı Toplamlar</h2>
   <table><thead><tr><th>Hesap</th><th class="num">Toplam Giriş</th><th class="num">Toplam Çıkış</th><th class="num">Güncel Bakiye</th></tr></thead><tbody>${perAcc}
   ${foot([['<b>TOPLAM</b>'],[ '<b>'+fmt(gir)+'</b>','num'],['<b>'+fmt(cik)+'</b>','num'],['<b>'+fmt(bakiyeToplam)+'</b>','num']])}</tbody></table></div>
  <div class="card"><h2>Yapılan İşlemler — Satır Satır Döküm <span class="tiny">(son 30 / toplam ${list.length})</span></h2>
   <table><thead><tr><th>Tarih</th><th>İşlem</th><th class="hidem">Kategori</th><th class="num">Tutar</th></tr></thead><tbody>${rows}</tbody></table></div>`;
 }
 if(kind==='pos'){
  const ent=byCo(S.posEntries,co);
  if(!ent.length)return '';
  const months={};
  for(const e of ent){const p=e.date.slice(0,7);months[p]=months[p]||{g:0,k:0,n:0,c:0};months[p].g+=+e.gross;months[p].k+=+e.comm;months[p].n+=+e.net;months[p].c++;}
  const keys=Object.keys(months).sort().reverse().slice(0,6);
  let TG=0,TK=0,TN=0,TC=0;
  const rows=keys.map(p=>{const m=months[p];TG+=m.g;TK+=m.k;TN+=m.n;TC+=m.c;
   return `<tr><td><b>${mTR(p)}</b></td><td class="num">${m.c}</td><td class="num">${fmt(m.g)}</td><td class="num" style="color:var(--neg)">-${fmt(m.k)}</td><td class="num"><b>${fmt(m.n)}</b></td></tr>`;}).join('');
  return `<div class="card"><h2>POS Aylık Özet — İşlem & Veri Toplamları</h2>
   <table><thead><tr><th>Ay</th><th class="num">İşlem</th><th class="num">Brüt Ciro</th><th class="num">Komisyon</th><th class="num">Net</th></tr></thead><tbody>${rows}
   ${foot([['<b>TOPLAM</b>'],[ '<b>'+TC+'</b>','num'],['<b>'+fmt(TG)+'</b>','num'],['<b>-'+fmt(TK)+'</b>','num'],['<b>'+fmt(TN)+'</b>','num']])}</tbody></table></div>`;
 }
 if(kind==='card'){
  const list=S.cardTxns.filter(t=>t.co===co).sort((a,b)=>a.date<b.date?1:-1);
  if(!list.length)return '';
  let H=0,O=0;
  const rows=list.slice(0,30).map(t=>{const c=S.cards.find(x=>x.id===t.cardId)||{};
   if(t.type==='harcama')H+=+t.amount;else O+=+t.amount;
   return `<tr><td>${dTR(t.date)}</td><td><b>${esc(c.name||'?')}</b> <span class="tiny">${esc(t.desc||t.cat||'')}</span></td>
   <td><span class="chip ${t.type==='odeme'?'p':'n'}">${t.type==='odeme'?'Ödeme':'Harcama'}</span></td>
   <td class="num" style="color:${t.type==='odeme'?'var(--pos)':'var(--neg)'}">${fmt(t.amount)}</td></tr>`;}).join('');
  for(const t of list.slice(30)){if(t.type==='harcama')H+=+t.amount;else O+=+t.amount;}
  return `<div class="card"><h2>Kart Hareketleri — Satır Satır Döküm <span class="tiny">(son 30 / toplam ${list.length})</span></h2>
   <table><thead><tr><th>Tarih</th><th>Kart / Açıklama</th><th>Tür</th><th class="num">Tutar</th></tr></thead><tbody>${rows}
   ${foot([['<b>TOPLAM</b>'],[ '<span class="tiny">Harcama: <b>'+fmt(H)+'</b> · Ödeme: <b>'+fmt(O)+'</b></span>'],[''],['<b>Kalan borç: '+fmt(H-O)+'</b>','num']])}</tbody></table></div>`;
 }
 if(kind==='cari'){
  const isM=c=>c.type==='musteri'||c.type==='her2';
  const isT=c=>c.type==='tedarikci'||c.type==='her2';
  const uygun=id=>{const c=S.cari.find(x=>x.id===id);if(!c)return false;
   return cariTab==='musteri'?isM(c):cariTab==='tedarikci'?isT(c):cariTab==='diger'?c.type==='diger':true;};
  const list=S.cariTxns.filter(t=>t.co===co&&uygun(t.cariId)).sort((a,b)=>a.date<b.date?1:-1);
  if(!list.length)return '';
  let B=0,A=0;
  const rows=list.slice(0,30).map(t=>{const c=S.cari.find(x=>x.id===t.cariId)||{};
   return `<tr><td>${dTR(t.date)}</td><td><b>${esc(c.name||'?')}</b> <span class="tiny">${t.fatura?`🧾 ${esc(t.faturaNo||'Fatura')} · `:''}${esc(t.desc||'')}${t.vade?' · Vade: '+dTR(t.vade):''}</span></td>
   <td class="num">${t.type==='borc'?fmt(t.amount):''}</td><td class="num">${t.type==='alacak'?fmt(t.amount):''}</td></tr>`;}).join('');
  for(const t of list){if(t.type==='borc')B+=+t.amount;else A+=+t.amount;}
  return `<div class="card"><h2>Cari Hareket Dökümü <span class="tiny">(son 30 / toplam ${list.length})</span></h2>
   <table><thead><tr><th>Tarih</th><th>Cari / Açıklama</th><th class="num">Borç</th><th class="num">Alacak</th></tr></thead><tbody>${rows}
   ${foot([['<b>TOPLAM</b>'],[''],['<b>'+fmt(B)+'</b>','num'],['<b>'+fmt(A)+'</b>','num']])}</tbody></table></div>`;
 }
 if(kind==='staff'){
  const pays=S.staffTxns.filter(t=>t.co===co);
  if(!pays.length)return '';
  const months={};
  for(const t of pays){const p=(t.period||t.date.slice(0,7));months[p]=months[p]||{maas:0,avans:0,prim:0,kesinti:0};months[p][t.type]=(months[p][t.type]||0)+ +t.amount;}
  const keys=Object.keys(months).sort().reverse().slice(0,6);
  let TM=0,TA=0,TP=0,TK=0;
  const rows=keys.map(p=>{const m=months[p];TM+=m.maas||0;TA+=m.avans||0;TP+=m.prim||0;TK+=m.kesinti||0;
   const top=(m.maas||0)+(m.avans||0)+(m.prim||0)-(m.kesinti||0);
   return `<tr><td><b>${mTR(p)}</b></td><td class="num">${fmt(m.maas||0)}</td><td class="num">${fmt(m.avans||0)}</td><td class="num hidem">${fmt(m.prim||0)}</td><td class="num hidem">${fmt(m.kesinti||0)}</td><td class="num"><b>${fmt(top)}</b></td></tr>`;}).join('');
  return `<div class="card"><h2>Personel Aylık Ödeme Özeti</h2>
   <table><thead><tr><th>Dönem</th><th class="num">Maaş</th><th class="num">Avans</th><th class="num hidem">Prim</th><th class="num hidem">Kesinti</th><th class="num">Toplam</th></tr></thead><tbody>${rows}
   ${foot([['<b>TOPLAM</b>'],[ '<b>'+fmt(TM)+'</b>','num'],['<b>'+fmt(TA)+'</b>','num'],['<b>'+fmt(TP)+'</b>','num hidem'],['<b>'+fmt(TK)+'</b>','num hidem'],['<b>'+fmt(TM+TA+TP-TK)+'</b>','num']])}</tbody></table></div>`;
 }
 return '';
}

/* ---------- ÇEK & SENET ---------- */
function rCek(){
 const list=byCo(S.cheques,CO).sort((a,b)=>a.vade<b.vade?-1:1);
 const alP=list.filter(c=>c.tip==='alinan'&&c.durum==='portfoy');
 const veP=list.filter(c=>c.tip==='verilen'&&c.durum==='portfoy');
 const hafta=list.filter(c=>c.durum==='portfoy'&&daysDiff(c.vade)<=7);
 const DT={portfoy:['Portföyde','g'],kapandi:['Kapandı ✓','p'],karsiliksiz:['Karşılıksız','n']};
 document.getElementById('main').innerHTML= topbar('Çek & Senet',
  `<button class="btn" data-act="cekForm">＋ Çek / Senet Ekle</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi p"><div class="l">Portföydeki Alacak Çekleri</div><div class="v">${fmt0(alP.reduce((s,c)=>s+ +c.tutar,0))}</div><div class="s">${alP.length} adet</div></div>
   <div class="kpi n"><div class="l">Verdiğimiz Çekler (açık)</div><div class="v">${fmt0(veP.reduce((s,c)=>s+ +c.tutar,0))}</div><div class="s">${veP.length} adet</div></div>
   <div class="kpi ${hafta.length?'a':''}"><div class="l">7 Gün İçinde Vadesi Gelen</div><div class="v">${hafta.length}</div></div>
  </div>
  <div class="card"><h2>Çek / Senet Portföyü</h2>
  ${list.length? '<table><thead><tr><th>Tür</th><th>Kişi / Kurum</th><th class="hidem">Banka & No</th><th>Vade</th><th class="num">Tutar</th><th>Durum</th><th class="rowact"></th></tr></thead><tbody>'+
   list.map(c=>{const df=daysDiff(c.vade);
    return `<tr><td><span class="chip ${c.tip==='alinan'?'p':'n'}">${c.tip==='alinan'?'ALINAN':'VERİLEN'}</span> ${c.tur==='senet'?'Senet':'Çek'}</td>
    <td><b>${esc(c.kisi)}</b></td><td class="hidem">${esc(c.banka||'')} ${c.no?'· '+esc(c.no):''}</td>
    <td>${dTR(c.vade)} ${c.durum==='portfoy'?`<span class="chip ${df<0?'n':df<=3?'w':'g'}">${remLbl(df)}</span>`:''}</td>
    <td class="num"><b>${fmt(c.tutar)}</b></td>
    <td><span class="chip ${DT[c.durum][1]}">${DT[c.durum][0]}</span>
     ${c.durum==='portfoy'?`<button class="btn sm" data-act="cekKapat" data-arg="${c.id}">${c.tip==='alinan'?'Tahsil Et':'Öde'}</button>${c.tip==='alinan'?`<button class="btn sm dng" data-act="cekKarsiliksiz" data-arg="${c.id}">Karşılıksız</button>`:''}`:''}</td>
    <td class="rowact"><button data-act="cekForm" data-arg="${c.id}">✎</button><button data-act="del" data-arg="cek~${c.id}">🗑</button></td></tr>`;}).join('')+
   foot([['<b>TOPLAM</b>'],[''],['','hidem'],[''],['<b>'+fmt(list.reduce((s,c)=>s+ +c.tutar,0))+'</b>','num'],[''],['','rowact']])+'</tbody></table>'
   :'<div class="empty"><b>Çek / senet kaydı yok</b>Aldığınız ve verdiğiniz çek-senetleri vade takibiyle buradan yönetin; vadesi yaklaşanlar ana sayfada hatırlatılır.</div>'}
 </div>`;
}
function cekForm(id){
 const init=id?S.cheques.find(c=>c.id===id):{tip:'alinan',tur:'cek',durum:'portfoy'};
 openForm(id?'Çek / Senet Düzenle':'Yeni Çek / Senet',[
  {row:[{name:'tip',label:'Yön',type:'select',opts:[['alinan','Alınan (müşteriden)'],['verilen','Verilen (tedarikçiye)']]},{name:'tur',label:'Tür',type:'select',opts:[['cek','Çek'],['senet','Senet']]}]},
  {name:'kisi',label:'Kişi / Kurum',req:1,ph:'Ör: Anadolu Gıda Ltd.'},
  {row:[{name:'banka',label:'Banka'},{name:'no',label:'Çek / Senet No'}]},
  {row:[{name:'tutar',label:'Tutar (₺)',type:'number',req:1,min:0.01},{name:'vade',label:'Vade tarihi',type:'date',req:1,def:addDays(todayISO(),30)}]},
  {name:'note',label:'Not'}
 ],o=>{ if(id)Object.assign(init,o); else S.cheques.push({id:nid(),co:CO,durum:'portfoy',...o}); save();toast('Çek/senet kaydedildi');go('cek'); },init||{});
}
function cekKapat(id){
 const c=S.cheques.find(x=>x.id===id);if(!c)return;
 const opts=accOpts(CO);
 if(!opts.length)return toast('Önce Banka & Kasa ekranından bir hesap ekleyin');
 openForm((c.tip==='alinan'?'Tahsilat':'Ödeme')+' — '+c.kisi,[
  {name:'accId',label:c.tip==='alinan'?'Hangi hesaba tahsil edildi':'Hangi hesaptan ödendi',type:'select',opts,req:1},
  {name:'date',label:'İşlem tarihi',type:'date',def:todayISO(),req:1}
 ],o=>{
  c.durum='kapandi';
  S.txns.push({id:nid(),co:CO,type:c.tip==='alinan'?'gelir':'gider',date:o.date,amount:+c.tutar,
   cat:c.tip==='alinan'?'Diğer Gelir':'Diğer Gider',accId:o.accId,
   desc:(c.tur==='senet'?'Senet':'Çek')+(c.tip==='alinan'?' tahsilatı: ':' ödemesi: ')+c.kisi+(c.no?' ('+c.no+')':'')});
  save();toast(c.tip==='alinan'?'Çek tahsil edildi, gelir işlendi':'Çek ödendi, gider işlendi');go('cek');
 });
}
function cekKarsiliksiz(id){
 const c=S.cheques.find(x=>x.id===id);if(!c)return;
 uiConfirm(c.kisi+' çeki karşılıksız olarak işaretlensin mi?',()=>{c.durum='karsiliksiz';save();toast('Karşılıksız işaretlendi');go('cek');},{danger:1});
}

/* ---------- STOK TAKİBİ ---------- */
function stockQty(it){
 let q=+it.qty||0;
 for(const t of S.stockTxns) if(t.itemId===it.id&&!t.deletedAt) q+= t.type==='giris'? +t.qty : -t.qty;
 return q;
}
function rStock(){
 const list=byCo(S.stock,CO);
 const rows=list.map(it=>({it,q:stockQty(it)}));
 const deger=rows.reduce((s,r)=>s+r.q*(+r.it.cost||0),0);
 const kritik=rows.filter(r=>r.q<=+(r.it.min||0));
 const moves=byCo(S.stockTxns,CO).sort((a,b)=>a.date<b.date?1:-1);
 document.getElementById('main').innerHTML= topbar('Stok Takibi',
  `<button class="btn gh" data-act="stockTxnForm">⇅ Stok Hareketi</button><button class="btn" data-act="stockForm">＋ Ürün Ekle</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi"><div class="l">Stok Kalemi</div><div class="v">${list.length}</div></div>
   <div class="kpi a"><div class="l">Toplam Stok Değeri</div><div class="v">${fmt0(deger)}</div></div>
   <div class="kpi ${kritik.length?'n':''}"><div class="l">Kritik Seviyede</div><div class="v">${kritik.length}</div></div>
  </div>
  <div class="card"><h2>Ürünler & Mevcut Stok</h2>
  ${rows.length? '<table><thead><tr><th>Ürün</th><th class="num">Miktar</th><th class="num hidem">Birim Maliyet</th><th class="num">Stok Değeri</th><th class="num hidem">Kritik Sınır</th><th class="rowact"></th></tr></thead><tbody>'+
   rows.map(({it,q})=>`<tr><td><span class="avat sm" style="background:${hashColor(it.name)}">${esc(it.name.charAt(0))}</span> <b>${esc(it.name)}</b> <span class="tiny">${esc(it.unit||'')}</span> ${q<=+(it.min||0)?'<span class="chip n">⚠ Kritik</span>':''}</td>
   <td class="num"><b>${q.toLocaleString('tr-TR')}</b></td><td class="num hidem">${fmt(it.cost)}</td><td class="num">${fmt(q*(+it.cost||0))}</td><td class="num hidem">${(+it.min||0).toLocaleString('tr-TR')}</td>
   <td class="rowact"><button data-act="stockForm" data-arg="${it.id}">✎</button><button data-act="del" data-arg="stok~${it.id}">🗑</button></td></tr>`).join('')+
   foot([['<b>TOPLAM</b>'],[''],['','num hidem'],['<b>'+fmt(deger)+'</b>','num'],['','num hidem'],['','rowact']])+'</tbody></table>'
   :'<div class="empty"><b>Ürün yok</b>Hammadde ve ürünlerinizi ekleyin; giriş-çıkış hareketleriyle stok otomatik hesaplanır, kritik seviyeler ana sayfada uyarır.</div>'}
  </div>
  ${moves.length?`<div class="card"><h2>Stok Hareket Dökümü <span class="tiny">(son 25 / toplam ${moves.length})</span></h2>
   <table><thead><tr><th>Tarih</th><th>Ürün</th><th>Hareket</th><th class="num">Miktar</th><th class="rowact"></th></tr></thead><tbody>
   ${moves.slice(0,25).map(t=>{const it=S.stock.find(x=>x.id===t.itemId)||{};
    return `<tr><td>${dTR(t.date)}</td><td><b>${esc(it.name||'?')}</b> <span class="tiny">${esc(t.desc||'')}</span></td>
    <td><span class="chip ${t.type==='giris'?'p':'n'}">${t.type==='giris'?'Giriş':'Çıkış'}</span></td>
    <td class="num">${(+t.qty).toLocaleString('tr-TR')} ${esc(it.unit||'')}</td>
    <td class="rowact"><button data-act="del" data-arg="stokT~${t.id}">🗑</button></td></tr>`;}).join('')}</tbody></table></div>`:''}`;
}
function stockForm(id){
 const init=id?S.stock.find(x=>x.id===id):{unit:'kg'};
 openForm(id?'Ürün Düzenle':'Yeni Ürün',[
  {name:'name',label:'Ürün adı',req:1,ph:'Ör: Un (Tip 650)'},
  {row:[{name:'unit',label:'Birim',type:'select',opts:[['kg','kg'],['lt','lt'],['adet','adet'],['paket','paket'],['koli','koli']]},{name:'cost',label:'Birim maliyet (₺)',type:'number',def:0}]},
  {row:[{name:'qty',label:'Açılış miktarı',type:'number',def:0},{name:'min',label:'Kritik sınır (uyarı)',type:'number',def:0}]}
 ],o=>{ if(id)Object.assign(init,o); else S.stock.push({id:nid(),co:CO,...o}); save();toast('Ürün kaydedildi');go('stok'); },init||{});
}
function stockTxnForm(){
 const opts=byCo(S.stock,CO).map(i=>[i.id,i.name]);
 if(!opts.length)return toast('Önce ürün ekleyin');
 openForm('Stok Hareketi',[
  {name:'itemId',label:'Ürün',type:'select',opts,req:1},
  {row:[{name:'type',label:'Hareket',type:'select',opts:[['giris','Giriş (alım)'],['cikis','Çıkış (kullanım/fire)']]},{name:'qty',label:'Miktar',type:'number',req:1,min:0.001}]},
  {row:[{name:'date',label:'Tarih',type:'date',def:todayISO(),req:1},{name:'desc',label:'Açıklama'}]}
 ],o=>{ S.stockTxns.push({id:nid(),co:CO,...o}); save();toast('Stok hareketi işlendi');go('stok'); });
}

/* ---------- DEMİRBAŞ ---------- */
function rAsset(){
 const list=byCo(S.assets,CO).sort((a,b)=>a.date<b.date?1:-1);
 const toplam=list.reduce((s,a)=>s+ +(a.cost||0),0);
 const AD={aktif:['Kullanımda','p'],bakim:['Bakımda','w'],hurda:['Hurda','n']};
 document.getElementById('main').innerHTML= topbar('Demirbaş & Varlıklar',
  `<button class="btn" data-act="assetForm">＋ Demirbaş Ekle</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi"><div class="l">Demirbaş Adedi</div><div class="v">${list.length}</div></div>
   <div class="kpi a"><div class="l">Toplam Kayıtlı Değer</div><div class="v">${fmt0(toplam)}</div></div>
   <div class="kpi"><div class="l">Bakımda / Hurda</div><div class="v">${list.filter(a=>a.durum!=='aktif').length}</div></div>
  </div>
  <div class="card"><h2>Demirbaş Listesi</h2>
  ${list.length? '<table><thead><tr><th>Demirbaş</th><th class="hidem">Konum</th><th>Alım</th><th class="num">Bedel</th><th>Durum</th><th class="rowact"></th></tr></thead><tbody>'+
   list.map(a=>`<tr><td><span class="avat sm" style="background:${hashColor(a.name)}">${esc(a.name.charAt(0))}</span> <b>${esc(a.name)}</b> <span class="tiny">${esc(a.cat||'')}</span></td>
   <td class="hidem">${esc(a.loc||'')}</td><td>${dTR(a.date)}</td><td class="num">${fmt(a.cost)}</td>
   <td><span class="chip ${AD[a.durum||'aktif'][1]}">${AD[a.durum||'aktif'][0]}</span></td>
   <td class="rowact"><button data-act="assetForm" data-arg="${a.id}">✎</button><button data-act="del" data-arg="asset~${a.id}">🗑</button></td></tr>`).join('')+
   foot([['<b>TOPLAM</b>'],['','hidem'],[''],['<b>'+fmt(toplam)+'</b>','num'],[''],['','rowact']])+'</tbody></table>'
   :'<div class="empty"><b>Demirbaş kaydı yok</b>Fırın, buzdolabı, POS cihazı, mobilya gibi işletme varlıklarınızın envanterini tutun.</div>'}
 </div>`;
}
function assetForm(id){
 const init=id?S.assets.find(x=>x.id===id):{durum:'aktif',date:todayISO()};
 openForm(id?'Demirbaş Düzenle':'Yeni Demirbaş',[
  {name:'name',label:'Demirbaş adı',req:1,ph:'Ör: Konveksiyonlu Fırın'},
  {row:[{name:'cat',label:'Kategori',ph:'Mutfak ekipmanı'},{name:'loc',label:'Konum',ph:'Mutfak / Salon'}]},
  {row:[{name:'date',label:'Alım tarihi',type:'date',def:todayISO()},{name:'cost',label:'Alım bedeli (₺)',type:'number',req:1}]},
  {name:'durum',label:'Durum',type:'select',opts:[['aktif','Kullanımda'],['bakim','Bakımda'],['hurda','Hurda']]},
  {name:'note',label:'Not (seri no vb.)'}
 ],o=>{ if(id)Object.assign(init,o); else S.assets.push({id:nid(),co:CO,...o}); save();toast('Demirbaş kaydedildi');go('asset'); },init||{});
}

/* ---------- BÜTÇE KONTROLÜ ---------- */
function rBudget(){
 const list=byCo(S.budgets,CO);
 const per=monthISO();
 const s=sumRange(CO,per+'-01',todayISO());
 const hedef=list.reduce((t,b)=>t+ +b.amount,0);
 const gercek=list.reduce((t,b)=>t+(s.byCat[b.cat]||0),0);
 document.getElementById('main').innerHTML= topbar('Bütçe Kontrolü',
  `<button class="btn" data-act="budgetForm">＋ Bütçe Kalemi</button>`)+
 `<div class="grid g3" style="margin-bottom:16px">
   <div class="kpi"><div class="l">${mTR(per)} Bütçesi</div><div class="v">${fmt0(hedef)}</div></div>
   <div class="kpi ${gercek>hedef?'n':'p'}"><div class="l">Gerçekleşen Gider</div><div class="v">${fmt0(gercek)}</div></div>
   <div class="kpi a"><div class="l">Kalan Bütçe</div><div class="v">${fmt0(hedef-gercek)}</div><div class="s">Kullanım: %${hedef?(gercek/hedef*100).toFixed(1):0}</div></div>
  </div>
  <div class="card"><h2>Kategori Bazlı Bütçe Takibi — ${mTR(per)}</h2>
  ${list.length? list.map(b=>{
    const g=s.byCat[b.cat]||0;const pct=Math.min(100,g/(+b.amount||1)*100);const asim=g>+b.amount;
    return `<div class="hb"><div class="hbT"><span><b>${esc(b.cat)}</b> ${asim?'<span class="chip n">Bütçe aşıldı!</span>':''}</span>
     <b>${fmt0(g)} / ${fmt0(b.amount)} <button class="btn sm gh" data-act="budgetForm" data-arg="${b.id}">✎</button><button class="btn sm gh" data-act="del" data-arg="budget~${b.id}">🗑</button></b></div>
    <div class="hbTrack" style="height:12px"><div class="hbFill" style="width:${pct}%;background:${asim?'var(--neg)':pct>85?'var(--warn)':'var(--pos)'}"></div></div>
    <div class="tiny" style="margin-top:2px">%${(g/(+b.amount||1)*100).toFixed(1)} kullanıldı · kalan ${fmt0(Math.max(0,+b.amount-g))}${asim?' · aşım '+fmt0(g-+b.amount):''}</div></div>`;
   }).join('')+`<table style="margin-top:10px"><tbody>${foot([['<b>TOPLAM</b>'],['<b>'+fmt(gercek)+' / '+fmt(hedef)+'</b>','num']])}</tbody></table>`
   :'<div class="empty"><b>Bütçe tanımlı değil</b>Gider kategorilerinize aylık hedef koyun; gerçekleşen harcamalar otomatik karşılaştırılır, aşımda uyarılırsınız.</div>'}
 </div>`;
}
function budgetForm(id){
 const init=id?S.budgets.find(x=>x.id===id):{};
 openForm(id?'Bütçe Düzenle':'Bütçe Kalemi',[
  {name:'cat',label:'Gider kategorisi',type:'select',opts:catOpts('gider'),req:1},
  {name:'amount',label:'Aylık bütçe hedefi (₺)',type:'number',req:1,min:1}
 ],o=>{
  if(id)Object.assign(init,o);
  else{
   const var_=S.budgets.find(b=>b.co===CO&&b.cat===o.cat);
   if(var_)var_.amount=o.amount; else S.budgets.push({id:nid(),co:CO,...o});
  }
  save();toast('Bütçe kaydedildi');go('budget');
 },init||{});
}

/* ---------- EXCEL / PDF DIŞA AKTARIM MERKEZİ ---------- */
/* ================== v12 — FORMÜL TABANLI, TAM BAĞLANTILI EXCEL YEDEKLEME ==================
   Hesaplar/Cariler/Kartlar/Stok bakiyeleri kendi hareket sayfalarından CANLI Excel
   formülleriyle (SUMIFS) hesaplanır; Özet sayfası tüm alt sayfalardan formülle beslenir;
   GRUP karşılaştırması her şirketin kendi sayfalarına çapraz-referans verir. Bir hücreyi
   değiştirirseniz bağlı toplamlar Excel içinde otomatik güncellenir. ================== */
function xmlE(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function xlStr(s){ return '"'+String(s==null?'':s).replace(/"/g,'""')+'"'; }
function FX(f,v,t){ return {f:f, v:v, t:t||'Number'}; }
function xCell(v){
 if(v&&typeof v==='object'&&typeof v.f==='string'){
  var t=v.t||'Number';
  var dv = t==='String' ? xmlE(v.v==null?'':v.v) : (isFinite(v.v)?v.v:0);
  return '<Cell ss:Formula="'+xmlE(v.f)+'"><Data ss:Type="'+t+'">'+dv+'</Data></Cell>';
 }
 if(typeof v==='number'&&isFinite(v))return '<Cell><Data ss:Type="Number">'+v+'</Data></Cell>';
 return '<Cell><Data ss:Type="String">'+xmlE(v)+'</Data></Cell>';
}
function xSheet(name,rows){
 name=String(name).replace(/[\[\]\/\\?*:]/g,' ').slice(0,31);
 return '<Worksheet ss:Name="'+xmlE(name)+'"><Table>'+rows.map(r=>'<Row>'+r.map(xCell).join('')+'</Row>').join('')+'</Table></Worksheet>';
}
function buildXLS(sheets){
 return '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>'+
 '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'+sheets.join('')+'</Workbook>';
}
function sheetNm(nm){ return String(nm).replace(/[\[\]\/\\?*:]/g,' ').slice(0,31); }
function qref(nm){ return "'"+sheetNm(nm)+"'!"; }
function xlRange(col,startRow,count){ const endRow = count>0 ? (startRow+count-1) : startRow; return '$'+col+'$'+startRow+':$'+col+'$'+endRow; }
function coSheets(co,pre){
 pre=pre||'';
 const n=v=>+v||0;
 const accs=byCo(S.accounts,co), txnsSorted=byCo(S.txns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
 const pes=byCo(S.posEntries,co).slice().sort((a,b)=>a.date<b.date?-1:1);
 const cards=byCo(S.cards,co), cts=byCo(S.cardTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
 const caris=byCo(S.cari,co), crts=byCo(S.cariTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
 const stf=byCo(S.staff,co), sts=byCo(S.staffTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
 const fxs=byCo(S.fixed,co), fls=byCo(S.fixedLogs,co).slice().sort((a,b)=>a.period<b.period?-1:1);
 const cqs=byCo(S.cheques,co), stk=byCo(S.stock,co), stts=byCo(S.stockTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
 const ass=byCo(S.assets,co), bds=byCo(S.budgets,co), tks=byCo(S.tasks,co);
 const sheets=[];
 const NM={tx:pre+'İşlemler',hs:pre+'Hesaplar',kt:pre+'Kartlar',kh:pre+'Kart Hareket',
  cr:pre+'Cariler',ch:pre+'Cari Hareket',st:pre+'Stok',sh:pre+'Stok Hareket',bg:pre+'Bütçe',pr:pre+'Personel',db:pre+'Demirbaş'};

 const N_TX=txnsSorted.length;
 const txRows=[['Tarih','Tür','Kategori','Hesap','Hedef Hesap (Virman)','Açıklama','Tutar','KDV %','KDV Tutarı (Formül)']];
 txnsSorted.forEach((t,idx)=>{
  const a=S.accounts.find(x=>x.id===t.accId)||{}, a2=S.accounts.find(x=>x.id===t.accId2)||{};
  const row=idx+2, vatRate=t.vat?+t.vat:'';
  const kdvF='=IF(H'+row+'="",0,G'+row+'*H'+row+'/(100+H'+row+'))';
  const kdvVal=vatRate?(+t.amount*vatRate/(100+vatRate)):0;
  txRows.push([t.date, t.type==='gelir'?'Gelir':t.type==='gider'?'Gider':'Virman', t.cat||'',
   a.name||(t.src==='card'?'Kredi kartı':''), a2.name||'', t.desc||'', n(t.amount), vatRate, FX(kdvF,kdvVal)]);
 });
 const gelirToplam=txnsSorted.filter(t=>t.type==='gelir').reduce((s,t)=>s+n(t.amount),0);
 const giderToplam=txnsSorted.filter(t=>t.type==='gider').reduce((s,t)=>s+n(t.amount),0);
 txRows.push([]);
 const TOPGELIR_ROW=N_TX+3, TOPGIDER_ROW=N_TX+4, NET_ROW=N_TX+5;
 txRows.push(['Toplam Gelir', FX(N_TX?'=SUMIF('+xlRange('B',2,N_TX)+','+xlStr('Gelir')+','+xlRange('G',2,N_TX)+')':'=0', gelirToplam)]);
 txRows.push(['Toplam Gider', FX(N_TX?'=SUMIF('+xlRange('B',2,N_TX)+','+xlStr('Gider')+','+xlRange('G',2,N_TX)+')':'=0', giderToplam)]);
 txRows.push(['Net', FX('=B'+TOPGELIR_ROW+'-B'+TOPGIDER_ROW, gelirToplam-giderToplam)]);
 sheets.push(xSheet(NM.tx, txRows));

 const kdvTahsilF=N_TX?'=SUMIF('+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gelir')+','+qref(NM.tx)+xlRange('I',2,N_TX)+')':'=0';
 const kdvOdenenF=N_TX?'=SUMIF('+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gider')+','+qref(NM.tx)+xlRange('I',2,N_TX)+')':'=0';
 const kdvAll=kdvSummary(co,'0000-01-01','9999-12-31');
 sheets.push(xSheet(pre+'KDV',[
  ['KDV ÖZETİ — '+coName(co)+' (tüm zamanlar, formül — İşlemler sayfasındaki KDV Tutarı sütunundan)'],[],
  ['Tahsil Edilen KDV (Satış)', FX(kdvTahsilF,kdvAll.tahsil)],
  ['Ödenen KDV (Alış/Gider)', FX(kdvOdenenF,kdvAll.odenen)],
  ['Net (Ödenecek / Devreden)', FX('=B3-B4',kdvAll.tahsil-kdvAll.odenen)],
  [],['Not: Hesaplama, tutarların KDV dahil girildiğini varsayar (Tutar×Oran/(100+Oran)). Bu vergi danışmanlığı değildir — beyanname öncesi muhasebecinizle teyit edin.']
 ]));

 /* v30: AYLIK ÖZET — ilk işlemden bugüne kadar HER AYIN gelir/gider/net dökümü, canlı SUMIFS formülleriyle. */
 const monthEndOf=p=>{const parts=p.split('-'),y=+parts[0],m=+parts[1];const nm=m===12?(y+1)+'-01-01':y+'-'+String(m+1).padStart(2,'0')+'-01';return addDays(nm,-1);};
 const monthList=[];
 if(N_TX){
  let cur=txnsSorted[0].date.slice(0,7);
  const endP=todayISO().slice(0,7);
  while(cur<=endP){ monthList.push(cur); const parts=cur.split('-'),y=+parts[0],m=+parts[1]; cur=m===12?(y+1)+'-01':y+'-'+String(m+1).padStart(2,'0'); }
 }
 const aylikRows=[['Ay','Gelir (Formül)','Gider (Formül)','Net (Formül)']];
 monthList.forEach((p,idx)=>{
  const row=idx+2, mStart=p+'-01', mEnd=monthEndOf(p);
  const gF='=SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gelir')+','+qref(NM.tx)+xlRange('A',2,N_TX)+','+xlStr('>='+mStart)+','+qref(NM.tx)+xlRange('A',2,N_TX)+','+xlStr('<='+mEnd)+')';
  const xF='=SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gider')+','+qref(NM.tx)+xlRange('A',2,N_TX)+','+xlStr('>='+mStart)+','+qref(NM.tx)+xlRange('A',2,N_TX)+','+xlStr('<='+mEnd)+')';
  const s=sumRange(co,mStart,mEnd);
  aylikRows.push([mTR(p), FX(gF,s.gelir), FX(xF,s.gider), FX('=B'+row+'-C'+row,s.gelir-s.gider)]);
 });
 if(monthList.length){
  aylikRows.push([]);
  aylikRows.push(['TOPLAM', FX('=SUM('+xlRange('B',2,monthList.length)+')',gelirToplam), FX('=SUM('+xlRange('C',2,monthList.length)+')',giderToplam), FX('=SUM('+xlRange('D',2,monthList.length)+')',gelirToplam-giderToplam)]);
 }else{
  aylikRows.push(['Henüz işlem yok — ilk gelir/gider girildiğinde aylar burada otomatik listelenir.']);
 }
 sheets.push(xSheet(pre+'Aylık Özet', aylikRows));

 const hsRows=[['Hesap','Tür','Banka','IBAN','Açılış','Bakiye (Formül)']];
 accs.forEach((a,idx)=>{
  const row=idx+2;
  const f='=E'+row
   +'+SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('D',2,N_TX)+',A'+row+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gelir')+')'
   +'-SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('D',2,N_TX)+',A'+row+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gider')+')'
   +'+SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('E',2,N_TX)+',A'+row+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Virman')+')'
   +'-SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('D',2,N_TX)+',A'+row+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Virman')+')';
  hsRows.push([a.name, a.type==='kasa'?'Kasa':'Banka', a.bankName||'', a.iban||'', n(a.opening), FX(f,accBalance(a))]);
 });
 const nakitBankaToplam=accs.reduce((s,a)=>s+accBalance(a),0);
 const HESAP_TOTAL_ROW=accs.length+3;
 if(accs.length){ hsRows.push([]); hsRows.push(['TOPLAM','','','', FX('=SUM('+xlRange('E',2,accs.length)+')',accs.reduce((s,a)=>s+n(a.opening),0)), FX('=SUM('+xlRange('F',2,accs.length)+')',nakitBankaToplam)]); }
 sheets.push(xSheet(NM.hs, hsRows));

 const N_KH=cts.length;
 const khRows=[['Tarih','Kart','Tür','Kategori','Açıklama','Tutar']];
 cts.forEach(t=>{ const c=S.cards.find(x=>x.id===t.cardId)||{}; khRows.push([t.date, c.name||'', t.type==='odeme'?'Ödeme':'Harcama', t.cat||'', t.desc||'', n(t.amount)]); });
 sheets.push(xSheet(NM.kh, khRows));
 const ktRows=[['Kart','Banka','Limit','Borç (Formül)','Kesim Günü','Son Ödeme Günü']];
 cards.forEach((c,idx)=>{
  const row=idx+2;
  const f='=SUMIFS('+qref(NM.kh)+xlRange('F',2,N_KH)+','+qref(NM.kh)+xlRange('B',2,N_KH)+',A'+row+','+qref(NM.kh)+xlRange('C',2,N_KH)+','+xlStr('Harcama')+')'
   +'-SUMIFS('+qref(NM.kh)+xlRange('F',2,N_KH)+','+qref(NM.kh)+xlRange('B',2,N_KH)+',A'+row+','+qref(NM.kh)+xlRange('C',2,N_KH)+','+xlStr('Ödeme')+')';
  ktRows.push([c.name, c.bank||'', n(c.limit), FX(f,cardDebt(c)), n(c.cutDay), n(c.dueDay)]);
 });
 const kartBorcToplam=cards.reduce((s,c)=>s+Math.max(0,cardDebt(c)),0);
 const KART_TOTAL_ROW=cards.length+3;
 // v25 düzeltme: SUM yerine SUMIF(">0") — negatif bakiyeli (fazla ödenmiş) kartları uygulamayla aynı şekilde 0 sayar,
 // böylece dosya Excel'de yeniden hesaplandığında canlı formül ile ilk görünen değer artık HER ZAMAN aynı sonucu verir.
 if(cards.length){ ktRows.push([]); ktRows.push(['TOPLAM','','', FX('=SUMIF('+xlRange('D',2,cards.length)+',">0")',kartBorcToplam),'','']); }
 sheets.push(xSheet(NM.kt, ktRows));

 const N_CH=crts.length;
 const chRows=[['Tarih','Cari','Borç','Alacak','Vade','Açıklama']];
 crts.forEach(t=>{ const c=S.cari.find(x=>x.id===t.cariId)||{}; chRows.push([t.date, c.name||'', t.type==='borc'?n(t.amount):'', t.type==='alacak'?n(t.amount):'', t.vade||'', t.desc||'']); });
 sheets.push(xSheet(NM.ch, chRows));
 const crRows=[['Cari','Tür','Telefon','Vergi No','Açılış','Bakiye (Formül)','Durum (Formül)']];
 caris.forEach((c,idx)=>{
  const row=idx+2;
  const f='=E'+row+'+SUMIFS('+qref(NM.ch)+xlRange('C',2,N_CH)+','+qref(NM.ch)+xlRange('B',2,N_CH)+',A'+row+')'
   +'-SUMIFS('+qref(NM.ch)+xlRange('D',2,N_CH)+','+qref(NM.ch)+xlRange('B',2,N_CH)+',A'+row+')';
  const durumF='=IF(F'+row+'>0,'+xlStr('Bize borçlu')+',IF(F'+row+'<0,'+xlStr('Biz borçluyuz')+','+xlStr('Kapalı')+'))';
  const b=cariBalance(c);
  crRows.push([c.name, ({musteri:'Müşteri',tedarikci:'Tedarikçi',her2:'Her ikisi',diger:'Diğer'})[c.type]||'', c.phone||'', c.taxNo||'', n(c.opening), FX(f,b), FX(durumF, b>0?'Bize borçlu':b<0?'Biz borçluyuz':'Kapalı','String')]);
 });
 const cariAlacakToplam=caris.reduce((s,c)=>{const b=cariBalance(c);return s+(b>0?b:0);},0);
 const cariBorcToplam=caris.reduce((s,c)=>{const b=cariBalance(c);return s+(b<0?-b:0);},0);
 const CARI_ALACAK_ROW=caris.length+3, CARI_BORC_ROW=caris.length+4;
 if(caris.length){ crRows.push([]); crRows.push(['TOPLAM ALACAK (Formül)','','','','', FX('=SUMIF('+xlRange('F',2,caris.length)+',">0")',cariAlacakToplam),'']);
  crRows.push(['TOPLAM BORÇ (Formül)','','','','', FX('=-SUMIF('+xlRange('F',2,caris.length)+',"<0")',cariBorcToplam),'']); }
 sheets.push(xSheet(NM.cr, crRows));

 const posRows=[['Tarih','POS','Brüt','Komisyon','Net','Hesaba Geçiş','Durum']];
 pes.forEach(e=>{ const p=S.pos.find(x=>x.id===e.posId)||{}; posRows.push([e.date, p.name||'', n(e.gross), n(e.comm), n(e.net), e.settleDate, e.status==='gecti'?'Geçti':'Bekliyor']); });
 if(pes.length){ posRows.push([]); posRows.push(['TOPLAM','', FX('=SUM('+xlRange('C',2,pes.length)+')',pes.reduce((s,e)=>s+n(e.gross),0)), FX('=SUM('+xlRange('D',2,pes.length)+')',pes.reduce((s,e)=>s+n(e.comm),0)), FX('=SUM('+xlRange('E',2,pes.length)+')',pes.reduce((s,e)=>s+n(e.net),0)),'','']); }
 sheets.push(xSheet(pre+'POS', posRows));

 const N_PO=sts.length;
 const poRows=[['Tarih','Personel','Tür','Dönem','Tutar']];
 sts.forEach(t=>{ const x=S.staff.find(z=>z.id===t.staffId)||{}; poRows.push([t.date, x.name||'', ({maas:'Maaş',avans:'Avans',prim:'Prim',kesinti:'Kesinti'})[t.type]||t.type, t.period||'', n(t.amount)]); });
 if(sts.length){ poRows.push([]); poRows.push(['TOPLAM','','','', FX('=SUM('+xlRange('E',2,N_PO)+')',sts.reduce((s,t)=>s+n(t.amount),0))]); }
 sheets.push(xSheet(pre+'Personel Ödeme', poRows));
 const maasYuku=stf.filter(x=>x.active!=='0').reduce((s,x)=>s+n(x.salary),0);
 const PERSONEL_TOTAL_ROW=stf.length+3;
 sheets.push(xSheet(NM.pr,[['Personel','Görev','Telefon','Net Maaş','Durum'],
  ...stf.map(x=>[x.name,x.pos||'',x.phone||'',n(x.salary),x.active==='0'?'Ayrıldı':'Aktif']),
  ...(stf.length?[[],['AYLIK MAAŞ YÜKÜ (aktif personel)', FX('=SUMIF('+xlRange('E',2,stf.length)+','+xlStr('Aktif')+','+xlRange('D',2,stf.length)+')', maasYuku)]]:[])]));

 const N_OG=fls.length;
 const ogRows=[['Dönem','Ödeme','Tarih','Tutar']];
 fls.forEach(l=>{ const f=S.fixed.find(x=>x.id===l.fixedId)||{}; ogRows.push([l.period, f.name||'', l.paidDate, n(l.amount)]); });
 if(fls.length){ ogRows.push([]); ogRows.push(['TOPLAM','','', FX('=SUM('+xlRange('D',2,N_OG)+')',fls.reduce((s,l)=>s+n(l.amount),0))]); }
 sheets.push(xSheet(pre+'Öde.Geçmişi', ogRows));
 sheets.push(xSheet(pre+'Sabit Ödemeler',[['Ödeme','Tür','Gün','Aylık Tutar'], ...fxs.map(f=>[f.name,FTYPE[f.type]||'',n(f.payDay),n(f.amount)]),
  ...(fxs.length?[[],['TOPLAM AYLIK YÜK','','', FX('=SUM('+xlRange('D',2,fxs.length)+')',fxs.reduce((s,f)=>s+n(f.amount),0))]]:[])]));

 const cqRows=[['Yön','Tür','Kişi','Banka','No','Vade','Tutar','Durum']];
 cqs.forEach(c=>cqRows.push([c.tip==='alinan'?'Alınan':'Verilen', c.tur==='senet'?'Senet':'Çek', c.kisi, c.banka||'', c.no||'', c.vade, n(c.tutar), ({portfoy:'Portföyde',kapandi:'Kapandı',karsiliksiz:'Karşılıksız'})[c.durum]||'']));
 if(cqs.length){ cqRows.push([]); cqRows.push(['TOPLAM (Portföyde)','','','','','', FX('=SUMIF('+xlRange('H',2,cqs.length)+','+xlStr('Portföyde')+','+xlRange('G',2,cqs.length)+')',cqs.filter(c=>c.durum==='portfoy').reduce((s,c)=>s+n(c.tutar),0)),'']); }
 sheets.push(xSheet(pre+'Çek Senet', cqRows));

 const N_SH=stts.length;
 const shRows=[['Tarih','Ürün','Yön','Miktar','Açıklama']];
 stts.forEach(t=>{ const it=S.stock.find(x=>x.id===t.itemId)||{}; shRows.push([t.date, it.name||'', t.type==='giris'?'Giriş':'Çıkış', n(t.qty), t.desc||'']); });
 sheets.push(xSheet(NM.sh, shRows));
 const stRows=[['Ürün','Birim','Başlangıç Miktar','Güncel Miktar (Formül)','Birim Maliyet','Stok Değeri (Formül)','Kritik Sınır']];
 stk.forEach((it,idx)=>{
  const row=idx+2;
  const qtyF='=C'+row+'+SUMIFS('+qref(NM.sh)+xlRange('D',2,N_SH)+','+qref(NM.sh)+xlRange('B',2,N_SH)+',A'+row+','+qref(NM.sh)+xlRange('C',2,N_SH)+','+xlStr('Giriş')+')'
   +'-SUMIFS('+qref(NM.sh)+xlRange('D',2,N_SH)+','+qref(NM.sh)+xlRange('B',2,N_SH)+',A'+row+','+qref(NM.sh)+xlRange('C',2,N_SH)+','+xlStr('Çıkış')+')';
  const q=stockQty(it);
  stRows.push([it.name, it.unit||'', n(it.qty), FX(qtyF,q), n(it.cost), FX('=D'+row+'*E'+row, q*n(it.cost)), n(it.min)]);
 });
 const stokDegerToplam=stk.reduce((s,it)=>s+stockQty(it)*n(it.cost),0);
 const STOK_TOTAL_ROW=stk.length+3;
 if(stk.length){ stRows.push([]); stRows.push(['TOPLAM STOK DEĞERİ','','','','', FX('=SUM('+xlRange('F',2,stk.length)+')',stokDegerToplam),'']); }
 sheets.push(xSheet(NM.st, stRows));

 const demirbasToplam=ass.reduce((s,a)=>s+n(a.cost),0);
 const DEMIRBAS_TOTAL_ROW=ass.length+3;
 sheets.push(xSheet(NM.db,[['Demirbaş','Kategori','Konum','Alım Tarihi','Bedel','Durum'],
  ...ass.map(a=>[a.name,a.cat||'',a.loc||'',a.date||'',n(a.cost),({aktif:'Kullanımda',bakim:'Bakımda',hurda:'Hurda'})[a.durum||'aktif']]),
  ...(ass.length?[[],['TOPLAM','','','', FX('=SUM('+xlRange('E',2,ass.length)+')',demirbasToplam),'']]:[])]));

 const bgRows=[['Kategori','Aylık Hedef','Bu Ay Gerçekleşen (Formül)','Fark (Formül)','% Kullanım (Formül)']];
 const per=monthISO()+'-01', today=todayISO();
 bds.forEach((b,idx)=>{
  const row=idx+2;
  const gF=N_TX?'=SUMIFS('+qref(NM.tx)+xlRange('G',2,N_TX)+','+qref(NM.tx)+xlRange('C',2,N_TX)+',A'+row+','+qref(NM.tx)+xlRange('B',2,N_TX)+','+xlStr('Gider')+','
   +qref(NM.tx)+xlRange('A',2,N_TX)+','+xlStr('>='+per)+','+qref(NM.tx)+xlRange('A',2,N_TX)+','+xlStr('<='+today)+')':'=0';
  const g=sumRange(co,per,today).byCat[b.cat]||0;
  bgRows.push([b.cat, n(b.amount), FX(gF,g), FX('=B'+row+'-C'+row, n(b.amount)-g), FX('=IF(B'+row+'=0,0,C'+row+'/B'+row+'*100)', n(b.amount)?g/n(b.amount)*100:0)]);
 });
 sheets.push(xSheet(NM.bg, bgRows));

 sheets.push(xSheet(pre+'Görevler',[['Görev','Atanan','Teslim','Öncelik','Durum'],
  ...tks.map(t=>[t.title,t.who||'',t.due,t.pri==='yuksek'?'Acil':'Normal',({acik:'Bekliyor',devam:'Devam',tamam:'Tamamlandı'})[t.status]||''])]));

 const gK=Object.entries(sumRange(co,'0000-01-01','9999-12-31').byCat).sort((a,b)=>b[1]-a[1]);
 const gG=Object.entries(sumRange(co,'0000-01-01','9999-12-31').byCatG).sort((a,b)=>b[1]-a[1]);
 const ozRows=[
  ['LOLE FİNANS RAPORU — '+coName(co)],['Rapor tarihi',todayISO()],[],
  ['Toplam Gelir (tüm zamanlar)', FX('='+qref(NM.tx)+'B'+TOPGELIR_ROW, gelirToplam)],
  ['Toplam Gider', FX('='+qref(NM.tx)+'B'+TOPGIDER_ROW, giderToplam)],
  ['Net', FX('='+qref(NM.tx)+'B'+NET_ROW, gelirToplam-giderToplam)],
  ['Nakit + Banka', FX(accs.length?'='+qref(NM.hs)+'F'+HESAP_TOTAL_ROW:'=0', nakitBankaToplam)],
  ['Cari Alacak', FX(caris.length?'='+qref(NM.cr)+'F'+CARI_ALACAK_ROW:'=0', cariAlacakToplam)],
  ['Cari Borç', FX(caris.length?'='+qref(NM.cr)+'F'+CARI_BORC_ROW:'=0', cariBorcToplam)],
  ['Kart Borcu', FX(cards.length?'='+qref(NM.kt)+'D'+KART_TOTAL_ROW:'=0', kartBorcToplam)],
  ['Aylık Maaş Yükü', FX(stf.length?'='+qref(NM.pr)+'B'+PERSONEL_TOTAL_ROW:'=0', maasYuku)],
  ['Stok Değeri', FX(stk.length?'='+qref(NM.st)+'F'+STOK_TOTAL_ROW:'=0', stokDegerToplam)],
  ['Demirbaş Değeri', FX(ass.length?'='+qref(NM.db)+'E'+DEMIRBAS_TOTAL_ROW:'=0', demirbasToplam)],
  ['Net KDV (Ödenecek/Devreden)', FX("='"+sheetNm(pre+'KDV')+"'!B5", kdvAll.tahsil-kdvAll.odenen)],
  [],['GİDER KIRILIMI (tüm zamanlar — formül)'],
  ...gK.map(([c,v])=>[c, FX(N_TX?'=SUMIF('+qref(NM.tx)+xlRange('C',2,N_TX)+','+xlStr(c)+','+qref(NM.tx)+xlRange('G',2,N_TX)+')':'=0', v)]),
  [],['GELİR KIRILIMI (tüm zamanlar — formül)'],
  ...gG.map(([c,v])=>[c, FX(N_TX?'=SUMIF('+qref(NM.tx)+xlRange('C',2,N_TX)+','+xlStr(c)+','+qref(NM.tx)+xlRange('G',2,N_TX)+')':'=0', v)]),
 ];
 sheets.unshift(xSheet(pre+'Özet', ozRows));
 return {sheets, meta:{accCount:accs.length,carisCount:caris.length,cardsCount:cards.length,stfCount:stf.length,N_TX,
  nakitBankaToplam,cariAlacakToplam,cariBorcToplam,kartBorcToplam,maasYuku,HESAP_TOTAL_ROW,CARI_ALACAK_ROW,CARI_BORC_ROW,KART_TOTAL_ROW,PERSONEL_TOTAL_ROW}};
}
function excelCo(co){return buildXLS(coSheets(co,'').sheets);}
function excelGrup(){
 const ay=monthISO()+'-01', bugun=todayISO();
 const cmpRows=[['Şirket','Gelir (bu ay, Formül)','Gider (bu ay, Formül)','Net (Formül)','Nakit+Banka (Formül)','Cari Alacak (Formül)','Cari Borç (Formül)','Kart Borcu (Formül)','Maaş Yükü (Formül)']];
 let allSheets=[];
 const colSums=[0,0,0,0,0,0,0,0];
 for(const c of COMPANIES){
  const kisa=c.name.replace('LOLE ','').slice(0,10)+' ';
  const {sheets,meta}=coSheets(c.id,kisa);
  allSheets=allSheets.concat(sheets);
  const TXN=kisa+'İşlemler';
  const gelirF=meta.N_TX?'=SUMIFS('+qref(TXN)+xlRange('G',2,meta.N_TX)+','+qref(TXN)+xlRange('B',2,meta.N_TX)+','+xlStr('Gelir')+','+qref(TXN)+xlRange('A',2,meta.N_TX)+','+xlStr('>='+ay)+','+qref(TXN)+xlRange('A',2,meta.N_TX)+','+xlStr('<='+bugun)+')':'=0';
  const giderF=meta.N_TX?'=SUMIFS('+qref(TXN)+xlRange('G',2,meta.N_TX)+','+qref(TXN)+xlRange('B',2,meta.N_TX)+','+xlStr('Gider')+','+qref(TXN)+xlRange('A',2,meta.N_TX)+','+xlStr('>='+ay)+','+qref(TXN)+xlRange('A',2,meta.N_TX)+','+xlStr('<='+bugun)+')':'=0';
  const sBu=sumRange(c.id,ay,bugun);
  const rowIdx=cmpRows.length+1;
  const vals=[sBu.gelir,sBu.gider,sBu.gelir-sBu.gider,meta.nakitBankaToplam,meta.cariAlacakToplam,meta.cariBorcToplam,meta.kartBorcToplam,meta.maasYuku];
  vals.forEach((v,i)=>colSums[i]+=v);
  cmpRows.push([c.name,
   FX(gelirF,sBu.gelir), FX(giderF,sBu.gider), FX('=B'+rowIdx+'-C'+rowIdx,sBu.gelir-sBu.gider),
   FX(meta.accCount?'='+qref(kisa+'Hesaplar')+'F'+meta.HESAP_TOTAL_ROW:'=0',meta.nakitBankaToplam),
   FX(meta.carisCount?'='+qref(kisa+'Cariler')+'F'+meta.CARI_ALACAK_ROW:'=0',meta.cariAlacakToplam),
   FX(meta.carisCount?'='+qref(kisa+'Cariler')+'F'+meta.CARI_BORC_ROW:'=0',meta.cariBorcToplam),
   FX(meta.cardsCount?'='+qref(kisa+'Kartlar')+'D'+meta.KART_TOTAL_ROW:'=0',meta.kartBorcToplam),
   FX(meta.stfCount?'='+qref(kisa+'Personel')+'B'+meta.PERSONEL_TOTAL_ROW:'=0',meta.maasYuku)]);
 }
 const lastDataRow=cmpRows.length;
 cmpRows.push([]);
 const grupToplamRow=['GRUP TOPLAMI'];
 ['B','C','D','E','F','G','H','I'].forEach((L,i)=>grupToplamRow.push(FX('=SUM('+L+'2:'+L+lastDataRow+')',colSums[i])));
 cmpRows.push(grupToplamRow);
 allSheets.unshift(xSheet('GRUP Karşılaştırma', cmpRows));
 return buildXLS(allSheets);
}
function dlText(name,mime,content){
 try{
  const blob=new Blob(['\ufeff'+content],{type:mime+';charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=name;document.body.appendChild(a);a.click();a.remove();
  return true;
 }catch(e){return false;}
}
function excelDl(scope){
 const grup=scope==='grup'||CO==='grup';
 const x=grup?excelGrup():excelCo(CO);
 const ad='LOLE-'+(grup?'GRUP':coName(CO).replace(/\s+/g,'-'))+'-'+todayISO()+'.xls';
 if(dlText(ad,'application/vnd.ms-excel',x))toast('Excel raporu indirildi (formüllü, tam bağlantılı): '+ad);
 else toast('İndirme bu görüntüleyicide engelli — dosyayı indirip Chrome/Safari\'de açın');
}
function fullReportHTML(){
 const grup=CO==='grup';
 const tbl=rows=>'<table>'+rows.map((r,i)=>'<tr>'+r.map(c=>(i===0?'<th>':'<td>')+(c===''||c==null?'&nbsp;':c)+(i===0?'</th>':'</td>')).join('')+'</tr>').join('')+'</table>';
 let out='<h1>LOLE FİNANS RAPORU — '+esc(grup?'LOLE GRUP':coName(CO))+'</h1><p class="mut">Rapor tarihi: '+dTR(todayISO())+' · Bu rapor ilgili şirket(ler)in tüm kayıtlı hareketlerini içerir.</p>';
 const cos=grup?COMPANIES.map(c=>c.id):[CO];
 for(const co of cos){
  const s=sumRange(co,monthISO()+'-01',todayISO());
  const st=sumRange(co,'0000-01-01','9999-12-31');
  let bal=0;for(const a of byCo(S.accounts,co))bal+=accBalance(a);
  out+='<h2>'+esc(coName(co))+'</h2>';
  out+=tbl([['Gösterge','Bu Ay','Tüm Zamanlar'],
   ['Gelir',fmt(s.gelir),fmt(st.gelir)],['Gider',fmt(s.gider),fmt(st.gider)],['Net',fmt(s.net),fmt(st.net)],['Nakit+Banka',fmt(bal),'']]);
  const accs=byCo(S.accounts,co);
  if(accs.length)out+='<h3>Hesaplar (Banka & Kasa)</h3>'+tbl([['Hesap','Tür','IBAN','Açılış','Güncel Bakiye'],
   ...accs.map(a=>[esc(a.name),a.type==='kasa'?'Kasa':'Banka',esc(a.iban||''),fmt(a.opening),fmt(accBalance(a))])]);
  const txns=byCo(S.txns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
  if(txns.length)out+='<h3>Tüm İşlemler ('+txns.length+' kayıt)</h3>'+tbl([['Tarih','Tür','Kategori','Hesap','Açıklama','Tutar'],
   ...txns.map(t=>{const a=S.accounts.find(x=>x.id===t.accId)||{};
    return [dTR(t.date),t.type==='gelir'?'Gelir':t.type==='gider'?'Gider':'Virman',esc(t.cat||''),esc(a.name||''),esc(t.desc||''),fmt(t.amount)];})]);
  out+='<h3>Gider Kırılımı (bu ay)</h3>'+tbl([['Kategori','Tutar'],...Object.entries(s.byCat).sort((a,b)=>b[1]-a[1]).map(([c,v])=>[esc(c),fmt(v)])]);
  out+='<h3>Gelir Kırılımı (bu ay)</h3>'+tbl([['Kategori','Tutar'],...Object.entries(s.byCatG).sort((a,b)=>b[1]-a[1]).map(([c,v])=>[esc(c),fmt(v)])]);
  const pes=byCo(S.posEntries,co).slice().sort((a,b)=>a.date<b.date?-1:1);
  if(pes.length)out+='<h3>POS Hareketleri</h3>'+tbl([['Tarih','POS','Brüt','Komisyon','Net','Durum'],
   ...pes.map(e=>{const p=S.pos.find(x=>x.id===e.posId)||{};return [dTR(e.date),esc(p.name||''),fmt(e.gross),fmt(e.comm),fmt(e.net),e.status==='gecti'?'Geçti':'Bekliyor'];})]);
  const cards=byCo(S.cards,co);
  if(cards.length){
   out+='<h3>Kredi Kartları</h3>'+tbl([['Kart','Banka','Limit','Borç','Kesim','Son Ödeme'],
    ...cards.map(c=>[esc(c.name),esc(c.bank||''),fmt(c.limit),fmt(cardDebt(c)),c.cutDay,c.dueDay])]);
   const cts=byCo(S.cardTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
   if(cts.length)out+='<h3>Kredi Kartı Ekstresi (tüm hareketler)</h3>'+tbl([['Tarih','Kart','Tür','Kategori','Açıklama','Tutar'],
    ...cts.map(t=>{const c=S.cards.find(x=>x.id===t.cardId)||{};return [dTR(t.date),esc(c.name||''),t.type==='odeme'?'Ödeme':'Harcama',esc(t.cat||''),esc(t.desc||''),fmt(t.amount)];})]);
  }
  const caris=byCo(S.cari,co);
  if(caris.length){
   out+='<h3>Cari Bakiyeler (Alacak/Borç)</h3>'+tbl([['Cari','Tür','Telefon','Bakiye','Durum'],
    ...caris.map(c=>{const b=cariBalance(c);return [esc(c.name),({musteri:'Müşteri',tedarikci:'Tedarikçi',her2:'Her ikisi',diger:'Diğer'})[c.type]||'',esc(c.phone||''),fmt(Math.abs(b)),b>0?'Bize borçlu':b<0?'Biz borçluyuz':'Kapalı'];})]);
   const crts=byCo(S.cariTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
   if(crts.length)out+='<h3>Cari Hareketleri (tüm alacak/ödeme kayıtları)</h3>'+tbl([['Tarih','Cari','Borç','Alacak','Vade','Açıklama'],
    ...crts.map(t=>{const c=S.cari.find(x=>x.id===t.cariId)||{};return [dTR(t.date),esc(c.name||''),t.type==='borc'?fmt(t.amount):'',t.type==='alacak'?fmt(t.amount):'',t.vade?dTR(t.vade):'',esc(t.desc||'')];})]);
  }
  const stf=byCo(S.staff,co).filter(x=>x.active!=='0');
  if(stf.length){
   out+='<h3>Personel</h3>'+tbl([['Personel','Görev','Net Maaş'],...stf.map(x=>[esc(x.name),esc(x.pos||''),fmt(x.salary)])]);
   const sts=byCo(S.staffTxns,co).slice().sort((a,b)=>a.date<b.date?-1:1);
   if(sts.length)out+='<h3>Personel Ödemeleri</h3>'+tbl([['Tarih','Personel','Tür','Dönem','Tutar'],
    ...sts.map(t=>{const x=S.staff.find(z=>z.id===t.staffId)||{};return [dTR(t.date),esc(x.name||''),({maas:'Maaş',avans:'Avans',prim:'Prim',kesinti:'Kesinti'})[t.type]||t.type,t.period||'',fmt(t.amount)];})]);
  }
  const fxs=byCo(S.fixed,co);
  if(fxs.length){
   out+='<h3>Sabit Ödemeler</h3>'+tbl([['Ödeme','Tür','Gün','Aylık Tutar'],...fxs.map(f=>[esc(f.name),FTYPE[f.type]||'',f.payDay,fmt(f.amount)])]);
   const fls=byCo(S.fixedLogs,co).slice().sort((a,b)=>a.period<b.period?-1:1);
   if(fls.length)out+='<h3>Sabit Ödeme Geçmişi (fatura ödemeleri dahil)</h3>'+tbl([['Dönem','Ödeme','Ödeme Tarihi','Tutar'],
    ...fls.map(l=>{const f=S.fixed.find(x=>x.id===l.fixedId)||{};return [l.period,esc(f.name||''),l.paidDate?dTR(l.paidDate):'',fmt(l.amount)];})]);
  }
  const cqs=byCo(S.cheques,co);
  if(cqs.length)out+='<h3>Çek & Senet</h3>'+tbl([['Yön','Tür','Kişi','Banka','Vade','Tutar','Durum'],
   ...cqs.map(c=>[c.tip==='alinan'?'Alınan':'Verilen',c.tur==='senet'?'Senet':'Çek',esc(c.kisi),esc(c.banka||''),c.vade?dTR(c.vade):'',fmt(c.tutar),({portfoy:'Portföyde',kapandi:'Kapandı',karsiliksiz:'Karşılıksız'})[c.durum]||''])]);
  const stk=byCo(S.stock,co);
  if(stk.length)out+='<h3>Stok</h3>'+tbl([['Ürün','Birim','Miktar','Birim Maliyet','Stok Değeri'],
   ...stk.map(it=>{const q=stockQty(it);return [esc(it.name),esc(it.unit||''),q,fmt(it.cost),fmt(q*(+it.cost||0))];})]);
  const ass=byCo(S.assets,co);
  if(ass.length)out+='<h3>Demirbaş</h3>'+tbl([['Demirbaş','Kategori','Bedel','Durum'],
   ...ass.map(a=>[esc(a.name),esc(a.cat||''),fmt(a.cost),({aktif:'Kullanımda',bakim:'Bakımda',hurda:'Hurda'})[a.durum||'aktif']])]);
  const bds=byCo(S.budgets,co);
  if(bds.length)out+='<h3>Bütçe (Hedef vs Gerçekleşen)</h3>'+tbl([['Kategori','Aylık Hedef','Bu Ay Gerçekleşen','Fark'],
   ...bds.map(b=>{const g=s.byCat[b.cat]||0;return [esc(b.cat),fmt(b.amount),fmt(g),fmt(b.amount-g)];})]);
 }
 return out;
}
function pdfPrint(){
 let box=document.getElementById('printArea');
 if(!box){box=document.createElement('div');box.id='printArea';document.body.appendChild(box);}
 box.innerHTML=fullReportHTML();
 document.body.classList.add('print-report');
 const done=()=>{document.body.classList.remove('print-report');};
 try{ window.onafterprint=done; window.print(); setTimeout(done,1200); }
 catch(e){ done(); toast('Yazdırma bu görüntüleyicide engelli — "Rapor Dosyası İndir" seçeneğini kullanın'); }
}
function dlReportHTML(){
 const html='<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>LOLE Finans Raporu '+todayISO()+'</title><style>'+
 'body{font:13px/1.5 -apple-system,Segoe UI,Arial,sans-serif;color:#141d33;max-width:900px;margin:24px auto;padding:0 16px}'+
 'h1{font-size:22px;border-bottom:3px solid #0c1322;padding-bottom:8px}h2{font-size:17px;margin-top:26px;color:#0c1322}h3{font-size:13px;margin-top:16px;text-transform:uppercase;letter-spacing:.08em;color:#46536e}'+
 'table{width:100%;border-collapse:collapse;margin:8px 0;font-size:12.5px}th{background:#eef1f6;text-align:left}th,td{border:1px solid #d8deea;padding:6px 9px}td:nth-child(n+2),th:nth-child(n+2){text-align:right}'+
 '.mut{color:#8b96ac}.no-print{background:#0c1322;color:#fff;border:0;padding:10px 18px;border-radius:10px;font-weight:700;cursor:pointer}@media print{.no-print{display:none}}'+
 '</style></head><body><button class="no-print" onclick="window.print()">🖨 Yazdır / PDF olarak kaydet</button>'+fullReportHTML()+'</body></html>';
 const ad='LOLE-rapor-'+(CO==='grup'?'GRUP':coName(CO).replace(/\s+/g,'-'))+'-'+todayISO()+'.html';
 if(dlText(ad,'text/html',html))toast('Rapor indirildi — açıp "Yazdır / PDF kaydet" deyin');
 else toast('İndirme engelli — dosyayı indirip tarayıcıda açın');
}


/* ================== v4 — AI ASİSTAN MERKEZİ + İŞLEVSELLİK PAKETİ ================== */

/* ---- ortak yardımcılar ---- */
function periodAdd(p,n){var a=p.split('-').map(Number);var t=a[0]*12+(a[1]-1)+n;return Math.floor(t/12)+'-'+String((t%12)+1).padStart(2,'0');}
function trLow(s){return String(s==null?'':s).toLocaleLowerCase('tr');}

/* ---- AI çekirdeği ---- */
var AI_ON=null; /* null=denenmedi, true/false=son deneme sonucu */
var AI_SYS='Sen LOLE Grup sirketlerinin Türkçe finans asistanısın. YALNIZCA sana verilen JSON verisine dayan; veride olmayan bilgi için "kayıtlarda göremiyorum" de, asla tahmin uydurma. Tutarları 1.250,50 TL biçiminde yaz. Kısa, net, samimi-profesyonel ol. Markdown başlığı kullanma; madde işareti (•) kullanabilirsin.';
async function aiAsk(user,maxTok){
 try{
  var r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:maxTok||900,system:AI_SYS,messages:[{role:'user',content:user}]})});
  var j=await r.json();
  var t=(j&&j.content)?j.content.map(function(c){return c.text||'';}).join('\n').trim():'';
  AI_ON=!!t;return t;
 }catch(e){AI_ON=false;return '';}
}
function aiTag(live){return '<span class="src">'+(live?'✦ Yapay zeka tarafından oluşturulmuştur — kontrol ediniz.':'⚙ Yerleşik analiz (canlı AI şu an erişilemiyor; Claude ortamında otomatik devreye girer).')+'</span>';}

/* ---- şirket veri paketi ---- */
function packCo(co){
 var t=sumRange(co,todayISO(),todayISO()),m=sumRange(co,monthISO()+'-01',todayISO());
 var posBek=0;for(var i=0;i<S.posEntries.length;i++){var p=S.posEntries[i];if(p.co===co&&p.status==='bekliyor')posBek+=+p.net;}
 return {
  sirket:coName(co),tarih:todayISO(),
  bugun:{gelir:Math.round(t.gelir),gider:Math.round(t.gider)},
  buAy:{gelir:Math.round(m.gelir),gider:Math.round(m.gider),net:Math.round(m.net)},
  hesaplar:byCo(S.accounts,co).map(function(a){return {ad:a.name,tur:a.type,bakiye:Math.round(accBalance(a))};}),
  krediKartlari:byCo(S.cards,co).map(function(c){return {ad:c.name,borc:Math.round(cardDebt(c)),sonOdemeGunu:c.dueDay};}),
  posBlokajBekleyen:Math.round(posBek),
  cariBakiyeler:byCo(S.cari,co).map(function(c){return {ad:c.name,bakiye:Math.round(cariBalance(c))};}).filter(function(c){return c.bakiye!==0;}),
  yaklasanOdemeler:reminders(co).slice(0,10).map(function(r){return {ne:r.t,tarih:r.d,tutar:r.a};}),
  kritikStok:byCo(S.stock,co).filter(function(it){return +(it.min||0)>0&&stockQty(it)<=+it.min;}).map(function(it){return it.name;}),
  portfoyCekSenet:byCo(S.cheques,co).filter(function(c){return c.durum==='portfoy';}).map(function(c){return {tip:c.tip,kisi:c.kisi,tutar:+c.tutar,vade:c.vade};}),
  personel:byCo(S.staff,co).filter(function(s){return s.active!=='0';}).map(function(s){return {ad:s.name,gorev:s.pos||''};}),
  giderKategorileriBuAy:m.byCat,gelirKategorileriBuAy:m.byCatG
 };
}

/* ---- AI ASİSTAN SAYFASI ---- */
var aiLog=[],aiLogCo=null,aiBusy=false;
function rAi(){
 if(aiLogCo!==CO){aiLog=[];aiLogCo=CO;}
 var grup=(CO==='grup');
 var ornek=['bugünkü ciro','bu ay net kâr','kart borçları','yaklaşan ödemeler','kritik stok','kirayı ödedik mi'];
 document.getElementById('main').innerHTML= topbar('AI Asistan',
  '<button class="btn gh" data-act="aiChatClear">🧹 Temizle</button>')+
 '<div class="card"><h2>✦ Soru-Cevap Ajanı <span class="tiny">verilerinize doğal dille sorun</span></h2>'+
  '<div class="aiChat" id="aiLogBox">'+renderAiLog()+'</div>'+
  '<div class="aiInRow"><input id="aiIn" placeholder="Ör: kasada ne kadar var? · Anadolu Gıda bakiyesi? · en büyük gider?" autocomplete="off"><button class="btn" data-act="aiSend">Gönder</button></div>'+
  '<div style="margin-top:9px;display:flex;gap:6px;flex-wrap:wrap">'+ornek.map(function(q){return '<button class="chip g" data-act="aiQuick" data-arg="'+q+'">'+q+'</button>';}).join('')+'</div>'+
 '</div>'+
 (grup
  ? '<div class="card"><div class="empty"><b>Uzman ajanlar şirket ekranında</b>Brifing, nakit tahmini, anomali, maliyet ve tahsilat ajanları şirket verisiyle çalışır. Sohbet burada 4 şirketin toplamı üzerinden yanıt verir.</div></div>'
  : '<h2 style="margin:4px 2px 10px;font-size:15px;color:var(--ink2)">UZMAN AJANLAR</h2><div class="agentGrid">'+
    agentCard('🌅','Sabah Brifingi','Dünün cirosu, bugünkü ödemeler ve kritik uyarılar tek bakışta.','aiBriefRun')+
    agentCard('📈','Nakit Akış Tahmini','Önümüzdeki 30 günün kesinleşmiş giriş-çıkış projeksiyonu ve açık riski.','aiFcRun')+
    agentCard('🧠','AI CFO Analizi','Marj, trend, risk ve aksiyon önerileriyle ay sonu derinliğinde analiz.','aiCFO')+
    agentCard('🕵️','Anomali Taraması','Mükerrer kayıt, sıra dışı tutar, negatif bakiye ve limit aşımı taraması.','aiAnomaly')+
    agentCard('💰','Maliyet Optimizasyonu','POS komisyon farkları ve hızlanan gider kalemlerinde tasarruf fırsatları.','aiCost')+
    agentCard('⚖️','Cari Risk & Tahsilat','Gecikme skorları, tahsilat önceliği ve kibar e-posta taslağı.','aiCariRisk')+
   '</div>')+
 '<div id="aiOut"></div>';
 var inp=document.getElementById('aiIn');
 if(inp)inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();aiSend();}});
 var lb=document.getElementById('aiLogBox');if(lb)lb.scrollTop=lb.scrollHeight;
}
function agentCard(ic,t,d,fn){return '<div class="agentCard"><b>'+ic+' '+t+'</b><span class="tiny">'+d+'</span><button class="btn sm" data-act="'+fn+'">Çalıştır</button></div>';}
function renderAiLog(){
 if(!aiLog.length)return '<div class="empty" style="padding:16px"><b>Merhaba! 👋</b>'+(CO==='grup'?'Grup geneli':coName(CO))+' verileri hakkında istediğinizi sorun. AI erişilemezse yerleşik analiz yanıtlar.</div>';
 return aiLog.map(function(m){return '<div class="aiMsg '+(m.r==='u'?'u':'a')+'">'+esc(m.t)+(m.r==='a'&&!m.tmp?aiTag(m.live):'')+'</div>';}).join('');
}
function paintLog(){var b=document.getElementById('aiLogBox');if(b){b.innerHTML=renderAiLog();b.scrollTop=b.scrollHeight;}}
function aiChatClear(){aiLog=[];if(PAGE==='ai')rAi();}
function aiQuick(q){var i=document.getElementById('aiIn');if(i)i.value=q;aiSend();}
async function aiSend(){
 if(aiBusy)return;
 var i=document.getElementById('aiIn');var q=(i?i.value:'').trim();
 if(!q)return;
 i.value='';aiBusy=true;
 aiLog.push({r:'u',t:q});
 aiLog.push({r:'a',t:'…düşünüyorum',tmp:true});
 paintLog();
 var local=localAnswer(q);
 var pack=(CO==='grup')?{kapsam:'LOLE GRUP — 4 şirket toplamı',sirketler:COMPANIES.map(function(c){return packCo(c.id);})}:packCo(CO);
 var ai=await aiAsk('VERI: '+JSON.stringify(pack)+'\n\nSORU: '+q+(local?'\n\n(Yerleşik ön analiz, dilersen düzelt/zenginleştir: '+local+')':''));
 var txt,live=false;
 if(ai){txt=ai;live=true;}
 else txt=local||'Bunu yerleşik analizle yanıtlayamadım. Şunları sorabilirsiniz: bakiye · bugünkü ciro · bu ay kâr · kart borcu · yaklaşan ödemeler · kritik stok · "kirayı ödedik mi" · bir cari veya personel adı.';
 aiLog=aiLog.filter(function(m){return !m.tmp;});
 aiLog.push({r:'a',t:txt,live:live});
 aiBusy=false;paintLog();
}

/* ---- yerleşik soru-cevap motoru ---- */
function localAnswer(q0){
 var q=trLow(q0);
 function has(){for(var i=0;i<arguments.length;i++)if(q.indexOf(arguments[i])>-1)return true;return false;}
 var coList=(CO==='grup')?COMPANIES.map(function(c){return c.id;}):[CO];
 var pre=function(c){return (CO==='grup')?coName(c)+': ':'';};
 var L=[],c,i;
 var STOP={nedir:1,kadar:1,nasil:1,'nasıl':1,neler:1,hangi:1,durum:1,durumu:1,bakiye:1,bakiyesi:1,'borç':1,borc:1,borcu:1,'borçları':1,borclari:1,'ödeme':1,odeme:1,'ödemeler':1,hesap:1,toplam:1,'bugün':1,bugun:1,'yarın':1,yarin:1,'için':1,icin:1,olan:1,gelir:1,gider:1,ciro:1,kart:1,kredi:1,vade:1,stok:1,'çek':1,cek:1,senet:1,'maaş':1,maas:1,izin:1,personel:1,cari:1,kasa:1,banka:1,nakit:1,para:1,kalan:1};
 var words=q.split(/[^a-zçğıöşü0-9]+/).filter(function(w){return w.length>=3&&!STOP[w];});
 var ent=findEntity(words,coList,pre); if(ent)return ent;

 if(has('bakiye','kasada','kasa','banka','nakit','ne kadar param','para var')&&!has('cari','kart')){
  for(i=0;i<coList.length;i++){c=coList[i];var accs=byCo(S.accounts,c);if(!accs.length)continue;
   var tot=0,parts=[];for(var k=0;k<accs.length;k++){var b=accBalance(accs[k]);tot+=b;parts.push(accs[k].name+' '+fmt0(b));}
   L.push(pre(c)+parts.join(' · ')+' — Toplam '+fmt0(tot));}
  if(L.length)return L.join('\n');
 }
 if(has('bugün')&&has('ciro','satış','gelir','gider','kazan')){
  for(i=0;i<coList.length;i++){c=coList[i];var t=sumRange(c,todayISO(),todayISO());
   L.push(pre(c)+'Bugün gelir '+fmt0(t.gelir)+', gider '+fmt0(t.gider)+', net '+fmt0(t.net));}
  return L.join('\n');
 }
 if(has('bu ay','aylık','ay sonu')&&has('ciro','gelir','gider','kâr','kar','net','durum')){
  for(i=0;i<coList.length;i++){c=coList[i];var m=sumRange(c,monthISO()+'-01',todayISO());
   L.push(pre(c)+'Bu ay gelir '+fmt0(m.gelir)+', gider '+fmt0(m.gider)+', net '+fmt0(m.net)+(m.gelir?' (marj %'+(m.net/m.gelir*100).toFixed(1)+')':''));}
  return L.join('\n');
 }
 if(has('kart')&&has('borç','borc','borcu','ne kadar')){
  for(i=0;i<coList.length;i++){c=coList[i];var cards=byCo(S.cards,c);if(!cards.length)continue;
   L.push(pre(c)+cards.map(function(cd){var d=cardDebt(cd);return cd.name+' '+fmt0(d)+(d>0?' (son ödeme: '+dTR(nextDue(+cd.dueDay))+')':'');}).join(' · '));}
  return L.length?L.join('\n'):'Kayıtlı kredi kartı bulunmuyor.';
 }
 if(has('yaklaşan','vade','ödeme var','ne ödeyeceğ','ödemeler')){
  for(i=0;i<coList.length;i++){c=coList[i];var rs=reminders(c).slice(0,5);
   if(rs.length)L.push(pre(c)+rs.map(function(r){return r.t+' — '+dTR(r.d)+(r.a!=null?' ('+fmt0(r.a)+')':'');}).join('\n'+(CO==='grup'?'   ':'')));}
  return L.length?L.join('\n'):'Önümüzdeki günlerde vadesi gelen ödeme görünmüyor ✓';
 }
 if(has('öde')&&has('kira','vergi','sgk','fatura')){
  var tmap={'kira':'kira','vergi':'vergi','sgk':'sgk','fatura':'fatura'};
  for(var key in tmap){ if(q.indexOf(key)<0)continue;
   for(i=0;i<coList.length;i++){c=coList[i];var fs=byCo(S.fixed,c).filter(function(f){return f.type===tmap[key];});
    for(var j=0;j<fs.length;j++){var f=fs[j];var paid=S.fixedLogs.some(function(l){return l.fixedId===f.id&&l.period===monthISO();});
     L.push(pre(c)+f.name+' — bu ay '+(paid?'ÖDENDİ ✓':'henüz ödenmedi (ödeme günü ayın '+f.payDay+'. günü, '+fmt0(f.amount)+')'));}}}
  return L.length?L.join('\n'):null;
 }
 if(has('çek','senet')){
  for(i=0;i<coList.length;i++){c=coList[i];var cq=byCo(S.cheques,c).filter(function(x){return x.durum==='portfoy';});
   if(cq.length)L.push(pre(c)+cq.map(function(x){return (x.tip==='alinan'?'Alınan':'Verilen')+' '+(x.tur==='senet'?'senet':'çek')+': '+x.kisi+' '+fmt0(x.tutar)+' (vade '+dTR(x.vade)+')';}).join(' · '));}
  return L.length?L.join('\n'):'Portföyde bekleyen çek/senet yok.';
 }
 if(has('stok','kritik','malzeme bit')){
  for(i=0;i<coList.length;i++){c=coList[i];var kr=byCo(S.stock,c).filter(function(it){return +(it.min||0)>0&&stockQty(it)<=+it.min;});
   if(kr.length)L.push(pre(c)+'Kritik: '+kr.map(function(it){return it.name+' ('+stockQty(it)+' '+(it.unit||'')+')';}).join(', '));}
  return L.length?L.join('\n'):'Kritik seviyede stok kalemi yok ✓';
 }
 if(has('blokaj','pos')&&has('bekle','ne kadar','geç')){
  for(i=0;i<coList.length;i++){c=coList[i];var s=0,n=0;
   for(var e=0;e<S.posEntries.length;e++){var pe=S.posEntries[e];if(pe.co===c&&pe.status==='bekliyor'){s+=+pe.net;n++;}}
   if(n)L.push(pre(c)+'Blokajda '+n+' işlem, toplam '+fmt0(s));}
  return L.length?L.join('\n'):'Blokajda bekleyen POS tutarı yok.';
 }
 if(has('en çok','en büyük','en yüksek')&&has('gider','harca','masraf')){
  for(i=0;i<coList.length;i++){c=coList[i];var mm=sumRange(c,monthISO()+'-01',todayISO());
   var top=Object.entries(mm.byCat).sort(function(a,b){return b[1]-a[1];})[0];
   if(top)L.push(pre(c)+'Bu ay en büyük gider: '+top[0]+' — '+fmt0(top[1])+(mm.gider?' (giderin %'+(top[1]/mm.gider*100).toFixed(0)+"'i)":''));}
  return L.length?L.join('\n'):null;
 }
 if(has('alacak','borç','borc')&&has('toplam','ne kadar')){
  for(i=0;i<coList.length;i++){c=coList[i];var al=0,bo=0;
   byCo(S.cari,c).forEach(function(x){var bb=cariBalance(x);if(bb>0)al+=bb;else bo-=bb;});
   L.push(pre(c)+'Toplam alacağımız '+fmt0(al)+' · toplam borcumuz '+fmt0(bo));}
  return L.join('\n');
 }
 return null;
}
/* cari / personel adına göre doğrudan yanıt */
function findEntity(words,coList,pre){
 if(!words.length)return null;
 var c,i;
 for(i=0;i<coList.length;i++){c=coList[i];
  var caris=byCo(S.cari,c);
  for(var x=0;x<caris.length;x++){var nm=trLow(caris[x].name);
   if(words.some(function(w){return nm.indexOf(w)>-1;})){
    var bb2=cariBalance(caris[x]);
    var last=S.cariTxns.filter(function(t){return t.cariId===caris[x].id;}).sort(function(a,b){return a.date<b.date?1:-1;})[0];
    return pre(c)+caris[x].name+' bakiyesi: '+fmt(Math.abs(bb2))+' '+(bb2>0?'(bize borçlu)':bb2<0?'(biz borçluyuz)':'(kapalı)')+(last?'. Son hareket: '+dTR(last.date)+' '+(last.type==='borc'?'borç':'alacak')+' '+fmt0(last.amount):'');}}
  var stf=byCo(S.staff,c);
  for(var y=0;y<stf.length;y++){var sn=trLow(stf[y].name);
   if(words.some(function(w){return sn.indexOf(w)>-1;})){
    var st=stf[y];
    var odenen=S.staffTxns.filter(function(t){return t.staffId===st.id&&t.period===monthISO();}).reduce(function(s2,t){return s2+ +t.amount;},0);
    var izin=S.leaves.filter(function(l){return l.staffId===st.id;}).length;
    return pre(c)+st.name+' ('+(st.pos||'personel')+') — net maaş '+fmt0(st.salary)+', bu ay ödenen '+fmt0(odenen)+', kayıtlı izin/rapor: '+izin;}}
 }
 return null;
}

/* ---- SABAH BRİFİNGİ ---- */
var briefTried={};
function localBrief(co){
 var dun=sumRange(co,addDays(todayISO(),-1),addDays(todayISO(),-1));
 var evvel=sumRange(co,addDays(todayISO(),-2),addDays(todayISO(),-2));
 var rems=reminders(co);
 var gec=rems.filter(function(r){return r.df<0;}),bug=rems.filter(function(r){return r.df===0;}),yak=rems.filter(function(r){return r.df>0&&r.df<=3;});
 var bal=0;byCo(S.accounts,co).forEach(function(a){bal+=accBalance(a);});
 var neg=byCo(S.accounts,co).filter(function(a){return accBalance(a)<0;});
 var kritik=byCo(S.stock,co).filter(function(it){return +(it.min||0)>0&&stockQty(it)<=+it.min;});
 var gorev=byCo(S.tasks,co).filter(function(t){return t.status!=='tamam';});
 var L=['📅 '+dTR(todayISO())+' · '+coName(co)];
 L.push('• Dün: ciro '+fmt0(dun.gelir)+(evvel.gelir?' ('+(dun.gelir>=evvel.gelir?'▲ +':'▼ ')+(((dun.gelir-evvel.gelir)/evvel.gelir)*100).toFixed(1)+'% önceki güne göre)':'')+' · gider '+fmt0(dun.gider));
 if(gec.length)L.push('• ⚠ GECİKEN '+gec.length+' ödeme: '+gec.slice(0,3).map(function(r){return r.t+(r.a!=null?' ('+fmt0(r.a)+')':'');}).join('; ')+(gec.length>3?' …':''));
 if(bug.length)L.push('• Bugün ödenecek: '+bug.map(function(r){return r.t+(r.a!=null?' ('+fmt0(r.a)+')':'');}).join('; '));
 else if(!gec.length)L.push('• Bugün vadesi gelen ödeme yok ✓');
 if(yak.length)L.push('• 3 gün içinde: '+yak.slice(0,3).map(function(r){return r.t+' ('+dTR(r.d)+')';}).join('; '));
 L.push('• Nakit + banka: '+fmt0(bal)+(neg.length?' — ⚠ '+neg.map(function(a){return a.name;}).join(', ')+' negatifte':''));
 if(kritik.length)L.push('• 📦 Kritik stok: '+kritik.map(function(x){return x.name;}).join(', '));
 if(gorev.length)L.push('• ✔ Açık görev: '+gorev.length+' adet');
 return L.join('\n');
}
function renderBriefCard(){
 if(CO==='grup')return;
 var box=document.getElementById('briefBox');if(!box)return;
 var key='brief:'+CO+':'+todayISO();
 var cached=S.aiCache&&S.aiCache[key];
 var txt=cached||localBrief(CO);
 box.innerHTML='<div class="card" style="border-left:4px solid var(--copper)"><h2>🌅 Sabah Brifingi '+
  '<button class="btn sm gh" data-act="aiBriefRun">'+(cached?'↻ Yenile':'✦ AI ile zenginleştir')+'</button>'+
  '<button class="btn sm gh" data-act="openAiChat">💬 Soru sor</button></h2>'+
  '<div class="aiBox" style="white-space:pre-wrap">'+esc(txt)+'</div>'+(cached?aiTag(true):'')+'</div>';
 if(S.ai&&S.ai.autoBrief&&!cached&&!briefTried[key]){briefTried[key]=1;aiBriefRun('auto');}
}
async function aiBriefRun(mode){
 if(CO==='grup')return;
 var key='brief:'+CO+':'+todayISO();
 var loc=localBrief(CO);
 if(PAGE==='ai')outCard('🌅 Sabah Brifingi',loc,false,true);
 else if(mode!=='auto'){var b=document.getElementById('briefBox');var x=b&&b.querySelector('.aiBox');if(x)x.textContent='✦ AI brifingi hazırlanıyor…';}
 var ai=await aiAsk('VERI: '+JSON.stringify(packCo(CO))+'\n\nYEREL BRIFING: '+loc+'\n\nGÖREV: İşletme sahibi için 5-7 maddelik, • ile başlayan Türkçe sabah brifingi yaz. En kritik uyarıyla başla, rakamları TL ile ver, son madde tek cümlelik somut bir öneri olsun.');
 if(ai){S.aiCache[key]=ai;save();}
 if(PAGE==='ai')outCard('🌅 Sabah Brifingi',ai||loc,!!ai);
 else if(PAGE==='dash')renderBriefCard();
}
function outCard(title,text,live,pending){
 var o=document.getElementById('aiOut');if(!o)return;
 o.innerHTML='<div class="card"><h2>'+title+'</h2><div class="aiBox" style="white-space:pre-wrap">'+esc(text)+'</div>'+(pending?'<div class="tiny" style="margin-top:6px">✦ AI ile zenginleştiriliyor…</div>':aiTag(live))+'</div>';
 try{o.scrollIntoView({behavior:'smooth'});}catch(e){}
}

/* ---- NAKİT AKIŞ PROJEKSİYONU ---- */
function cashForecast(co,days){
 days=days||30;
 var start=todayISO(),end=addDays(start,days);
 var M={};
 function put(d,inV,outV,t){
  if(!d)return; if(d<start)d=start; if(d>end)return;
  var m=M[d]||(M[d]={in:0,out:0,items:[]});
  m.in+=inV;m.out+=outV;m.items.push({t:t,a:(inV||-outV)});
 }
 var FT={kira:'Kira',vergi:'Vergi',sgk:'SGK',fatura:'Fatura'};
 var per=monthISO(),perN=periodAdd(per,1),ps=[per,perN];
 byCo(S.fixed,co).forEach(function(f){
  ps.forEach(function(p){
   if(S.fixedLogs.some(function(l){return l.fixedId===f.id&&l.period===p;}))return;
   var d=clampDay(+p.slice(0,4),+p.slice(5,7),+f.payDay||1);
   if(d>=start)put(d,0,+f.amount||0,(FT[f.type]||'Sabit')+': '+f.name);
  });
 });
 byCo(S.cards,co).forEach(function(c){var debt=cardDebt(c);if(debt>0)put(nextDue(+c.dueDay),0,debt,'Kredi kartı: '+c.name);});
 S.cariTxns.forEach(function(t){
  if(t.co!==co||!t.vade||t.vade<start)return;
  var c=S.cari.find(function(x){return x.id===t.cariId;})||{};
  if(t.type==='borc')put(t.vade,+t.amount,0,'Tahsilat: '+(c.name||'?'));
  else put(t.vade,0,+t.amount,'Ödeme: '+(c.name||'?'));
 });
 byCo(S.cheques,co).forEach(function(c){
  if(c.durum!=='portfoy')return;
  if(c.tip==='alinan')put(c.vade,+c.tutar,0,'Çek tahsili: '+c.kisi);
  else put(c.vade,0,+c.tutar,'Çek ödemesi: '+c.kisi);
 });
 S.posEntries.forEach(function(p){if(p.co===co&&p.status==='bekliyor')put(p.settleDate,+p.net,0,'POS hesaba geçiş');});
 var bal=0;byCo(S.accounts,co).forEach(function(a){bal+=accBalance(a);});
 var labels=[],balS=[],items=[],run=bal,minB=bal,minD=start,ti=0,to=0;
 for(var i=0;i<=days;i++){
  var d=addDays(start,i),m=M[d];
  if(m){run+=m.in-m.out;ti+=m.in;to+=m.out;m.items.forEach(function(it){items.push({d:d,t:it.t,a:it.a});});}
  if(run<minB){minB=run;minD=d;}
  labels.push(i%5===0?dTR(d).slice(0,5):'');
  balS.push(Math.round(run));
 }
 items.sort(function(a,b){return Math.abs(b.a)-Math.abs(a.a);});
 return {bal0:bal,labels:labels,balS:balS,items:items,minB:minB,minD:minD,ti:ti,to:to,end:run};
}
function fcCard(days){
 if(CO==='grup')return '';
 days=days||30;
 var f=cashForecast(CO,days);
 if(!f.items.length)return '<div class="card"><h2>📈 Nakit Projeksiyonu ('+days+' gün)</h2><div class="empty"><b>Vadeli kayıt yok</b>Sabit ödeme, kart borcu, cari vade, çek ve POS blokajı girildikçe projeksiyon burada oluşur.</div></div>';
 var warn=f.minB<0?'<div class="rem d-red" style="margin-top:10px"><span class="dot"></span><span><b>Nakit açığı riski:</b> '+dTR(f.minD)+' civarı bakiye '+fmt0(f.minB)+' seviyesine iniyor — tahsilatı öne çekme veya ödeme erteleme değerlendirin.</span></div>':'';
 var list=f.items.slice(0,6).map(function(it){return '<div class="fcItem"><span>'+dTR(it.d)+' · '+esc(it.t)+'</span><b style="color:'+(it.a>=0?'var(--pos)':'var(--neg)')+'">'+(it.a>=0?'+':'−')+fmt0(Math.abs(it.a))+'</b></div>';}).join('');
 return '<div class="card"><h2>📈 Nakit Projeksiyonu <span class="tiny">bugün '+fmt0(f.bal0)+' → '+days+' gün sonra ~'+fmt0(f.end)+'</span></h2>'+
  chartArea([{name:'Beklenen bakiye',color:'#0f4c5c',values:f.balS}],f.labels,185)+
  '<div class="tiny" style="margin:8px 0 4px">Kesinleşmiş girişler <b style="color:var(--pos)">+'+fmt0(f.ti)+'</b> · çıkışlar <b style="color:var(--neg)">−'+fmt0(f.to)+'</b> · günlük satış geliri projeksiyona dahil değildir.</div>'+
  list+warn+
  '<div style="margin-top:10px"><button class="btn sm gh" data-act="aiFcComment">✦ AI Yorumu</button></div><div id="fcAiBox"></div></div>';
}
function aiFcRun(){var o=document.getElementById('aiOut');if(o){o.innerHTML=fcCard(30);try{o.scrollIntoView({behavior:'smooth'});}catch(e){}}}
function localFcComment(f){
 if(f.minB<0){var big=f.items.find(function(i){return i.a<0;});
  return 'Projeksiyona göre '+dTR(f.minD)+' civarında ~'+fmt0(Math.abs(f.minB))+' nakit açığı oluşuyor. En büyük çıkış: "'+((big||{}).t||'—')+'". Bu tarihten önceki tahsilatları öne çekmeyi veya en büyük ödemeyi bölmeyi değerlendirin.';}
 return 'Önümüzdeki 30 günde nakit pozitif seyrediyor ('+fmt0(f.bal0)+' → '+fmt0(f.end)+'). Yine de '+fmt0(f.to)+' tutarındaki çıkış günlerinde bakiye kontrolü yapın.';
}
async function aiFcComment(){
 var b=document.getElementById('fcAiBox');if(!b)return;
 b.innerHTML='<div class="tiny" style="margin-top:8px">✦ Yorum hazırlanıyor…</div>';
 var f=cashForecast(CO,30);
 var ai=await aiAsk('30 günlük nakit projeksiyonu: '+JSON.stringify({baslangic:Math.round(f.bal0),son:Math.round(f.end),enDusuk:{tutar:Math.round(f.minB),tarih:f.minD},toplamGiris:Math.round(f.ti),toplamCikis:Math.round(f.to),kalemler:f.items.slice(0,12)})+'\n\nGÖREV: 3-4 cümlede yorumla; açık riski varsa hangi tahsilatın öne çekilmesi / hangi ödemenin ertelenmesinin mantıklı olduğunu somut söyle.');
 b.innerHTML='<div class="aiBox" style="white-space:pre-wrap;margin-top:8px">'+esc(ai||localFcComment(f))+'</div>'+aiTag(!!ai);
}

/* ---- ANOMALİ TARAMASI ---- */
function scanAnomalies(co){
 var F=[];
 var tx=byCo(S.txns,co);
 var seen={};
 tx.forEach(function(t){
  if(t.type!=='gider')return;
  var k=t.date+'|'+t.amount+'|'+(t.cat||'');
  if(seen[k]===1){F.push({s:'n',t:'Mükerrer kayıt şüphesi',d:dTR(t.date)+' · '+fmt(t.amount)+' · '+(t.cat||'')+' — aynı gün aynı tutar iki kez girilmiş olabilir ('+(t.desc||'').slice(0,40)+')'});seen[k]=2;}
  else if(seen[k]!==2)seen[k]=1;
 });
 var from90=addDays(todayISO(),-90),stats={};
 tx.forEach(function(t){if(t.type==='gider'&&t.date>=from90){var cc=t.cat||'—';(stats[cc]=stats[cc]||[]).push(+t.amount);}});
 tx.forEach(function(t){
  if(t.type!=='gider'||t.date.slice(0,7)!==monthISO())return;
  var arr=stats[t.cat||'—']||[];
  if(arr.length>=5){var avg=arr.reduce(function(a,b){return a+b;},0)/arr.length;
   if(+t.amount>avg*3&&+t.amount>2000)F.push({s:'w',t:'Sıra dışı tutar',d:dTR(t.date)+' · '+(t.cat||'')+' · '+fmt(t.amount)+' — kategorinin 90 gün ortalamasının ('+fmt0(avg)+') 3 katından fazla'});}
 });
 byCo(S.accounts,co).forEach(function(a){
  var b=accBalance(a);
  if(b<0)F.push({s:'n',t:'Negatif bakiye',d:a.name+' hesabı '+fmt(b)+' seviyesinde'});
  else if(a.type==='kasa'&&b>75000)F.push({s:'w',t:'Kasada yüksek nakit',d:a.name+': '+fmt0(b)+' — güvenlik için bankaya yatırmayı değerlendirin'});
 });
 byCo(S.cari,co).forEach(function(c){
  var b=cariBalance(c);
  if(+c.riskLimit>0&&b>+c.riskLimit)F.push({s:'n',t:'Risk limiti aşımı',d:c.name+' bakiyesi '+fmt0(b)+' (limit '+fmt0(c.riskLimit)+')'});
 });
 reminders(co).filter(function(r){return r.df<0;}).slice(0,5).forEach(function(r){
  F.push({s:'n',t:'Geciken ödeme',d:r.t+' · '+dTR(r.d)+' ('+Math.abs(r.df)+' gün gecikti)'});
 });
 return F;
}
async function aiAnomaly(){
 var F=scanAnomalies(CO);
 var body=F.length
  ? F.map(function(f){return '<div class="rem '+(f.s==='n'?'d-red':'d-org')+'"><span class="dot"></span><span><b>'+esc(f.t)+':</b> '+esc(f.d)+'</span></div>';}).join('')
  : '<div class="empty"><b>Temiz görünüyor ✓</b>Mükerrer kayıt, sıra dışı tutar, negatif bakiye veya limit aşımı tespit edilmedi.</div>';
 var o=document.getElementById('aiOut');if(!o)return;
 o.innerHTML='<div class="card"><h2>🕵️ Anomali Taraması <span class="tiny">'+F.length+' bulgu</span></h2>'+body+'<div id="agAi">'+(F.length?'<div class="tiny" style="margin-top:8px">✦ AI değerlendirmesi hazırlanıyor…</div>':'')+'</div></div>';
 try{o.scrollIntoView({behavior:'smooth'});}catch(e){}
 if(!F.length)return;
 var ai=await aiAsk('Anomali bulguları: '+JSON.stringify(F.map(function(f){return f.t+': '+f.d;}))+'\n\nGÖREV: 2-3 cümlede en kritik bulguyu ve yapılması gerekeni söyle.');
 var g=document.getElementById('agAi');
 if(g)g.innerHTML='<div class="aiBox" style="margin-top:8px;white-space:pre-wrap">'+esc(ai||('En kritik bulgu: '+F[0].t+' — '+F[0].d+'. Kaydı açıp doğrulayın; hatalıysa silin, doğruysa açıklamaya not düşün.'))+'</div>'+aiTag(!!ai);
}

/* ---- MALİYET OPTİMİZASYONU ---- */
function costFindings(co){
 var F=[];
 var ent=byCo(S.posEntries,co),agg={};
 ent.forEach(function(e){var a=agg[e.posId]=agg[e.posId]||{g:0,c:0};a.g+=+e.gross;a.c+=+e.comm;});
 var rows=byCo(S.pos,co).map(function(p){var a=agg[p.id]||{g:0,c:0};return {p:p,g:a.g,c:a.c};})
  .filter(function(r){return r.g>0;})
  .map(function(r){r.eff=r.c/r.g*100;return r;})
  .sort(function(a,b){return a.eff-b.eff;});
 if(rows.length>=2){
  var best=rows[0],worst=rows[rows.length-1];
  if(worst.eff-best.eff>0.2){
   var months=new Set(ent.filter(function(e){return e.posId===worst.p.id;}).map(function(e){return e.date.slice(0,7);})).size||1;
   var tasarruf=(worst.g/months)*(worst.eff-best.eff)/100;
   F.push({t:'POS komisyon farkı',d:worst.p.name+' efektif %'+worst.eff.toFixed(2)+' — '+best.p.name+' %'+best.eff.toFixed(2)+'. Ciroyu '+best.p.name+' cihazına kaydırırsanız tahmini aylık ~'+fmt0(tasarruf)+' tasarruf.'});
  }
 }
 var a30=sumRange(co,addDays(todayISO(),-29),todayISO()).byCat;
 var b30=sumRange(co,addDays(todayISO(),-59),addDays(todayISO(),-30)).byCat;
 Object.keys(a30).forEach(function(cc){
  var prev=b30[cc]||0;
  if(prev>1000&&a30[cc]>prev*1.25)F.push({t:'Hızlanan gider: '+cc,d:'Son 30 gün '+fmt0(a30[cc])+' — önceki 30 güne ('+fmt0(prev)+') göre %'+(((a30[cc]-prev)/prev)*100).toFixed(0)+' artış.'});
 });
 byCo(S.fixed,co).forEach(function(f){
  var logs=S.fixedLogs.filter(function(l){return l.fixedId===f.id;}).sort(function(a,b){return a.period<b.period?-1:1;});
  if(logs.length>=4){
   var last=+logs[logs.length-1].amount;
   var prev3=logs.slice(-4,-1);
   var avg=prev3.reduce(function(s,l){return s+ +l.amount;},0)/prev3.length;
   if(avg>0&&last>avg*1.2)F.push({t:'Fatura artışı: '+f.name,d:'Son ödeme '+fmt0(last)+' — önceki 3 ay ortalamasının ('+fmt0(avg)+') %'+(((last-avg)/avg)*100).toFixed(0)+' üzerinde.'});
  }
 });
 return F;
}
async function aiCost(){
 var F=costFindings(CO);
 var body=F.length
  ? F.map(function(f){return '<div class="rem d-org"><span class="dot"></span><span><b>'+esc(f.t)+':</b> '+esc(f.d)+'</span></div>';}).join('')
  : '<div class="empty"><b>Belirgin fırsat yok ✓</b>POS komisyonları dengeli, gider kalemlerinde ani artış görünmüyor.</div>';
 var o=document.getElementById('aiOut');if(!o)return;
 o.innerHTML='<div class="card"><h2>💰 Maliyet Optimizasyonu <span class="tiny">'+F.length+' fırsat</span></h2>'+body+'<div id="agAi">'+(F.length?'<div class="tiny" style="margin-top:8px">✦ AI önerisi hazırlanıyor…</div>':'')+'</div></div>';
 try{o.scrollIntoView({behavior:'smooth'});}catch(e){}
 if(!F.length)return;
 var ai=await aiAsk('Maliyet bulguları: '+JSON.stringify(F.map(function(f){return f.t+': '+f.d;}))+'\n\nGÖREV: En yüksek etkili 2 aksiyonu öncelik sırasıyla, 3-4 cümlede öner.');
 var g=document.getElementById('agAi');
 if(g)g.innerHTML='<div class="aiBox" style="margin-top:8px;white-space:pre-wrap">'+esc(ai||('Öncelik: '+F[0].t+'. '+F[0].d))+'</div>'+aiTag(!!ai);
}

/* ---- CARİ RİSK & TAHSİLAT ---- */
function cariRiskRows(co){
 var out=[];
 byCo(S.cari,co).forEach(function(c){
  var b=cariBalance(c);if(b<=0)return;
  var od=S.cariTxns.filter(function(t){return t.cariId===c.id&&t.type==='borc'&&t.vade&&daysDiff(t.vade)<0;});
  var maxG=od.reduce(function(m,t){return Math.max(m,-daysDiff(t.vade));},0);
  var odSum=od.reduce(function(s,t){return s+ +t.amount;},0);
  var skor=Math.min(100,Math.round(maxG*1.5+(odSum/b)*40+((+c.riskLimit>0&&b>+c.riskLimit)?25:0)));
  out.push({c:c,b:b,maxG:maxG,odSum:odSum,skor:skor});
 });
 return out.sort(function(a,b){return b.skor-a.skor||b.b-a.b;});
}
function aiCariRisk(){
 var rows=cariRiskRows(CO);
 var o=document.getElementById('aiOut');if(!o)return;
 if(!rows.length){o.innerHTML='<div class="card"><h2>⚖️ Cari Risk & Tahsilat</h2><div class="empty"><b>Açık alacak yok</b>Bakiyesi lehimize olan cari bulunmuyor.</div></div>';return;}
 o.innerHTML='<div class="card"><h2>⚖️ Cari Risk & Tahsilat <span class="tiny">skor: gecikme + vade aşımı payı + limit</span></h2>'+
  '<table><thead><tr><th>Cari</th><th class="num">Alacak</th><th class="num hidem">Gecikmiş</th><th>Risk Skoru</th><th class="rowact"></th></tr></thead><tbody>'+
  rows.slice(0,12).map(function(r){
   var col=r.skor>=60?'var(--neg)':r.skor>=30?'var(--warn)':'var(--pos)';
   return '<tr><td><b>'+esc(r.c.name)+'</b>'+(r.maxG?'<div class="tiny">en eski vade '+r.maxG+' gün gecikmiş</div>':'')+'</td>'+
    '<td class="num">'+fmt0(r.b)+'</td><td class="num hidem" style="color:var(--neg)">'+(r.odSum?fmt0(r.odSum):'—')+'</td>'+
    '<td><div style="display:flex;align-items:center;gap:7px"><div class="skorBar"><i style="width:'+r.skor+'%;background:'+col+'"></i></div><b style="color:'+col+';min-width:24px;text-align:right">'+r.skor+'</b></div></td>'+
    '<td class="rowact"><button class="btn sm gh" data-act="aiCollectMail" data-arg="'+r.c.id+'" title="Tahsilat e-postası">✉</button></td></tr>';
  }).join('')+
  '</tbody></table><p class="tiny" style="margin-top:8px">✉ kibar bir tahsilat hatırlatma e-postası taslağı hazırlar (AI erişilirse metni iyileştirir).</p></div>';
 try{o.scrollIntoView({behavior:'smooth'});}catch(e){}
}
async function aiCollectMail(cariId){
 var c=S.cari.find(function(x){return x.id===cariId;});if(!c)return;
 var b=cariBalance(c);
 var od=S.cariTxns.filter(function(t){return t.cariId===c.id&&t.type==='borc'&&t.vade&&daysDiff(t.vade)<0;})
  .map(function(t){return {tarih:t.date,vade:t.vade,tutar:+t.amount,aciklama:t.desc||''};});
 var odT=od.reduce(function(s,t){return s+t.tutar;},0);
 var loc='Konu: '+coName(CO)+' — Hesap Bakiyesi Hatırlatması\n\nSayın '+c.name+' yetkilisi,\n\nKayıtlarımıza göre '+dTR(todayISO())+' itibarıyla hesabınızda '+fmt(b)+' tutarında bakiye bulunmaktadır'+(od.length?' ve bunun '+fmt0(odT)+' tutarındaki kısmının vadesi geçmiştir':'')+'. Ödeme planınız hakkında bilgi verebilirseniz seviniriz; mutabakat için güncel ekstrenizi paylaşabiliriz.\n\nİyi çalışmalar dileriz,\n'+coName(CO)+' Muhasebe';
 mailModal(c,loc,false);
 var ai=await aiAsk('Cari: '+c.name+' · Guncel bakiye: '+Math.round(b)+' TL · Gecikmis kalemler: '+JSON.stringify(od)+'\n\nGÖREV: İş ilişkisini bozmayan, kibar ama net bir tahsilat hatırlatma e-postası yaz. Format: "Konu: ..." satırı + boş satır + gövde. En fazla 120 kelime. İmza: "'+coName(CO)+' Muhasebe".');
 if(ai&&document.getElementById('mailTxt'))mailModal(c,ai,true);
}
function mailModal(c,text,live){
 document.getElementById('modalBox').innerHTML=
  '<div class="mh"><h3>✉ Tahsilat E-postası — '+esc(c.name)+'</h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div>'+
  '<div class="mb"><div class="fld"><textarea id="mailTxt" rows="11" style="font-size:13px;line-height:1.5">'+esc(text)+'</textarea></div>'+
  '<div class="tiny">'+(live?'✦ AI taslağı — göndermeden önce mutlaka kontrol edin.':'⚙ Yerleşik şablon — AI erişilirse metin otomatik iyileştirilir.')+'</div></div>'+
  '<div class="mf"><button class="btn gh" data-act="closeModal">Kapat</button><button class="btn" data-act="copyMail">📋 Kopyala</button></div>';
 document.getElementById('modalWrap').classList.add('on');
}
function copyMail(){
 var t=document.getElementById('mailTxt');if(!t)return;
 t.select();
 var ok=false;try{ok=document.execCommand('copy');}catch(e){}
 if(!ok&&navigator.clipboard){navigator.clipboard.writeText(t.value).then(function(){toast('E-posta panoya kopyalandı');});return;}
 toast(ok?'E-posta panoya kopyalandı':'Kopyalanamadı — metni elle seçip kopyalayın');
}

/* ---- AI CFO ANALİZİ ---- */
async function aiCFO(){
 var target=document.getElementById(PAGE==='rep'?'aiBox':'aiOut')||document.getElementById('aiOut');
 if(!target)return;
 target.innerHTML='<div class="card"><h2>🧠 AI CFO Analizi</h2><div class="aiBox">Derin analiz hazırlanıyor…</div></div>';
 try{target.scrollIntoView({behavior:'smooth'});}catch(e){}
 var co=CO;
 var ms=monthSeries(co,4);
 var m=sumRange(co,monthISO()+'-01',todayISO());
 var pp=periodAdd(monthISO(),-1);
 var pm=sumRange(co,pp+'-01',pp+'-31');
 var f=cashForecast(co,30);
 var an=scanAnomalies(co).slice(0,6).map(function(x){return x.t+': '+x.d;});
 var ag=agingBuckets(co);
 var pack={sirket:coName(co),sonAylar:ms,buAy:{gelir:Math.round(m.gelir),gider:Math.round(m.gider),net:Math.round(m.net),giderKirilimi:m.byCat},
  gecenAy:{gelir:Math.round(pm.gelir),gider:Math.round(pm.gider),net:Math.round(pm.net)},
  nakitProjeksiyon30g:{bugun:Math.round(f.bal0),sonra:Math.round(f.end),enDusuk:Math.round(f.minB),enDusukTarih:f.minD},
  vadesiGecmisAlacak:Math.round(ag.tot),anomaliler:an};
 var ai=await aiAsk('VERI: '+JSON.stringify(pack)+'\n\nGÖREV: CFO gözüyle sade Türkçe analiz: 1) Genel değerlendirme (2 cümle) 2) Geçen aya kıyasla marj/trend 3) En önemli 3 risk 4) 3 somut aksiyon. Madde işaretli, başlıksız, en fazla 220 kelime.',1200);
 var loc=localAiSummary(aiDataPack('co'))+
  '\n\n• 30 gün nakit projeksiyonu: '+fmt0(f.bal0)+' → '+fmt0(f.end)+(f.minB<0?' — ⚠ '+dTR(f.minD)+' civarı '+fmt0(f.minB)+' açık riski':'')+
  '\n• Vadesi geçmiş alacak hareketi: '+fmt0(ag.tot)+
  (an.length?'\n• Anomali: '+an[0]:'');
 target.innerHTML='<div class="card"><h2>🧠 AI CFO Analizi</h2><div class="aiBox" style="white-space:pre-wrap">'+esc(ai||loc)+'</div>'+aiTag(!!ai)+'</div>';
}

/* ---- ALACAK YAŞLANDIRMA ---- */
function agingBuckets(co){
 var B=[0,0,0,0],tot=0,per={};
 S.cariTxns.forEach(function(t){
  if(t.co!==co||t.type!=='borc'||!t.vade)return;
  var g=-daysDiff(t.vade);if(g<=0)return;
  var i=g<=30?0:g<=60?1:g<=90?2:3;
  B[i]+=+t.amount;tot+=+t.amount;
  per[t.cariId]=(per[t.cariId]||0)+ +t.amount;
 });
 var top=Object.entries(per).sort(function(a,b){return b[1]-a[1];}).slice(0,3)
  .map(function(e){var c=S.cari.find(function(x){return x.id===e[0];});return {name:(c||{}).name||'?',v:e[1]};});
 return {B:B,tot:tot,top:top};
}
function cariAgingCard(){
 var a=agingBuckets(CO);
 if(!a.tot)return '';
 var L=['0-30 gün','31-60 gün','61-90 gün','90+ gün'];
 return '<div class="card"><h2>⏳ Alacak Yaşlandırma <span class="tiny">vadesi geçen borç hareketleri · toplam '+fmt0(a.tot)+'</span></h2>'+
  '<div class="grid g4">'+a.B.map(function(v,i){return '<div class="kpi'+(i>=2&&v>0?' n':'')+'"><div class="l">'+L[i]+'</div><div class="v">'+fmt0(v)+'</div></div>';}).join('')+'</div>'+
  (a.top.length?'<p class="tiny" style="margin-top:9px">En yüksek gecikme: '+a.top.map(function(t){return esc(t.name)+' ('+fmt0(t.v)+')';}).join(' · ')+' — önceliklendirme için <b>AI Asistan → Cari Risk</b> ajanını kullanın.</p>':'')+'</div>';
}

/* ---- POS KARŞILAŞTIRMA ---- */
function posCompareCard(list,ent){
 var agg={};ent.forEach(function(e){var a=agg[e.posId]=agg[e.posId]||{g:0,c:0};a.g+=+e.gross;a.c+=+e.comm;});
 var rows=list.map(function(p){var a=agg[p.id]||{g:0,c:0};return {p:p,g:a.g,c:a.c};})
  .filter(function(r){return r.g>0;})
  .map(function(r){r.eff=r.c/r.g*100;return r;})
  .sort(function(a,b){return a.eff-b.eff;});
 if(rows.length<2)return '';
 var best=rows[0],fark=rows[rows.length-1].eff-best.eff;
 return '<div class="card"><h2>⚖ POS Karşılaştırma <span class="tiny">efektif maliyet — tüm zamanlar</span></h2>'+
  '<table><thead><tr><th>POS</th><th class="num">Brüt Ciro</th><th class="num hidem">Komisyon</th><th class="num">Efektif %</th><th class="hidem">Blokaj</th></tr></thead><tbody>'+
  rows.map(function(r){return '<tr><td><b>'+esc(r.p.name)+'</b> '+(r===best?'<span class="chip p">En avantajlı</span>':'')+'</td><td class="num">'+fmt0(r.g)+'</td><td class="num hidem" style="color:var(--neg)">'+fmt0(r.c)+'</td><td class="num"><b>%'+r.eff.toFixed(2)+'</b></td><td class="hidem">'+(r.p.blokaj||0)+' gün</td></tr>';}).join('')+
  '</tbody></table>'+
  (fark>0.2?'<p class="tiny" style="margin-top:8px">💡 Ciroyu <b>'+esc(best.p.name)+'</b> cihazına yönlendirirseniz her 100.000 ₺ ciroda ~'+fmt0(fark*1000)+' komisyon tasarrufu.</p>':'')+'</div>';
}

/* ---- KART TAKSİT YÜKÜ ---- */
function cardInstCard(list){
 var cur=monthISO(),load={};
 S.cardTxns.forEach(function(t){
  if(t.type!=='harcama')return;
  if(!list.some(function(c){return c.id===t.cardId;}))return;
  var n=+t.taksit||1,per=+t.amount/n;
  for(var i=0;i<n;i++){var p=periodAdd(t.date.slice(0,7),i);if(p>=cur)load[p]=(load[p]||0)+per;}
 });
 var labels=[],vals=[];
 for(var i=0;i<12;i++){var p=periodAdd(cur,i);labels.push(AYLAR[+p.slice(5,7)-1].slice(0,3));vals.push(Math.round(load[p]||0));}
 var taksitli=S.cardTxns.some(function(t){return t.type==='harcama'&&(+t.taksit||1)>1&&list.some(function(c){return c.id===t.cardId;});});
 if(!taksitli)return '';
 return '<div class="card"><h2>📆 Gelecek 12 Ay Kart Yükü <span class="tiny">taksitler döneme bölünmüş tahmini çıkış</span></h2>'+
  chartArea([{name:'Aylık yük',color:'#a24a68',values:vals}],labels,170)+'</div>';
}

/* ---- GENEL ARAMA ---- */
function globalSearch(){
 if(!CO)return;
 try{closeSheet();}catch(e){}
 document.getElementById('modalBox').innerHTML=
  '<div class="mh"><h3>🔍 Genel Arama</h3><button data-act="closeModal" style="font-size:20px;color:var(--ink3)">✕</button></div>'+
  '<div class="mb"><div class="fld"><input id="gsIn" placeholder="Cari, işlem, personel, görev, çek, ürün, hesap… (en az 2 harf)" autocomplete="off"></div><div id="gsRes" style="margin-top:8px"><div class="tiny" style="padding:4px 2px">Yazdıkça '+(CO==='grup'?'4 şirkette birden':coName(CO)+' kayıtlarında')+' arar. Kısayol: <b>/</b></div></div></div>';
 document.getElementById('modalWrap').classList.add('on');
 var i=document.getElementById('gsIn');
 i.addEventListener('input',runGS);
 i.addEventListener('keydown',function(e){if(e.key==='Enter')e.preventDefault();});
 setTimeout(function(){try{i.focus();}catch(e){}},60);
}
function runGS(){
 var el=document.getElementById('gsIn');var box=document.getElementById('gsRes');
 if(!el||!box)return;
 var q=trLow(el.value).trim();
 if(q.length<2){box.innerHTML='<div class="tiny" style="padding:4px 2px">Aramak için en az 2 harf yazın…</div>';return;}
 var grup=(CO==='grup');
 var coList=grup?COMPANIES.map(function(c){return c.id;}):[CO];
 function hit(s){return trLow(s).indexOf(q)>-1;}
 var R=[];
 function push(ic,label,sub,page,kind,id,co){if(R.length<9)R.push({ic:ic,label:label,sub:(grup?coName(co)+' · ':'')+sub,page:page,kind:kind||'',id:id||'',co:co});}
 coList.forEach(function(co){
  byCo(S.cari,co).forEach(function(c){if(hit(c.name)||hit(c.taxNo)||hit(c.phone))push('👥',c.name,'Cari · bakiye '+fmt0(cariBalance(c)),'cari','cariE',c.id,co);});
  byCo(S.staff,co).forEach(function(s){if(hit(s.name)||hit(s.pos))push('🧑‍🍳',s.name,'Personel · '+(s.pos||''),'staff','',s.id,co);});
  byCo(S.txns,co).forEach(function(t){if(hit(t.desc)||String(t.amount).indexOf(q)>-1)push('⇅',(t.desc||t.cat||'İşlem'),dTR(t.date)+' · '+fmt(t.amount)+' · '+(t.type==='gelir'?'Gelir':t.type==='gider'?'Gider':'Virman'),'tx','',t.id,co);});
  byCo(S.tasks,co).forEach(function(g){if(hit(g.title))push('✔',g.title,'Görev · '+(g.status==='tamam'?'tamamlandı':'açık'),'task','',g.id,co);});
  byCo(S.cheques,co).forEach(function(c){if(hit(c.kisi))push('🧾',c.kisi,(c.tip==='alinan'?'Alınan':'Verilen')+' '+(c.tur==='senet'?'senet':'çek')+' '+fmt0(c.tutar)+' · vade '+dTR(c.vade),'cek','',c.id,co);});
  byCo(S.stock,co).forEach(function(it){if(hit(it.name))push('📦',it.name,'Stok · '+stockQty(it)+' '+(it.unit||''),'stok','',it.id,co);});
  byCo(S.accounts,co).forEach(function(a){if(hit(a.name)||hit(a.bankName))push('🏦',a.name,'Hesap · '+fmt0(accBalance(a)),'acc','',a.id,co);});
  byCo(S.fixed,co).forEach(function(f){if(hit(f.name))push('📅',f.name,'Sabit ödeme · '+fmt0(f.amount),'fixed','',f.id,co);});
  byCo(S.cards,co).forEach(function(cd){if(hit(cd.name)||hit(cd.bank))push('💠',cd.name,'Kart · borç '+fmt0(cardDebt(cd)),'card','cardE',cd.id,co);});
 });
 box.innerHTML= R.length
  ? R.map(function(r){return '<button class="gsRow" data-act="gsGo" data-arg="'+r.page+'~'+r.kind+'~'+r.id+'~'+r.co+'"><span>'+r.ic+'</span><span style="min-width:0"><b>'+esc(r.label)+'</b><div class="tiny">'+esc(r.sub)+'</div></span><span class="chip g">git →</span></button>';}).join('')
  : '<div class="empty" style="padding:12px"><b>Sonuç yok</b>Aramanız için eşleşme bulunamadı.</div>';
}
function gsGo(page,kind,id,co){
 closeModal();
 if(co&&co!==CO)enterCo(co);
 go(page);
 if(kind==='cariE'&&id)setTimeout(function(){try{cariEkstre(id);}catch(e){}},90);
 if(kind==='cardE'&&id)setTimeout(function(){try{cardEkstre(id);}catch(e){}},90);
}
document.addEventListener('keydown',function(e){
 if(e.key!=='/'||!CO)return;
 var t=e.target,tag=t&&t.tagName;
 if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
 if(document.getElementById('modalWrap').classList.contains('on'))return;
 e.preventDefault();globalSearch();
});
function openAiChat(){
 if(!CO){toast('Önce bir şirket seçin');return;}
 go('ai');
 setTimeout(function(){var i=document.getElementById('aiIn');if(i)try{i.focus();}catch(e){}},90);
}

/* ---- AYARLAR: AI KARTI ---- */
function aiSettingsCard(){
 var auto=S.ai&&S.ai.autoBrief;
 var n=Object.keys(S.aiCache||{}).length;
 var st=AI_ON===false?' <b style="color:var(--warn)">Şu an: yerleşik mod.</b>':AI_ON===true?' <b style="color:var(--pos)">Şu an: canlı AI ✓</b>':'';
 return '<div class="card"><h2>✦ Yapay Zeka Ayarları</h2>'+
  '<p class="mut" style="margin-bottom:11px">AI ajanları yalnızca öneri üretir; onayınız olmadan hiçbir kayıt oluşturmaz veya değiştirmez. Claude ortamında canlı yapay zeka, dışarıda yerleşik kural tabanlı analiz çalışır.'+st+'</p>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
  '<button class="btn '+(auto?'':'gh')+'" data-act="toggleAutoBrief">🌅 Otomatik sabah brifingi: '+(auto?'AÇIK':'kapalı')+'</button>'+
  '<button class="btn gh" data-act="aiCacheClear">🧹 AI önbelleğini temizle'+(n?' ('+n+')':'')+'</button>'+
  '<button class="btn gh" data-act="openAiChat">✦ AI Asistanı Aç</button></div></div>';
}
function toggleAutoBrief(){S.ai=S.ai||{};S.ai.autoBrief=S.ai.autoBrief?0:1;save();toast(S.ai.autoBrief?'Sabah brifingi her gün ilk açılışta otomatik oluşturulacak':'Otomatik brifing kapatıldı — dilediğinizde elle çalıştırabilirsiniz');rSet();}
function aiCacheClear(){S.aiCache={};briefTried={};save();toast('AI önbelleği temizlendi');rSet();}

/* ---- DEMO EKLERİ (taksit, gecikmiş vade, mükerrer örneği) ---- */
function demoV4Extras(){
 try{
  COMPANIES.forEach(function(c){
   var card=S.cards.find(function(x){return x.co===c.id;});
   if(card){
    S.cardTxns.push({id:nid(),co:c.id,cardId:card.id,type:'harcama',date:addDays(todayISO(),-20),amount:36000,cat:'Bakım & Onarım',desc:'Endüstriyel ekipman revizyonu (6 taksit)',taksit:6});
    S.txns.push({id:nid(),co:c.id,type:'gider',date:addDays(todayISO(),-20),amount:36000,cat:'Bakım & Onarım',accId:'',desc:'Endüstriyel ekipman revizyonu (6 taksit, kredi kartı)',src:'card'});
   }
   var mus=S.cari.find(function(x){return x.co===c.id&&(x.type==='musteri'||x.type==='her2');});
   if(mus){
    S.cariTxns.push({id:nid(),co:c.id,cariId:mus.id,type:'borc',date:addDays(todayISO(),-55),vade:addDays(todayISO(),-25),amount:18500,desc:'Fatura #A-'+c.id.toUpperCase()+'103 (vadesi geçti)'});
    S.cariTxns.push({id:nid(),co:c.id,cariId:mus.id,type:'borc',date:addDays(todayISO(),-95),vade:addDays(todayISO(),-65),amount:9750,desc:'Fatura #A-'+c.id.toUpperCase()+'087 (vadesi geçti)'});
   }
  });
  var acc=S.accounts.find(function(a){return a.co==='rest'&&a.type==='banka';});
  if(acc){
   var d=addDays(todayISO(),-3);
   S.txns.push({id:nid(),co:'rest',type:'gider',date:d,amount:4850,cat:'Hammadde & Malzeme',accId:acc.id,desc:'Sebze-meyve alımı'});
   S.txns.push({id:nid(),co:'rest',type:'gider',date:d,amount:4850,cat:'Hammadde & Malzeme',accId:acc.id,desc:'Sebze-meyve alımı'});
  }
 }catch(e){}
}

window.__v4=true;

/* ================== v5 — ÜST ÇUBUK ŞİRKET MENÜSÜ & KULLANICI PROFİLİ ================== */
function userName(){return (S.user&&S.user.name)?S.user.name:'Kullanıcı';}
function userForm(){
 var init=S.user||{};
 openForm('Kullanıcı Profili',[
  {name:'name',label:'Ad Soyad',req:1,ph:'Ör: Buse Aydın'},
  {name:'title',label:'Görev / Unvan',ph:'Ör: İşletme Sahibi, Muhasebe'}
 ],function(o){
  S.user={name:o.name,title:o.title||''};save();
  toast('Merhaba '+o.name+'! Profiliniz kaydedildi');
  if(CO)go(PAGE); else renderSelect();
 },init);
}
function coMenuHtml(){
 var h='';
 COMPANIES.forEach(function(c){
  if(!canAccessCo(c.id))return;
  var bal=0;byCo(S.accounts,c.id).forEach(function(a){bal+=accBalance(a);});
  h+='<button data-act="coJump" data-arg="'+c.id+'"><span class="cdot" style="background:'+c.color+'"></span><b>'+c.name+'</b>'+(c.id===CO?'<span class="chip p" style="margin-left:4px">Aktif</span>':'')+'<span class="bal">'+kfmt(bal)+' ₺</span></button>';
 });
 h+='<div class="sep"></div>';
 if(canAccessCo('grup')){
  h+='<button data-act="coJump" data-arg="grup"><span class="cdot" style="background:#0c6b58"></span><b>LOLE GRUP</b>'+(CO==='grup'?'<span class="chip p" style="margin-left:4px">Aktif</span>':'')+'<span class="bal">Konsolide</span></button>';
 }
 h+='<button data-act="goSelect"><span class="cdot" style="background:var(--ink3)"></span>Şirket seçim ekranı…</button>';
 h+='<div class="sep"></div>';
 h+='<button data-act="doLogout"><span class="cdot" style="background:var(--neg)"></span>Çıkış Yap'+(SESSION?' ('+esc(SESSION.username)+')':'')+'</button>';
 return '<div id="coMenu">'+h+'</div>';
}
function toggleCoMenu(){var m=document.getElementById('coMenu');if(m)m.classList.toggle('on');}
function coJump(id){
 var m=document.getElementById('coMenu');if(m)m.classList.remove('on');
 if(id===CO)return;
 if(!canAccessCo(id)){toast('Bu şirkete erişim yetkiniz yok');return;}
 var keep=PAGE;
 enterCo(id);
 if(id==='grup'){ if(keep==='set')go('set'); return; }
 if(keep&&keep!=='grup'&&keep!=='dash')go(keep);
 toast(coName(id)+' ekranındasınız');
}
document.addEventListener('click',function(e){
 var m=document.getElementById('coMenu');
 if(!m||!m.classList.contains('on'))return;
 var t=e.target;
 if(t&&t.closest&&(t.closest('#coMenu')||t.closest('[data-act="toggleCoMenu"]')))return;
 m.classList.remove('on');
});
window.__v5=true;

/* ================== v6 — EKİP MODU (Claude yayınında ortak veri) ================== */
function modeCard(){
 return '<div class="card"><h2>🌐 Veri Modu <span class="chip w">Çevrimiçi — Ortak</span></h2>'+
  '<p class="mut">Bu uygulamadaki tüm veriler (işlemler, hesaplar, kullanıcı listesi) giriş yapan yetkili kullanıcılar arasında <b>çevrimiçi ve ortak olarak</b> tutulur; hiçbir veri yalnızca bir cihazda saklanmaz. Uygulamaya her dönüşte veriler otomatik tazelenir; aynı anda iki kişi kaydederse son kaydeden geçerli olur.</p></div>';
}
function storageUsageCard(){
 var u=computeStorageEstimate();
 var lvl = u.pct>=90?'n':(u.pct>=70?'w':'p');
 var lvlTxt = u.pct>=90?'Kritik':(u.pct>=70?'Dikkat':'Normal');
 var warn = u.pct>=70 ? '<p class="tiny" style="margin-top:10px;color:'+(u.pct>=90?'var(--neg)':'var(--warn)')+'">'+(u.pct>=90?'⚠ Depolamanın dolmasına çok az kaldı — yedek saklama süresini kısaltmayı konuşalım.':'Kullanım artıyor, bir süre sonra yedek saklama süresini gözden geçirmek isteyebiliriz.')+'</p>' : '';
 return '<div class="card"><h2>📦 Bulut Depolama Kullanımı <span class="chip '+lvl+'">'+lvlTxt+' — %'+u.pct.toFixed(0)+'</span></h2>'+
  '<p class="mut" style="margin-bottom:10px">Anthropic gerçek kullanım miktarını sorgulama imkanı sunmuyor — bu, canlı veri + günlük yedeklerin boyutundan yapılan bir <b>tahmindir</b>, kesin ölçüm değildir.</p>'+
  '<table><tbody>'+
   '<tr><td>Canlı veri</td><td class="num">'+fmtBytes(u.live)+'</td></tr>'+
   '<tr><td>Günlük yedekler ('+BACKUP_KEEP_DAYS+' gün)</td><td class="num">'+fmtBytes(u.backups)+'</td></tr>'+
   '<tr><td><b>Toplam (tahmini)</b></td><td class="num"><b>'+fmtBytes(u.total)+'</b> / 20 MB</td></tr>'+
  '</tbody></table>'+warn+'</div>';
}
async function syncTeam(){
 if(!isTeam()||!window.storage)return;
 if(document.getElementById('modalWrap')&&document.getElementById('modalWrap').classList.contains('on'))return; // v34: form açıkken senkron yapma, kullanıcının elindeki işi bozma
 if(pendingSaves>0||dirty)return; // v34: kendi kayıt/gönderim işlemimiz sürerken araya girmeyelim
 try{
  var r=await withTimeout(window.storage.get(skey(),true),5000);
  if(r&&r.value){
   var j=safeParse(r.value);
   if(j&&j.meta&&j.meta.saved&&(!S.meta.saved||j.meta.saved>S.meta.saved)){
    S=fixState(j);
    if(CO)go(PAGE); else renderSelect();
    toast('🌐 Ekip verisi güncellendi');
   }
  }
 }catch(e){}
}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')syncTeam();});
setInterval(syncTeam,20000); // v34: sekme açık kalsa bile ~20 saniyede bir otomatik kontrol — diğer cihazlardaki değişiklikleri manuel yenileme olmadan yakalar
window.__v6=true;

/* ================== v7 — KULLANICI GİRİŞİ VE YETKİLENDİRME ================== */
function findUserByEmail(email){
 email=String(email||'').trim().toLowerCase();
 if(!email)return null;
 return (S.users||[]).find(function(u){return String(u.email||'').toLowerCase()===email;})||null;
}
function findUserByUsername(username){
 username=String(username||'').trim().toLowerCase();
 if(!username)return null;
 return (S.users||[]).find(function(u){return String(u.username||'').toLowerCase()===username;})||null;
}
function isSuper(){return !!(SESSION&&SESSION.role==='super');}
function logAudit(action,detail){ // v13: kritik olay kaydı — bellekte değil, S içinde (buluta kaydedilir, herkes görür/erişir değil, yalnızca süper yönetici görüntüler)
 try{
  S.auditLog=S.auditLog||[];
  S.auditLog.unshift({ts:new Date().toISOString(), user:(SESSION?SESSION.username:'—'), action:action, detail:detail||''});
  if(S.auditLog.length>200) S.auditLog.length=200; // depoyu şişirmesin, yalnızca son 200 olay
 }catch(e){}
}
function canAccessCo(id){
 if(!SESSION)return false;
 if(SESSION.role==='super')return true;
 var comps=SESSION.companies;
 var allIds=COMPANIES.map(function(c){return c.id;});
 var hasAll = comps==='all' || (Array.isArray(comps)&&allIds.every(function(x){return comps.indexOf(x)!==-1;}));
 if(id==='grup')return hasAll;
 if(hasAll)return true;
 return Array.isArray(comps)&&comps.indexOf(id)!==-1;
}
function renderLogin(){
 document.getElementById('app').classList.remove('on');
 document.getElementById('selectScreen').style.display='none';
 document.getElementById('loginScreen').style.display='flex';
 var err=document.getElementById('loginErr'); if(err)err.style.display='none';
 var el=document.getElementById('loginUser');
 if(el)setTimeout(function(){try{el.focus();}catch(e){}},60);
}
async function sha256Hex(str){
 try{
  var enc=new TextEncoder().encode(String(str));
  var buf=await crypto.subtle.digest('SHA-256',enc);
  return Array.prototype.map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,'0');}).join('');
 }catch(e){return null;}
}
function looksHashed(v){return typeof v==='string'&&/^[0-9a-f]{64}$/i.test(v);}
function checkPw(storedVal,enteredPw,enteredHash){
 if(!storedVal)return false;
 if(looksHashed(storedVal))return enteredHash===storedVal;
 return enteredPw===storedVal; // eski düz metin biçimi (geriye dönük uyum)
}
async function rememberLogin(u){ // "Beni Hatırla": ŞİFREYİ DEĞİL, rastgele bir jetonu buluttaki kişisel depoya yazar
 try{
  if(!window.storage)return;
  var tb=new Uint8Array(16); crypto.getRandomValues(tb);
  var token=Array.prototype.map.call(tb,function(b){return b.toString(16).padStart(2,'0');}).join('');
  var hash=await sha256Hex(token);
  if(!hash)return;
  u.rememberHash=hash; save();
  await withTimeout(window.storage.set('remember',JSON.stringify({username:u.username,token:token}),false),5000); // shared:false → yalnızca bu Claude hesabına özel, cihaza değil
 }catch(e){}
}
async function forgetRemembered(clearUserSide){
 try{
  if(clearUserSide&&SESSION){
   var u=(S.users||[]).find(function(x){return x.id===SESSION.id;});
   if(u&&u.rememberHash){u.rememberHash=null;save();}
  }
  if(window.storage) await withTimeout(window.storage.delete('remember',false),5000);
 }catch(e){}
}
async function tryAutoLogin(){ // sayfa her açıldığında: geçerli bir "hatırlama" jetonu varsa giriş ekranını atla
 try{
  if(!window.storage)return false;
  var r=await withTimeout(window.storage.get('remember',false),5000);
  if(!r||!r.value)return false;
  var data=null; try{data=JSON.parse(r.value);}catch(e){}
  if(!data||!data.username||!data.token)return false;
  var u=findUserByUsername(data.username);
  if(!u||!u.rememberHash)return false;
  var hash=await sha256Hex(data.token);
  if(!hash||hash!==u.rememberHash)return false;
  SESSION={id:u.id,username:u.username,email:u.email,role:u.role,companies:u.companies};
  markActivity();
  return true;
 }catch(e){ return false; }
}
async function loginSubmit(){
 var el=document.getElementById('loginUser');
 var pwEl=document.getElementById('loginPw');
 var errEl=document.getElementById('loginErr');
 var remEl=document.getElementById('loginRemember');
 var username=(el&&el.value||'').trim();
 var pw=(pwEl&&pwEl.value||'');
 if(!username){if(errEl){errEl.textContent='Kullanıcı adınızı girin';errEl.style.display='block';}return;}
 var u=findUserByUsername(username);
 if(!u){if(errEl){errEl.textContent='Bu kullanıcı adı tanımlı değil. Erişim için yöneticinizle iletişime geçin.';errEl.style.display='block';}return;}
 var hp=await sha256Hex(pw);
 var ok=false;
 if(u.password){ // kişiye özel şifre (asıl yol)
  ok=checkPw(u.password,pw,hp);
  if(ok&&hp&&!looksHashed(u.password)){u.password=hp;save();} // eski düz metinden hash'e yükselt
 }else{ // bu kullanıcı için henüz kişisel şifre yok → eski rol bazlı ortak şifreyle dene, başarılıysa kişisel şifreye yükselt
  var legacy=S.authPw&&S.authPw[u.role];
  ok=checkPw(legacy,pw,hp);
  if(ok&&hp){u.password=hp;save();}
 }
 if(!ok){if(errEl){errEl.textContent='Şifre hatalı';errEl.style.display='block';}if(pwEl){pwEl.value='';try{pwEl.focus();}catch(e){}}return;}
 SESSION={id:u.id,username:u.username,email:u.email,role:u.role,companies:u.companies};
 markActivity();
 if(remEl&&remEl.checked){ await rememberLogin(u); } else { await forgetRemembered(false); }
 if(errEl)errEl.style.display='none';
 document.getElementById('loginScreen').style.display='none';
 document.getElementById('selectScreen').style.display='flex';
 logAudit('Giriş yapıldı','');
 toast('Hoş geldiniz — '+u.username);
 renderSelect();
}
function doLogout(){
 if(window.__loleBoot&&window.__loleBoot.signOut){ try{logAudit('Çıkış yapıldı','');}catch(e){} try{window.__loleBoot.signOut();}catch(e){} return; }
 var m=document.getElementById('coMenu');if(m)m.classList.remove('on');
 if(SESSION)logAudit('Çıkış yapıldı','');
 forgetRemembered(true); // hem kullanıcı kaydındaki hem bu Claude hesabındaki hatırlama izini temizle
 SESSION=null;CO=null;
 document.getElementById('app').classList.remove('on');
 document.getElementById('selectScreen').style.display='none';
 document.getElementById('loginScreen').style.display='flex';
 var el=document.getElementById('loginUser');
 var pw=document.getElementById('loginPw');
 if(pw)pw.value='';
 if(el){el.value='';setTimeout(function(){try{el.focus();}catch(e){}},60);}
 toast('Çıkış yapıldı');
}
function trashCard(){
 if(!isSuper())return '';
 const items=(S.trash||[]).slice(0,50);
 const rows=items.length?items.map((e,i)=>'<tr><td class="tiny">'+dTR(String(e.deletedAt).slice(0,10))+'</td><td>'+esc(e.label||e.kind)+'</td><td class="tiny">'+esc(e.deletedBy||'')+'</td><td class="rowact"><button data-act="restoreTrash" data-arg="'+i+'">↩ Geri Getir</button></td></tr>').join('')
  :'<tr><td colspan="4" class="tiny">Çöp kutusu boş.</td></tr>';
 return '<div class="card"><h2>🗑 Silinenler <span class="chip g">'+(S.trash||[]).length+'</span></h2>'+
  '<p class="mut" style="margin-bottom:10px">Silinen kayıtlar burada <b>30 gün</b> saklanır, süre dolunca kalıcı olarak temizlenir. İstediğiniz zaman geri getirebilirsiniz.</p>'+
  '<div style="overflow-x:auto"><table><thead><tr><th>Silindi</th><th>Kayıt</th><th>Kim sildi</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}
function auditLogCard(){
 if(!isSuper())return '';
 const log=(S.auditLog||[]).slice(0,25);
 const rows=log.length?log.map(e=>'<tr><td class="tiny">'+new Date(e.ts).toLocaleString('tr-TR')+'</td><td>'+esc(e.user)+'</td><td>'+esc(e.action)+'</td><td class="tiny">'+esc(e.detail||'')+'</td></tr>').join('')
  :'<tr><td colspan="4" class="tiny">Henüz kayıtlı olay yok.</td></tr>';
 return '<div class="card"><h2>📋 Olay Kaydı <span class="chip g">son '+log.length+' / '+(S.auditLog||[]).length+'</span></h2>'+
  '<p class="mut" style="margin-bottom:10px">Giriş/çıkış, kullanıcı yönetimi ve veri sıfırlama/geri yükleme gibi kritik olayların kaydı — yalnızca süper yönetici görür.</p>'+
  '<div style="overflow-x:auto"><table><thead><tr><th>Zaman</th><th>Kullanıcı</th><th>Olay</th><th>Detay</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}
function usersCard(){
 if(!isSuper())return '';
 var rows=(S.users||[]).map(function(u){
  var coLbl = u.role==='super' ? 'Tüm şirketler' : (u.companies==='all' ? 'Tüm şirketler' : ((Array.isArray(u.companies)&&u.companies.length) ? u.companies.map(coName).join(', ') : '—'));
  var me = (SESSION&&u.id===SESSION.id);
  return '<tr><td><b>'+esc(u.username||'—')+'</b>'+(u.email?'<div class="tiny">'+esc(u.email)+'</div>':'')+(me?' <span class="chip g">Siz</span>':'')+'</td>'
   +'<td>'+(u.role==='super'?'<span class="chip w">Süper Yönetici</span>':'<span class="chip g">Kullanıcı</span>')+'</td>'
   +'<td class="tiny">'+esc(coLbl)+'</td>'
   +'<td class="tiny">'+(u.addedAt?dTR(String(u.addedAt).slice(0,10)):'—')+'</td>'
   +'<td class="rowact"><button data-act="editUserAsk" data-arg="'+u.id+'">✎</button><button data-act="delUserAsk" data-arg="'+u.id+'">🗑</button></td></tr>';
 }).join('');
 return '<div class="card"><h2>👤 Kullanıcı Yönetimi <span class="chip g">'+(S.users||[]).length+' kullanıcı</span></h2>'+
  '<p class="mut" style="margin-bottom:12px">Giriş artık kullanıcı adı + şifre ile yapılır (e-posta yalnızca opsiyonel referans). Her kullanıcının kendine özel bir şifresi vardır, hiçbir yerde düz metin görünmez. Eklerken veya ✎ ile belirlersin — kişiye ayrıca sen iletmen gerekir.</p>'+
  '<div style="overflow-x:auto"><table><thead><tr><th>Kullanıcı</th><th>Rol</th><th>Şirket Erişimi</th><th>Eklendi</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
  '<button class="btn sm" style="margin-top:12px" data-act="addUserAsk">＋ Kullanıcı Ekle</button></div>';
}
function addUserAsk(){
 if(!isSuper())return;
 openForm('Yeni Kullanıcı Ekle',[
  {name:'username',label:'Kullanıcı adı',req:1,ph:'ör: erdinc'},
  {name:'password',label:'Şifre (bu kişiye özel)',req:1,ph:'En az 4 karakter'},
  {name:'email',label:'E-posta (opsiyonel, referans için)',ph:'ornek@eposta.com'},
  {name:'role',label:'Rol',type:'select',opts:[['user','Kullanıcı'],['super','Süper Yönetici']]},
  {name:'companies',label:'Şirket Erişimi (Süper Yönetici için yok sayılır)',type:'checks',opts:COMPANIES.map(function(c){return [c.id,c.name];})}
 ],async function(o){
  var username=(o.username||'').trim().toLowerCase().replace(/\s+/g,'');
  if(!/^[a-z0-9_.-]{2,20}$/.test(username)){toast('Kullanıcı adı 2-20 karakter olmalı, yalnızca harf/rakam/._- içerebilir');return;}
  if(findUserByUsername(username)){toast('Bu kullanıcı adı zaten kayıtlı');return;}
  var pw=(o.password||'').trim();
  if(pw.length<4){toast('Şifre en az 4 karakter olmalı');return;}
  var email=(o.email||'').trim().toLowerCase();
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('E-posta girdiyseniz geçerli olmalı');return;}
  var hash=await sha256Hex(pw);
  if(!hash){toast('Şifre oluşturulamadı, tekrar deneyin');return;}
  S.users.push({id:nid(),username:username,email:email,password:hash,role:o.role==='super'?'super':'user',companies:o.role==='super'?'all':(Array.isArray(o.companies)?o.companies:[]),addedAt:new Date().toISOString(),addedBy:SESSION?SESSION.username:''});
  logAudit('Kullanıcı eklendi',username+' ('+(o.role==='super'?'Süper Yönetici':'Kullanıcı')+')');
  save();toast('Kullanıcı eklendi: '+username+' — bilgileri kendisine iletmeyi unutmayın');rSet();
 },{role:'user'});
}
function editUserAsk(id){
 if(!isSuper())return;
 var u=(S.users||[]).find(function(x){return x.id===id;});
 if(!u)return;
 var initCo = u.companies==='all' ? COMPANIES.map(function(c){return c.id;}) : (Array.isArray(u.companies)?u.companies:[]);
 openForm('Kullanıcıyı Düzenle',[
  {name:'username',label:'Kullanıcı adı',req:1},
  {name:'password',label:'Yeni şifre (boş = değişmez)',ph:'En az 4 karakter'},
  {name:'email',label:'E-posta (opsiyonel)'},
  {name:'role',label:'Rol',type:'select',opts:[['user','Kullanıcı'],['super','Süper Yönetici']]},
  {name:'companies',label:'Şirket Erişimi (Süper Yönetici için yok sayılır)',type:'checks',opts:COMPANIES.map(function(c){return [c.id,c.name];})}
 ],async function(o){
  var username=(o.username||'').trim().toLowerCase().replace(/\s+/g,'');
  if(!/^[a-z0-9_.-]{2,20}$/.test(username)){toast('Kullanıcı adı 2-20 karakter olmalı, yalnızca harf/rakam/._- içerebilir');return;}
  var dup=findUserByUsername(username);
  if(dup&&dup.id!==u.id){toast('Bu kullanıcı adı başka bir kullanıcıda kayıtlı');return;}
  var email=(o.email||'').trim().toLowerCase();
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('E-posta girdiyseniz geçerli olmalı');return;}
  if(u.role==='super'&&o.role!=='super'){
   var superCount=(S.users||[]).filter(function(x){return x.role==='super';}).length;
   if(superCount<=1){toast('Son süper yönetici rolden çıkarılamaz');return;}
  }
  var newPw=(o.password||'').trim();
  if(newPw&&newPw.length<4){toast('Şifre en az 4 karakter olmalı');return;}
  var newHash=null;
  if(newPw){ newHash=await sha256Hex(newPw); if(!newHash){toast('Şifre oluşturulamadı, tekrar deneyin');return;} }
  u.username=username;u.email=email;u.role=o.role==='super'?'super':'user';
  u.companies=u.role==='super'?'all':(Array.isArray(o.companies)?o.companies:[]);
  if(newHash)u.password=newHash;
  logAudit('Kullanıcı düzenlendi',username+(newHash?' (şifre değişti)':''));
  save();toast('Kullanıcı güncellendi'+(newHash?' (şifre de değişti)':''));rSet();
  if(SESSION&&u.id===SESSION.id){SESSION.username=u.username;SESSION.email=u.email;SESSION.role=u.role;SESSION.companies=u.companies;}
 },{username:u.username,email:u.email,role:u.role,companies:initCo});
}
function delUserAsk(id){
 if(!isSuper())return;
 var u=(S.users||[]).find(function(x){return x.id===id;});
 if(!u)return;
 if(u.role==='super'){
  var superCount=(S.users||[]).filter(function(x){return x.role==='super';}).length;
  if(superCount<=1){toast('Son süper yönetici silinemez');return;}
 }
 if(SESSION&&u.id===SESSION.id){toast('Kendi hesabınızı silemezsiniz');return;}
 uiConfirm('"'+u.username+'" kullanıcısı silinsin mi? Bu kişi artık giriş yapamaz.',function(){
  S.users=(S.users||[]).filter(function(x){return x.id!==id;});
  logAudit('Kullanıcı silindi',u.username);
  save();toast('Kullanıcı silindi');rSet();
 },{danger:1,title:'Kullanıcıyı Sil',yes:'Evet, Sil'});
}
/* ---------- Supabase Auth köprüsü ----------
   Sayfa zaten Supabase Auth ile korunuyor. Buraya gelindiyse geçerli bir
   Supabase kullanıcısı var. O kullanıcıyı uygulama içi SESSION'a bağlarız;
   eşleşen uygulama profili yoksa otomatik oluştururuz. */
async function supaAutoLogin(){
 try{
  var email=String((window.__loleBoot&&window.__loleBoot.email)||'').trim().toLowerCase();
  if(!email)return false;
  var u=findUserByEmail(email);
  if(!u){
   var isAdmin=(email===String(DEFAULT_ADMIN_EMAIL).toLowerCase());
   u={id:nid(),username:email.split('@')[0],email:email,role:isAdmin?'super':'user',
      companies:isAdmin?'all':[],addedAt:new Date().toISOString(),addedBy:'supabase-auth'};
   S.users=S.users||[]; S.users.push(u); save();
  }
  SESSION={id:u.id,username:u.username,email:u.email,role:u.role,companies:u.companies};
  markActivity();
  try{logAudit('Giriş yapıldı (Supabase)','');}catch(e){}
  return true;
 }catch(e){ return false; }
}
window.__v7=true;



