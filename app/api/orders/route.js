import {sql,isAdmin} from '@/lib/db';
export const dynamic='force-dynamic';
export async function POST(q){const b=await q.json();
if(!b.name||!/^0[5-7]\d{8}$/.test(b.phone||'')||!b.wilaya)return Response.json({error:'بيانات ناقصة أو رقم هاتف غير صحيح'},{status:400});
const p=(await sql`SELECT id,name,price FROM products WHERE id=${+b.product_id}`)[0];if(!p)return Response.json({error:'منتج غير موجود'},{status:404});
const total=p.price+(+process.env.DELIVERY_FEE||0);
await sql`INSERT INTO orders(product_id,product_name,name,phone,wilaya,address,size,color,total) VALUES(${p.id},${p.name},${b.name},${b.phone},${b.wilaya},${b.address||''},${b.size||''},${b.color||''},${total})`;
return Response.json({ok:1,total})}
export async function GET(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
return Response.json(await sql`SELECT * FROM orders ORDER BY id DESC LIMIT 200`)}
