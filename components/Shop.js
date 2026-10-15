'use client';
import {useState,useMemo,useEffect} from 'react';
import {W} from '@/lib/wilayas';import {Ic} from '@/components/Icons';
const fx=(u,w)=>u?u.replace('/upload/',`/upload/f_auto,q_auto,w_${w}/`):'';
const L=s=>s?s.split(',').map(x=>x.trim()).filter(Boolean):[];
const CH={'أسود':'#111','أبيض':'#fff','بيج':'#d9c3a0','بني':'#6b4226','أحمر':'#d92b2b','وردي':'#f48fb1','أزرق':'#2a5bd7','كحلي':'#1b2a52','أخضر':'#2e8b57','ذهبي':'#d4af37','فضي':'#c0c0c0','رمادي':'#888'};
const SG=[[35,22.1],[36,22.8],[37,23.5],[38,24.1],[39,24.8],[40,25.4],[41,26.1],[42,26.7],[43,27.5],[44,28.1],[45,28.8]];
const WA='213781553910';
export default function Shop({products,fee}){
const cats=useMemo(()=>[...new Set(products.map(p=>p.category))],[products]);
const fresh=useMemo(()=>new Set([...products].sort((a,b)=>b.id-a.id).slice(0,4).map(p=>p.id)),[products]);
const [cat,setCat]=useState('الكل'),[sort,setSort]=useState('n'),[q,setQ]=useState(''),[sel,setSel]=useState(null),[gi,setGi]=useState(0),[sz,setSz]=useState(''),[cl,setCl]=useState(''),[qty,setQty]=useState(1),[wl,setWl]=useState(''),[done,setDone]=useState(null),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[fav,setFav]=useState([]),[sg,setSg]=useState(false);
useEffect(()=>{try{setFav(JSON.parse(localStorage.getItem('tk_fav')||'[]'))}catch(e){}},[]);
const tf=id=>setFav(f=>{const n=f.includes(id)?f.filter(x=>x!==id):[...f,id];try{localStorage.setItem('tk_fav',JSON.stringify(n))}catch(e){}return n});
useEffect(()=>{const k=e=>{if(e.key==='Escape'){setSel(null);setDone(null)}};document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k)},[]);
useEffect(()=>{const h=e=>{const t=e.target.closest('[data-cat]');if(t)setCat(t.dataset.cat)};document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[]);
const disc=products.some(p=>p.old_price>p.price&&p.in_stock);
const tabs=[['الكل','الكل'],...(disc?[['تخفيضات','تخفيضات']]:[]),...(fav.length?[['المفضلة','المفضلة ('+fav.length+')']]:[]),...cats.map(c=>[c,c])];
let list=products.filter(p=>(cat==='الكل'||(cat==='تخفيضات'?p.old_price>p.price:cat==='المفضلة'?fav.includes(p.id):p.category===cat))&&(!q||p.name.includes(q)));
if(sort==='a')list=[...list].sort((a,b)=>a.price-b.price);if(sort==='d')list=[...list].sort((a,b)=>b.price-a.price);
const open=p=>{setGi(0);setSel(p);setSz('');setCl('');setQty(1);setErr('');setDone(null);setSg(false)};
async function send(e){e.preventDefault();setErr('');const f=Object.fromEntries(new FormData(e.target));
if(L(sel.sizes).length&&!sz)return setErr('اختاري المقاس');if(L(sel.colors).length&&!cl)return setErr('اختاري اللون');if(!wl)return setErr('اختاري الولاية');
setBusy(true);const r=await fetch('/api/orders',{method:'POST',body:JSON.stringify({...f,wilaya:wl,size:sz,color:cl,qty,product_id:sel.id})});const j=await r.json();setBusy(false);
r.ok?(setDone(j.total),setSel(null)):setErr(j.error||'حدث خطأ')}
const gal=sel?[sel.image,...L(sel.images)].filter(Boolean):[];
const shoes=sel&&/أحذية|كعب/.test(sel.category);
const waO=sel?`https://wa.me/${WA}?text=`+encodeURIComponent(`مرحباً، أريد طلب:\n${sel.name}\nالمقاس: ${sz||'-'}\nاللون: ${cl||'-'}\nالكمية: ${qty}\nالسعر: ${sel.price*qty} د.ج`):'';
const waS=sel?'https://wa.me/?text='+encodeURIComponent(`${sel.name} - ${sel.price} د.ج\n`+(typeof location!=='undefined'?location.origin:'')):'';
return <>
<div className="bar"><div className="tabs">{tabs.map(([v,l])=><button key={v} aria-pressed={v===cat} className={'tab'+(v===cat?' on':'')} onClick={()=>setCat(v)}>{l}</button>)}</div>
<div className="tools"><input aria-label="بحث" placeholder="ابحثي عن منتج…" value={q} onChange={e=>setQ(e.target.value)}/><select aria-label="الترتيب" value={sort} onChange={e=>setSort(e.target.value)}><option value="n">الأحدث</option><option value="a">الأرخص</option><option value="d">الأغلى</option></select></div></div>
<div className="grid">{list.map((p,i)=><div key={p.id} className="cell"><div role="button" tabIndex={0} aria-label={p.name+'، '+p.price+' دينار'} onKeyDown={e=>e.key==='Enter'&&open(p)} className={'card'+(p.in_stock?'':' soldout')} style={{animationDelay:Math.min(i,8)*70+'ms'}} onClick={()=>open(p)}>
<div className="im">{!p.in_stock?<span className="nw so">نفد</span>:p.old_price>p.price?<span className="nw">-{Math.round((1-p.price/p.old_price)*100)}%</span>:p.featured?<span className="nw gd">مميز</span>:fresh.has(p.id)&&<span className="nw">جديد</span>}<img src={fx(p.image,500)} alt={p.name} loading="lazy"/></div>
<div className="t"><small>{p.category}</small><div className="nm">{p.name}</div>{L(p.colors).length>0&&<div className="dots">{L(p.colors).slice(0,6).map(c=><i key={c} title={c} style={{background:CH[c]||'#ccc'}}/>)}</div>}<div className="pc"><b>{p.price} د.ج{p.old_price>p.price&&<s>{p.old_price}</s>}</b><span>اطلبي <Ic.arrow s={14}/></span></div></div></div>
<button className={'hb'+(fav.includes(p.id)?' on':'')} aria-pressed={fav.includes(p.id)} aria-label={fav.includes(p.id)?'إزالة من المفضلة':'إضافة إلى المفضلة'} onClick={()=>tf(p.id)}><Ic.heart s={18}/></button></div>)}
{!list.length&&<p className="empty">{cat==='المفضلة'?'لم تضيفي منتجات إلى المفضلة بعد، اضغطي على القلب.':'لا توجد منتجات هنا حالياً، تابعينا فمنتجات جديدة تصل قريباً.'}</p>}</div>
{sel&&<div className="modal" onClick={()=>setSel(null)}><form className="sheet" role="dialog" aria-modal="true" aria-label={sel.name} onClick={e=>e.stopPropagation()} onSubmit={send}>
<button type="button" className="x" aria-label="إغلاق" onClick={()=>setSel(null)}><Ic.x s={18}/></button>
<img src={fx(gal[gi]||sel.image,800)} alt={sel.name}/>{gal.length>1&&<div className="th">{gal.map((g,i)=><img key={g} src={fx(g,160)} alt="" className={i===gi?'on':''} onClick={()=>setGi(i)}/>)}</div>}
<h3>{sel.name}</h3><p className="pp">{sel.price} د.ج{sel.old_price>sel.price&&<s>{sel.old_price}</s>}</p>{sel.description&&<p className="ds">{sel.description}</p>}
<div className="qa"><button type="button" className={'btn ghost'} onClick={()=>tf(sel.id)}><Ic.heart s={18}/>{fav.includes(sel.id)?'في المفضلة':'أضيفي للمفضلة'}</button><a className="btn ghost" href={waS} target="_blank" rel="noopener"><Ic.share s={18}/>شاركيه</a>{shoes&&<button type="button" className="btn ghost" onClick={()=>setSg(!sg)}><Ic.ruler s={18}/>دليل المقاسات</button>}</div>
{sg&&<table className="sg"><thead><tr><th>المقاس (EU)</th><th>طول القدم تقريباً (سم)</th></tr></thead><tbody>{SG.map(([a,b])=><tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>}
{sg&&<small className="sgn">قيسي قدمك من الكعب إلى أطول إصبع، وإن كنتِ بين مقاسين فاختاري الأكبر. القيم تقريبية وقد تختلف قليلاً حسب الموديل.</small>}
{L(sel.sizes).length>0&&<><p className="lb">المقاس</p><div className="cw">{L(sel.sizes).map(s=><button type="button" key={s} aria-pressed={sz===s} className={'chp'+(sz===s?' on':'')} onClick={()=>setSz(s)}>{s}</button>)}</div></>}
{L(sel.colors).length>0&&<><p className="lb">اللون</p><div className="cw">{L(sel.colors).map(s=><button type="button" key={s} aria-pressed={cl===s} className={'chp'+(cl===s?' on':'')} onClick={()=>setCl(s)}>{s}</button>)}</div></>}
<p className="lb">الكمية</p><div className="cw"><button type="button" className="chp" aria-label="إنقاص الكمية" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><b style={{minWidth:30,textAlign:'center'}}>{qty}</b><button type="button" className="chp" aria-label="زيادة الكمية" onClick={()=>setQty(Math.min(10,qty+1))}>+</button></div>
<p className="lb">بيانات التوصيل</p><input name="name" placeholder="الاسم الكامل" required/><input name="phone" placeholder="رقم الهاتف 07XXXXXXXX" inputMode="tel" required/>

<select
  value={wl}
  onChange={e => setWl(e.target.value)}
  required
>
  <option value="">اختاري الولاية</option>
  {W.map(w => (
    <option key={w} value={w.split(' - ')[1]}>
      {w}
    </option>
  ))}
</select>


<input name="address" placeholder="البلدية / الحي (اختياري)"/>
<div className="sum"><span>المنتج × {qty}</span><span>{sel.price*qty} د.ج</span><span>التوصيل</span><span>{fee} د.ج</span><b>المجموع</b><b>{sel.price*qty+fee} د.ج</b></div>
{err&&<p className="er">{err}</p>}<button className="btn" disabled={busy||!sel.in_stock} style={{width:'100%'}}>{!sel.in_stock?'نفد من المخزون':busy?'جارٍ الإرسال…':'تأكيد الطلب · الدفع عند الاستلام'}</button>
<a className="btn wab" href={waO} target="_blank" rel="noopener" style={{width:'100%',marginTop:8}}><Ic.chat s={18}/>أو اطلبي عبر واتساب</a></form></div>}
{done&&<div className="modal" onClick={()=>setDone(null)}><div className="sheet ok"><svg viewBox="0 0 52 52" width="84"><circle cx="26" cy="26" r="24" fill="none" stroke="#d4202b" strokeWidth="3" className="dr"/><path d="M14 27l8 8 16-17" fill="none" stroke="#d4202b" strokeWidth="4" strokeLinecap="round" className="dr2"/></svg><h3>تم استلام طلبك!</h3><p>المجموع {done} د.ج. سنتصل بك قريباً لتأكيد الطلب.</p><button className="btn" onClick={()=>setDone(null)}>متابعة التسوق</button></div></div>}
</>}
