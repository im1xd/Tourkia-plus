'use client';
import {useState,useMemo} from 'react';
const fx=(u,w)=>u?u.replace('/upload/',`/upload/f_auto,q_auto,w_${w}/`):'';
export default function Shop({products,fee}){
const cats=useMemo(()=>['الكل',...new Set(products.map(p=>p.category))],[products]);
const [cat,setCat]=useState('الكل'),[sel,setSel]=useState(null),[done,setDone]=useState(null),[err,setErr]=useState('');
const list=products.filter(p=>cat==='الكل'||p.category===cat);
async function send(e){e.preventDefault();setErr('');const f=Object.fromEntries(new FormData(e.target));
const r=await fetch('/api/orders',{method:'POST',body:JSON.stringify({...f,product_id:sel.id})});const j=await r.json();
r.ok?(setDone(j.total),setSel(null)):setErr(j.error||'حدث خطأ')}
return <>
<div className="tabs">{cats.map(c=><button key={c} className={'tab'+(c===cat?' on':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
<div className="grid">{list.map((p,i)=><div key={p.id} className="card" style={{animationDelay:i*60+'ms'}} onClick={()=>{setSel(p);setDone(null)}}>
<div className="im"><img src={fx(p.image,500)} alt={p.name} loading="lazy"/></div><div className="t"><div>{p.name}</div><b>{p.price} د.ج</b></div></div>)}
{!list.length&&<p>قريباً… منتجات جديدة تصل قريباً 💖</p>}</div>
{sel&&<div className="modal" onClick={()=>setSel(null)}><form className="sheet" onClick={e=>e.stopPropagation()} onSubmit={send}>
<img src={fx(sel.image,800)} alt={sel.name}/><h3>{sel.name}</h3><p><b>{sel.price} د.ج</b> + توصيل {fee} د.ج · الدفع عند الاستلام</p>
{sel.sizes&&<select name="size" required><option value="">المقاس</option>{sel.sizes.split(',').map(s=><option key={s}>{s.trim()}</option>)}</select>}
{sel.colors&&<select name="color" required><option value="">اللون</option>{sel.colors.split(',').map(s=><option key={s}>{s.trim()}</option>)}</select>}
<input name="name" placeholder="الاسم الكامل" required/><input name="phone" placeholder="رقم الهاتف 07XXXXXXXX" inputMode="tel" required/>
<input name="wilaya" placeholder="الولاية" required/><input name="address" placeholder="العنوان (البلدية / الحي)"/>
{err&&<p style={{color:'red'}}>{err}</p>}<button className="btn" style={{width:'100%',marginTop:8}}>تأكيد الطلب</button></form></div>}
{done&&<div className="modal" onClick={()=>setDone(null)}><div className="sheet ok"><i>🎀</i><h3>تم استلام طلبك!</h3><p>المجموع {done} د.ج. سنتصل بك لتأكيد الطلب.</p></div></div>}
</>}
