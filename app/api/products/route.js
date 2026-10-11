import {sql,isAdmin} from '@/lib/db';
export const dynamic='force-dynamic';
export async function GET(){const r=await sql`SELECT * FROM products WHERE COALESCE(active,TRUE)=TRUE ORDER BY id DESC`;return Response.json(r)}
export async function POST(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
const b=await q.json();await sql`INSERT INTO products(name,category,price,image,sizes,colors) VALUES(${b.name},${b.category},${+b.price},${b.image},${b.sizes||''},${b.colors||''})`;return Response.json({ok:1})}
export async function DELETE(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
const {id}=await q.json();await sql`UPDATE products SET active=FALSE WHERE id=${id}`;return Response.json({ok:1})}
