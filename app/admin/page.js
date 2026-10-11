'use client';
import {useState} from 'react';
const ST={new:'جديد',confirmed:'مؤكد',shipped:'تم الشحن',delivered:'تم التسليم',cancelled:'ملغى'};
export default function Admin(){
const [pw,setPw]=useState(''),[ok,setOk]=useState(false),[tab,setTab]=useState('s'),[o,setO]=useState([]),[p,setP]=useState([]),[msg,setMsg]=useState('');
const H={'x-admin':pw};
const load=async()=>{const a=await fetch('/api/orders',{headers:H});if(!a.ok)return false;setO(await a.json());setP(await(await fetch('/api/products')).json());return true};
async function login(){(await load())?setOk(true):setMsg('كلمة السر خاطئة')}
async function st(id,status){await fetch('/api/orders',{method:'PATCH',headers:H,body:JSON.stringify({id,status})});load()}
async function del(id){if(!confirm('حذف المنتج؟'))return;await fetch('/api/products',{method:'DELETE',headers:H,body:JSON.stringify({id})});load()}
async function add(e){e.preventDefault();setMsg('جارٍ الرفع…');const f=new FormData(e.target),x=new FormData();x.append('file',f.get('file'));
const u=await(await fetch('/api/upload',{method:'POST',headers:H,body:x})).json();
const r=await fetch('/api/products',{method:'POST',headers:H,body:JSON.stringify({name:f.get('name'),category:f.get('category'),price:f.get('price'),sizes:f.get('sizes'),colors:f.get('colors'),image:u.url})});
setMsg(r.ok?'تمت الإضافة ✓':'فشل');if(r.ok){e.target.reset();load()}}
if(!ok)return <div className="adm"><section><h3>لوحة الإدارة</h3><input type="password" placeholder="كلمة السر" onChange={e=>setPw(e.target.value)}/><button className="btn" onClick={login}>دخول</button><p>{msg}</p></section></div>;
const live=o.filter(x=>x.status!=='cancelled'),rev=o.filter(x=>x.status==='delivered').reduce((a,x)=>a+x.total,0);
const T=[['s','نظرة عامة'],['o','الطلبات ('+o.length+')'],['p','المنتجات ('+p.length+')']];
return <div className="adm"><div className="dtabs">{T.map(([k,t])=><button key={k} className={'tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>{t}</button>)}</div>
{tab==='s'&&<div className="dash">{[['الطلبات',o.length],['طلبات جديدة',o.filter(x=>x.status==='new').length],['المنتجات',p.length],['إيراد المسلَّم',rev+' د.ج'],['قيد المتابعة',live.filter(x=>x.status!=='delivered').length]].map(([t,v])=><div className="sc" key={t}>{t}<b>{v}</b></div>)}</div>}
{tab==='o'&&(o.length?o.map(x=><div className="oc" key={x.id}><b>{x.product_name}</b> {x.size} {x.color} — {x.total} د.ج<br/>{x.name} · <a href={'tel:'+x.phone}>{x.phone}</a> · {x.wilaya} {x.address}<br/><select value={x.status} onChange={e=>st(x.id,e.target.value)}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>):<p>لا طلبات بعد.</p>)}
{tab==='p'&&<><section><h3>إضافة منتج</h3><form onSubmit={add}><input name="name" placeholder="الاسم" required/><input name="category" placeholder="الفئة: أحذية / حقائب / ملابس / إكسسوارات" required/><input name="price" type="number" placeholder="السعر" required/><input name="sizes" placeholder="المقاسات: 36,37,38"/><input name="colors" placeholder="الألوان: أسود,بيج"/><input name="file" type="file" accept="image/*" required/><button className="btn">نشر</button></form><p>{msg}</p></section>
{p.map(x=><div className="pr" key={x.id}><img src={x.image} alt=""/><div>{x.name}<br/><small>{x.category} · {x.price} د.ج</small></div><button onClick={()=>del(x.id)}>حذف</button></div>)}</>}</div>}
