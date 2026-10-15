import {sql} from '@/lib/db';import {tg,esc} from '@/lib/telegram';
export const dynamic='force-dynamic';export const revalidate=0;export const fetchCache='force-no-store';
export async function POST(q){
if(!process.env.TELEGRAM_WEBHOOK_SECRET||q.headers.get('x-telegram-bot-api-secret-token')!==process.env.TELEGRAM_WEBHOOK_SECRET)return Response.json({error:'forbidden'},{status:403});
const u=await q.json(),m=u.message;if(!m||!m.text)return Response.json({ok:1});
const id=m.chat.id,t=m.text.trim(),name=[m.from&&m.from.first_name,m.from&&m.from.last_name].filter(Boolean).join(' ');
const say=x=>tg('sendMessage',{chat_id:id,text:x,parse_mode:'HTML'});
if(t==='/stop'){await sql`DELETE FROM tg_chats WHERE chat_id=${id}`;await say('تم إيقاف إشعارات الطلبات.')}
else if(t.startsWith('/start')){const pw=t.slice(6).trim();
if(pw&&process.env.ADMIN_PASSWORD&&pw===process.env.ADMIN_PASSWORD){await sql`INSERT INTO tg_chats(chat_id,name) VALUES(${id},${name}) ON CONFLICT (chat_id) DO UPDATE SET name=EXCLUDED.name`;await say('تم تفعيل إشعارات الطلبات لهذه المحادثة.\nللإيقاف أرسلي /stop')}
else await say('مرحباً بك في بوت تركية بلس.\nلتفعيل إشعارات الطلبات أرسلي:\n<code>/start كلمة_سر_الإدارة</code>')}
return Response.json({ok:1})}
