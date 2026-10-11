import {v2 as c} from 'cloudinary';import {isAdmin} from '@/lib/db';
export const dynamic='force-dynamic';
export async function POST(q){if(!isAdmin(q))return Response.json({error:'unauthorized'},{status:401});
const f=(await q.formData()).get('file');const buf=Buffer.from(await f.arrayBuffer());
const r=await new Promise((ok,no)=>c.uploader.upload_stream({folder:'tourkia',transformation:[{width:1200,crop:'limit',quality:'auto',fetch_format:'auto'}]},(e,x)=>e?no(e):ok(x)).end(buf));
return Response.json({url:r.secure_url})}
