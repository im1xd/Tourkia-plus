'use client';
import {useState} from 'react';
const ST={new:'جديد',confirmed:'مؤكد',shipped:'تم الشحن',delivered:'تم التسليم',cancelled:'ملغى'};
const CAT={'أحذية رياضية':{i:'👟',s:['35','36','37','38','39','40','41','42','43','44','45'],n:['حذاء رياضي','سنيكرز','حذاء جري','حذاء كاجوال']},
'كعب وصنادل':{i:'👠',s:['35','36','37','38','39','40','41','42'],n:['كعب عالٍ','صندل','بالرينا','شبشب','بوت','حذاء رسمي']},
'حقائب يد':{i:'👜',s:[],n:['حقيبة يد','حقيبة كتف','محفظة','حقيبة سهرة','حقيبة كروس']},
'حقائب مدرسية وسفر':{i:'🎒',s:[],n:['محفظة مدرسية','حقيبة ظهر','حقيبة سفر','حقيبة عجلات','مقلمة']},
'إكسسوارات':{i:'💍',s:[],n:['ساعة','نظارة','حزام','عقد','سوار','وشاح']}};
const COL=[['أسود','#111'],['أبيض','#fff'],['بيج','#d9c3a0'],['بني','#6b4226'],['أحمر','#d92b2b'],['وردي','#f48fb1'],['أزرق','#2a5bd7'],['كحلي','#1b2a52'],['أخضر','#2e8b57'],['ذهبي','#d4af37'],['فضي','#c0c0c0'],['رمادي','#888']];
const tg=(a,v)=>a.includes(v)?a.filter(x=>x!==v):[...a,v];
export default function Admin(){
const [pw,setPw]=useState(''),[ok,setOk]=useState(false),[tab,setTab]=useState('p'),[o,setO]=useState([]),[p,setP]=useState([]),[msg,setMsg]=useState('');
const [cat,setCat]=useState(''),[name,setName]=useState(''),[price,setPrice]=useState(''),[sz,setSz]=useState([]),[cl,setCl]=useState([]),[file,setFile]=useState(null),[busy,setBusy]=useState(false);
const H={'x-admin':pw};
const load=async()=>{const a=await fetch('/api/orders',{headers:H});if(!a.ok)return false;setO(await a.json());setP(await(await fetch('/api/products')).json());return true};
async function login(){(await load())?setOk(true):setMsg('كلمة السر خاطئة')}
async function st(id,status){await fetch('/api/orders',{method:'PATCH',headers:H,body:JSON.stringify({id,status})});load()}
async function del(id){if(!confirm('حذف المنتج؟'))return;await fetch('/api/products',{method:'DELETE',headers:H,body:JSON.stringify({id})});load()}
async function add(){if(!cat||!name||!price||!file)return setMsg('اختاري الفئة والاسم والسعر والصورة');
setBusy(true);setMsg('جارٍ الرفع…');const x=new FormData();x.append('file',file);
const u=await(await fetch('/api/upload',{method:'POST',headers:H,body:x})).json();
const r=await fetch('/api/products',{method:'POST',headers:H,body:JSON.stringify({name,category:cat,price,sizes:sz.join(','),colors:cl.join(','),image:u.url})});
setBusy(false);setMsg(r.ok?'تم نشر المنتج ✓':'فشل النشر');if(r.ok){setName('');setPrice('');setSz([]);setCl([]);setFile(null);load()}}
if(!ok)return <div className="adm"><section><h3>لوحة الإدارة</h3><input type="password" placeholder="كلمة السر" onChange={e=>setPw(e.target.value)}/><button className="btn" onClick={login}>دخول</button><p>{msg}</p></section></div>;
const live=o.filter(x=>x.status!=='cancelled'),rev=o.filter(x=>x.status==='delivered').reduce((a,x)=>a+x.total,0),C=CAT[cat];
const T=[['s','نظرة عامة'],['o','الطلبات ('+o.length+')'],['p','المنتجات ('+p.length+')']];
return <div className="adm"><div className="dtabs">{T.map(([k,t])=><button key={k} className={'tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{t}</button>)}</div>
{tab==='s'&&<div className="dash">{[['الطلبات',o.length],['طلبات جديدة',o.filter(x=>x.status==='new').length],['المنتجات',p.length],['إيراد المسلَّم',rev+' د.ج'],['قيد المتابعة',live.filter(x=>x.status!=='delivered').length]].map(([t,v])=><div className="sc" key={t}>{t}<b>{v}</b></div>)}</div>}
{tab==='o'&&(o.length?o.map(x=><div className="oc" key={x.id}><b>{x.product_name}</b> {x.size} {x.color} — {x.total} د.ج<br/>{x.name} · <a href={'tel:'+x.phone}>{x.phone}</a> · {x.wilaya} {x.address}<br/><select value={x.status} onChange={e=>st(x.id,e.target.value)}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>):<p>لا طلبات بعد.</p>)}
{tab==='p'&&<><section><h3>إضافة منتج</h3>
<p className="lb">١. الفئة</p><div className="cw">{Object.entries(CAT).map(([k,v])=><button key={k} className={'chp'+(cat===k?' on':'')} onClick={()=>{setCat(k);setSz([]);setName('')}}>{v.i} {k}</button>)}</div>
{C&&<><p className="lb">٢. النوع</p><div className="cw">{C.n.map(n=><button key={n} className={'chp'+(name===n?' on':'')} onClick={()=>setName(n)}>{n}</button>)}</div><input value={name} onChange={e=>setName(e.target.value)} placeholder="أو عدّلي الاسم (مثال: حذاء رياضي أبيض)"/>
{C.s.length>0&&<><p className="lb">٣. المقاسات المتوفرة</p><div className="cw">{C.s.map(s=><button key={s} className={'chp'+(sz.includes(s)?' on':'')} onClick={()=>setSz(tg(sz,s))}>{s}</button>)}</div></>}
<p className="lb">٤. الألوان المتوفرة</p><div className="cw">{COL.map(([n,h])=><button key={n} className={'sw'+(cl.includes(n)?' on':'')} onClick={()=>setCl(tg(cl,n))}><span style={{background:h}}/>{n}</button>)}</div>
<p className="lb">٥. السعر (د.ج)</p><div className="cw"><button className="chp" onClick={()=>setPrice(Math.max(0,(+price||0)-500))}>− 500</button><input style={{flex:1,minWidth:100}} type="number" inputMode="numeric" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0"/><button className="chp" onClick={()=>setPrice((+price||0)+500)}>+ 500</button></div>
<p className="lb">٦. الصورة</p><label className="up">{file?<img src={URL.createObjectURL(file)} alt=""/>:<span>📷 اضغطي لاختيار صورة</span>}<input hidden type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/></label>
<button className="btn" style={{width:'100%',marginTop:14}} disabled={busy} onClick={add}>نشر المنتج</button></>}
<p style={{marginTop:8}}>{msg}</p></section>
{p.map(x=><div className="pr" key={x.id}><img src={x.image} alt=""/><div>{x.name}<br/><small>{x.category} · {x.price} د.ج</small></div><button onClick={()=>del(x.id)}>حذف</button></div>)}</>}</div>}
