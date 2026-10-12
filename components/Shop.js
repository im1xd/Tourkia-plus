'use client';
import {useState,useMemo,useEffect} from 'react';
import {W} from '@/lib/wilayas';
const fx=(u,w)=>u?u.replace('/upload/',`/upload/f_auto,q_auto,w_${w}/`):'';
const L=s=>s?s.split(',').map(x=>x.trim()).filter(Boolean):[];
export default function Shop({products,fee}){
const cats=useMemo(()=>['الكل',...new Set(products.map(p=>p.category))],[products]);
const fresh=useMemo(()=>new Set(products.slice(0,4).map(p=>p.id)),[products]);
const [cat,setCat]=useState('الكل'),[sort,setSort]=useState('n'),[q,setQ]=useState(''),[sel,setSel]=useState(null),[sz,setSz]=useState(''),[cl,setCl]=useState(''),[qty,setQty]=useState(1),[wl,setWl]=useState(''),[done,setDone]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
useEffect(()=>{const h=e=>{const t=e.target.closest('[data-cat]');if(t)setCat(t.dataset.cat)};document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[]);
let list=products.filter(p=>(cat==='الكل'||p.category===cat)&&(!q||p.name.includes(q)));
if(sort==='a')list=[...list].sort((a,b)=>a.price-b.price);if(sort==='d')list=[...list].sort((a,b)=>b.price-a.price);
const open=p=>{setSel(p);setSz('');setCl('');setQty(1);setErr('');setDone(null)};
async function send(e){e.preventDefault();setErr('');const f=Object.fromEntries(new FormData(e.target));
if(L(sel.sizes).length&&!sz)return setErr('اختاري المقاس');if(L(sel.colors).length&&!cl)return setErr('اختاري اللون');if(!wl)return setErr('اختاري الولاية');
setBusy(true);const r=await fetch('/api/orders',{method:'POST',body:JSON.stringify({...f,wilaya:wl,size:sz,color:cl,qty,product_id:sel.id})});const j=await r.json();setBusy(false);
r.ok?(setDone(j.total),setSel(null)):setErr(j.error||'حدث خطأ')}
return <>
<div className="bar"><div className="tabs">{cats.map(c=><button key={c} className={'tab'+(c===cat?' on':'')} onClick={()=>setCat(c)}>{c}</button>)}</div>
<div className="tools"><input placeholder="ابحثي عن منتج…" value={q} onChange={e=>setQ(e.target.value)}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="n">الأحدث</option><option value="a">الأرخص</option><option value="d">الأغلى</option></select></div></div>
<div className="grid">{list.map((p,i)=><div key={p.id} className="card" style={{animationDelay:Math.min(i,8)*70+'ms'}} onClick={()=>open(p)}>
<div className="im">{fresh.has(p.id)&&<span className="nw">جديد</span>}<img src={fx(p.image,500)} alt={p.name} loading="lazy"/></div>
<div className="t"><small>{p.category}</small><div className="nm">{p.name}</div><div className="pc"><b>{p.price} د.ج</b><span>اطلبي ←</span></div></div></div>)}
{!list.length&&<p className="empty">لا توجد منتجات هنا حالياً، تابعينا فمنتجات جديدة تصل قريباً.</p>}</div>
{sel&&<div className="modal" onClick={()=>setSel(null)}><form className="sheet" onClick={e=>e.stopPropagation()} onSubmit={send}>
<button type="button" className="x" onClick={()=>setSel(null)}>✕</button>
<img src={fx(sel.image,800)} alt={sel.name}/><h3>{sel.name}</h3><p className="pp">{sel.price} د.ج</p>
{L(sel.sizes).length>0&&<><p className="lb">المقاس</p><div className="cw">{L(sel.sizes).map(s=><button type="button" key={s} className={'chp'+(sz===s?' on':'')} onClick={()=>setSz(s)}>{s}</button>)}</div></>}
{L(sel.colors).length>0&&<><p className="lb">اللون</p><div className="cw">{L(sel.colors).map(s=><button type="button" key={s} className={'chp'+(cl===s?' on':'')} onClick={()=>setCl(s)}>{s}</button>)}</div></>}
<p className="lb">الكمية</p><div className="cw"><button type="button" className="chp" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><b style={{minWidth:30,textAlign:'center'}}>{qty}</b><button type="button" className="chp" onClick={()=>setQty(Math.min(10,qty+1))}>+</button></div>
<p className="lb">بيانات التوصيل</p><input name="name" placeholder="الاسم الكامل" required/><input name="phone" placeholder="رقم الهاتف 07XXXXXXXX" inputMode="tel" required/>
<select value={wl} onChange={e=>setWl(e.target.value.split(' - ')[1])} required><option value="">اختاري الولاية</option>{W.map(w=><option key={w}>{w}</option>)}</select><input name="address" placeholder="البلدية / الحي (اختياري)"/>
<div className="sum"><span>المنتج × {qty}</span><span>{sel.price*qty} د.ج</span><span>التوصيل</span><span>{fee} د.ج</span><b>المجموع</b><b>{sel.price*qty+fee} د.ج</b></div>
{err&&<p className="er">{err}</p>}<button className="btn" disabled={busy} style={{width:'100%'}}>{busy?'جارٍ الإرسال…':'تأكيد الطلب · الدفع عند الاستلام'}</button></form></div>}
{done&&<div className="modal" onClick={()=>setDone(null)}><div className="sheet ok"><svg viewBox="0 0 52 52" width="84"><circle cx="26" cy="26" r="24" fill="none" stroke="#d4202b" strokeWidth="3" className="dr"/><path d="M14 27l8 8 16-17" fill="none" stroke="#d4202b" strokeWidth="4" strokeLinecap="round" className="dr2"/></svg><h3>تم استلام طلبك!</h3><p>المجموع {done} د.ج. سنتصل بك قريباً لتأكيد الطلب.</p><button className="btn" onClick={()=>setDone(null)}>متابعة التسوق</button></div></div>}
</>}
