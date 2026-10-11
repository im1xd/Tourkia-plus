'use client';
import {useState} from 'react';
export default function Admin(){
const [pw,setPw]=useState(''),[ok,setOk]=useState(false),[orders,setO]=useState([]),[msg,setMsg]=useState('');
const H={'x-admin':pw};
async function login(){const r=await fetch('/api/orders',{headers:H});if(r.ok){setO(await r.json());setOk(true)}else setMsg('كلمة السر خاطئة')}
async function add(e){e.preventDefault();setMsg('جارٍ الرفع…');const f=new FormData(e.target);const x=new FormData();x.append('file',f.get('file'));
const u=await(await fetch('/api/upload',{method:'POST',headers:H,body:x})).json();
const r=await fetch('/api/products',{method:'POST',headers:H,body:JSON.stringify({name:f.get('name'),category:f.get('category'),price:f.get('price'),sizes:f.get('sizes'),colors:f.get('colors'),image:u.url})});
setMsg(r.ok?'تمت الإضافة ✓':'فشل');if(r.ok)e.target.reset()}
if(!ok)return <div className="adm"><section><input type="password" placeholder="كلمة سر الإدارة" onChange={e=>setPw(e.target.value)}/><button className="btn" onClick={login}>دخول</button><p>{msg}</p></section></div>;
return <div className="adm"><section><h3>إضافة منتج</h3><form onSubmit={add}><input name="name" placeholder="الاسم" required/><input name="category" placeholder="الفئة (أحذية / حقائب …)" required/><input name="price" type="number" placeholder="السعر" required/><input name="sizes" placeholder="المقاسات: 36,37,38"/><input name="colors" placeholder="الألوان: أسود,بيج"/><input name="file" type="file" accept="image/*" required/><button className="btn">نشر</button></form><p>{msg}</p></section>
<section><h3>الطلبات ({orders.length})</h3><table width="100%"><tbody>{orders.map(o=><tr key={o.id}><td>{o.product_name}<br/>{o.size} {o.color}</td><td>{o.name}<br/>{o.phone}</td><td>{o.wilaya}<br/>{o.total} د.ج</td></tr>)}</tbody></table></section></div>}
