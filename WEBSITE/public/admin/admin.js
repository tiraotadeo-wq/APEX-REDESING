import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';
const cfg = window.X7_SUPABASE_CONFIG || {};
const $ = (id) => document.getElementById(id);
const login = $('login'), dashboard = $('dashboard'), recovery = $('password-recovery');
let supabase;
if (cfg.url && cfg.anonKey && !cfg.anonKey.startsWith('REPLACE_')) {
  supabase = createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
} else {
  $('login-error').textContent = 'Falta configurar la URL y la clave pública de Supabase en public/config.js.';
  $('login-form').querySelector('button').disabled = true;
}
const setStatus = (s) => $('status').textContent = s;
function showSignedIn(signed) { login.hidden = signed; recovery.hidden = true; dashboard.hidden = !signed; setStatus(signed ? 'Sesión activa' : 'Desconectado'); }
function showRecovery() { login.hidden = true; dashboard.hidden = true; recovery.hidden = false; setStatus('Configurar contraseña'); }
async function requireAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('La sesión ha expirado. Inicia sesión de nuevo.');
  const { data, error: adminError } = await supabase.from('x7_admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (adminError || !data) { await supabase.auth.signOut(); showSignedIn(false); throw new Error('Esta cuenta no está autorizada como administradora.'); }
  return user;
}
$('login-form').addEventListener('submit', async (e) => { e.preventDefault(); $('login-error').textContent=''; const b=e.submitter; b.disabled=true; try { const {error}=await supabase.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value}); if(error) throw error; await requireAdmin(); showSignedIn(true); await loadConfig(); } catch(err) { $('login-error').textContent=err.message || 'No se pudo iniciar sesión.'; } finally { b.disabled=false; } });
$('forgot-password').addEventListener('click', async () => {
  $('reset-message').textContent='';
  const email=$('email').value.trim();
  if(!email){$('reset-message').textContent='Escribe tu correo arriba y vuelve a intentarlo.';$('email').focus();return;}
  const b=$('forgot-password');b.disabled=true;
  try{
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/admin/'});
    if(error)throw error;
    $('reset-message').textContent='Si el correo existe, recibirás un enlace para configurar una contraseña. Revisa también spam.';
  }catch(err){$('reset-message').textContent=err.message||'No se pudo enviar el correo de recuperación.';}
  finally{b.disabled=false;}
});
$('password-form').addEventListener('submit', async(e)=>{
  e.preventDefault();$('password-message').textContent='';
  const password=$('new-password').value, confirm=$('confirm-password').value;
  if(password.length<12){$('password-message').textContent='Usa una contraseña de al menos 12 caracteres.';return;}
  if(password!==confirm){$('password-message').textContent='Las contraseñas no coinciden.';return;}
  const b=e.submitter;b.disabled=true;
  try{
    const {data,error}=await supabase.auth.updateUser({password});
    if(error)throw error;
    if(!data.user)throw new Error('No se pudo verificar la cuenta. Abre el enlace de Supabase otra vez.');
    $('password-message').textContent='Contraseña guardada. Verificando permisos administrativos…';
    await requireAdmin();showSignedIn(true);await loadConfig();
  }catch(err){$('password-message').textContent=err.message||'No se pudo actualizar la contraseña.';}
  finally{b.disabled=false;}
});
$('back-to-login').addEventListener('click',async()=>{if(supabase)await supabase.auth.signOut();recovery.hidden=true;showSignedIn(false);});
$('logout').addEventListener('click', async()=>{await supabase.auth.signOut();showSignedIn(false)});
supabase?.auth.onAuthStateChange((event, session)=>{
  const inviteOrRecovery=/type=(invite|recovery)/i.test(window.location.hash);
  if(session&&(event==='PASSWORD_RECOVERY'||inviteOrRecovery)){showRecovery();return;}
  if(!session)showSignedIn(false);
});
const fields=['ipa_url','video_url','resources_url','brand_name','branding_url'];
async function loadConfig(){try{await requireAdmin();const {data,error}=await supabase.from('x7_app_config').select('payload,updated_at').eq('id',1).single();if(error)throw error;const p=data?.payload||{};for(const k of fields)$(k).value=p[k]||'';$('extra_json').value=JSON.stringify(p.extra||{},null,2);$('config-message').textContent=data?.updated_at?'Última actualización: '+new Date(data.updated_at).toLocaleString():'Configuración cargada.';}catch(e){$('config-message').textContent=e.message;}}
$('config-form').addEventListener('submit',async(e)=>{e.preventDefault();const b=e.submitter;b.disabled=true;$('config-message').textContent='Guardando…';try{await requireAdmin();let extra;try{extra=JSON.parse($('extra_json').value||'{}')}catch{throw new Error('El campo JSON adicional no contiene JSON válido.')}if(!extra||Array.isArray(extra)||typeof extra!=='object')throw new Error('El JSON adicional debe ser un objeto.');const payload={};for(const k of fields){const v=$(k).value.trim();if(v)payload[k]=v;}payload.extra=extra;const {error}=await supabase.from('x7_app_config').upsert({id:1,payload,updated_at:new Date().toISOString()});if(error)throw error;$('config-message').textContent='Configuración guardada correctamente. La app debe volver a consultar el endpoint remoto para recibirla.';}catch(err){$('config-message').textContent=err.message||'Error al guardar.';}finally{b.disabled=false;}});
$('refresh-stats').addEventListener('click',loadStats);
async function loadStats(){const body=$('stats-rows');body.innerHTML='<tr><td colspan="2">Cargando…</td></tr>';try{await requireAdmin();const {data,error}=await supabase.from('x7_request_stats').select('stat_date,request_count').order('stat_date',{ascending:false}).limit(30);if(error)throw error;const rows=data||[];body.replaceChildren();let total=0;for(const row of rows){total+=Number(row.request_count||0);const tr=document.createElement('tr'),d=document.createElement('td'),n=document.createElement('td');d.textContent=row.stat_date;n.textContent=Number(row.request_count||0).toLocaleString();tr.append(d,n);body.append(tr);}if(!rows.length)body.innerHTML='<tr><td colspan="2">Todavía no hay métricas registradas.</td></tr>'; $('stats-summary').innerHTML='';for(const [label,value] of [['Días registrados',rows.length],['Peticiones registradas',total]]){const card=document.createElement('div');card.className='stat';const strong=document.createElement('strong');strong.textContent=Number(value).toLocaleString();card.append(strong,document.createTextNode(label));$('stats-summary').append(card);} $('stats-message').textContent='Mostrando hasta 30 días. Solo se muestran datos existentes; no se generan métricas ficticias.';}catch(e){body.innerHTML='<tr><td colspan="2">No se pudieron cargar las estadísticas.</td></tr>';$('stats-message').textContent=e.message||'Error de lectura.';}}
document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));$('config-panel').hidden=btn.dataset.tab!=='config';$('stats-panel').hidden=btn.dataset.tab!=='stats';if(btn.dataset.tab==='stats')loadStats();}));
if(supabase){supabase.auth.getSession().then(async({data})=>{if(data.session&&/type=(invite|recovery)/i.test(window.location.hash)){showRecovery();return;}if(data.session){try{await requireAdmin();showSignedIn(true);await loadConfig()}catch{showSignedIn(false)}}});}
