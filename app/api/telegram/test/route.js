import {isAdmin} from '@/lib/db';import {notifyAll} from '@/lib/telegram';
export const dynamic='force-dynamic';
export async function POST(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
const n=await notifyAll('<b>إشعار تجريبي</b>\nإشعارات الطلبات تعمل بنجاح.');return Response.json({n})}
