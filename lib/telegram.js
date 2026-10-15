import {sql} from '@/lib/db';
export const esc=s=>String(s==null?'':s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
export const tg=(method,body)=>fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'});
export async function notifyAll(text){
if(!process.env.TELEGRAM_BOT_TOKEN)return 0;
try{const cs=await sql`SELECT chat_id FROM tg_chats`;
await Promise.race([Promise.all(cs.map(c=>tg('sendMessage',{chat_id:c.chat_id,text,parse_mode:'HTML',disable_web_page_preview:true}).catch(()=>0))),new Promise(r=>setTimeout(r,4000))]);
return cs.length}catch(e){return 0}}
