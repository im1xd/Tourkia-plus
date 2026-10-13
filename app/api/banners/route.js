import {sql,isAdmin} from '@/lib/db';
export const dynamic='force-dynamic';export const revalidate=0;export const fetchCache='force-no-store';
const no=()=>Response.json({error:'unauthorized'},{status:401});
export async function GET(){return Response.json(await sql`SELECT * FROM banners ORDER BY id DESC`)}
export async function POST(q){if(!isAdmin(q))return no();const b=await q.json();await sql`INSERT INTO banners(image,title) VALUES(${b.image},${b.title||''})`;return Response.json({ok:1})}
export async function DELETE(q){if(!isAdmin(q))return no();const {id}=await q.json();const r=await sql`DELETE FROM banners WHERE id=${+id} RETURNING id`;return Response.json({ok:r.length})}
