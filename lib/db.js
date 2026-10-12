import {neon} from '@neondatabase/serverless';
export const sql=neon(process.env.DATABASE_URL,{fetchOptions:{cache:'no-store'}});
export const isAdmin=r=>!!process.env.ADMIN_PASSWORD&&r.headers.get('x-admin')===process.env.ADMIN_PASSWORD;
