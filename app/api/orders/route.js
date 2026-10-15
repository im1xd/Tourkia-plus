import {sql,isAdmin} from '@/lib/db';import {notifyAll,esc} from '@/lib/telegram';
export const dynamic='force-dynamic';export const revalidate=0;export const fetchCache='force-no-store';
export async function POST(q){const b=await q.json();
if(!b.name||!/^0[5-7]\d{8}$/.test(b.phone||'')||!b.wilaya)return Response.json({error:'بيانات ناقصة أو رقم هاتف غير صحيح'},{status:400});
const p=(await sql`SELECT id,name,price,in_stock FROM products WHERE id=${+b.product_id} AND COALESCE(active,TRUE)=TRUE`)[0];if(!p)return Response.json({error:'منتج غير موجود'},{status:404});if(!p.in_stock)return Response.json({error:'هذا المنتج نفد من المخزون'},{status:409});
const qty=Math.min(10,Math.max(1,+b.qty||1)),total=p.price*qty+(+process.env.DELIVERY_FEE||0);
const o=await sql`INSERT INTO orders(product_id,product_name,name,phone,wilaya,address,size,color,total,qty) VALUES(${p.id},${p.name},${b.name},${b.phone},${b.wilaya},${b.address||''},${b.size||''},${b.color||''},${total},${qty}) RETURNING id`;
await notifyAll(`<b>طلب جديد #${o[0].id}</b>\nالمنتج: ${esc(p.name)} × ${qty}\nالمقاس: ${esc(b.size||'-')} | اللون: ${esc(b.color||'-')}\nالمجموع: ${total} د.ج\n\nالاسم: ${esc(b.name)}\nالهاتف: ${esc(b.phone)}\nالولاية: ${esc(b.wilaya)}\nالعنوان: ${esc(b.address||'-')}\n\nلوحة الإدارة: https://tourkia-plus.vercel.app/admin`);
return Response.json({ok:1,total})}
export async function GET(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
return Response.json(await sql`SELECT * FROM orders ORDER BY id DESC LIMIT 300`)}
export async function PATCH(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
const {id,status}=await q.json();if(!['new','confirmed','shipped','delivered','cancelled'].includes(status))return Response.json({error:'bad'},{status:400});
await sql`UPDATE orders SET status=${status} WHERE id=${+id}`;return Response.json({ok:1})}
