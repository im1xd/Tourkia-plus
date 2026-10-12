import {sql,isAdmin} from '@/lib/db';
export const dynamic='force-dynamic';export const revalidate=0;export const fetchCache='force-no-store';
const no=()=>Response.json({error:'unauthorized'},{status:401});
const nz=v=>v===''||v==null?null:+v;
export async function GET(){return Response.json(await sql`SELECT * FROM products WHERE COALESCE(active,TRUE)=TRUE ORDER BY featured DESC,id DESC`,{headers:{'Cache-Control':'no-store'}})}
export async function POST(q){if(!isAdmin(q))return no();const b=await q.json();
await sql`INSERT INTO products(name,category,price,old_price,image,images,sizes,colors,description) VALUES(${b.name},${b.category},${+b.price},${nz(b.old_price)},${b.image},${b.images||''},${b.sizes||''},${b.colors||''},${b.description||''})`;return Response.json({ok:1})}
export async function PUT(q){if(!isAdmin(q))return no();const b=await q.json();
await sql`UPDATE products SET name=${b.name},category=${b.category},price=${+b.price},old_price=${nz(b.old_price)},image=${b.image},images=${b.images||''},sizes=${b.sizes||''},colors=${b.colors||''},description=${b.description||''} WHERE id=${+b.id}`;return Response.json({ok:1})}
export async function PATCH(q){if(!isAdmin(q))return no();const {id,field,value}=await q.json();
if(field==='in_stock')await sql`UPDATE products SET in_stock=${!!value} WHERE id=${+id}`;else if(field==='featured')await sql`UPDATE products SET featured=${!!value} WHERE id=${+id}`;else return Response.json({error:'bad'},{status:400});return Response.json({ok:1})}
export async function DELETE(q){if(!isAdmin(q))return no();const {id}=await q.json();
const r=await sql`UPDATE products SET active=FALSE WHERE id=${+id} RETURNING id`;return Response.json({ok:r.length})}
