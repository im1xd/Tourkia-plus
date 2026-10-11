import {sql} from '@/lib/db';import Shop from '@/components/Shop';
export const dynamic='force-dynamic';
export default async function Home(){
let products=[];try{products=await sql`SELECT id,name,category,price,image,sizes,colors FROM products WHERE COALESCE(active,TRUE)=TRUE ORDER BY id DESC`}catch(e){}
const w='تركية بلس'.split(' ');
return <>
<nav className="nav"><div className="brand">تركية <b>Plus</b></div><a className="btn" href="#shop">تسوّقي الآن</a></nav>
<header className="hero"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
<div><h1>{w.map((c,i)=><span key={i} style={{animationDelay:i*200+'ms'}}>{c}&nbsp;</span>)}<br/><span style={{animationDelay:'600ms'}}>أناقتكِ تبدأ هنا</span></h1>
<p>أحذية، حقائب وأزياء نسائية بأحدث الصيحات — توصيل إلى 58 ولاية.</p><a className="btn" href="#shop">اكتشفي المجموعة</a></div></header>
<div className="marq"><div>{Array(8).fill('✦ أحذية ✦ حقائب ✦ أزياء ✦ توصيل لـ 58 ولاية ').join('')}</div></div>
<section className="sec" id="shop"><h2>المجموعة</h2><Shop products={products} fee={+process.env.DELIVERY_FEE||0}/></section>
<footer><div className="brand" style={{color:'#fff'}}>تركية Plus</div>حي الرمال، مقابل مغازة الباشا للألبسة<br/>
<a href="https://instagram.com/tourkia_plus_01">@tourkia_plus_01</a> · <a href="https://instagram.com/tourkia_plus02">@tourkia_plus02</a></footer>
</>}
