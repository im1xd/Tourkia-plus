import {sql} from '@/lib/db';import Shop from '@/components/Shop';import Reveal from '@/components/Reveal';import Count from '@/components/Count';
export const dynamic='force-dynamic';
const Q=[['كيف أطلب؟','اختاري المنتج، اضغطي عليه، املئي الاسم والهاتف والولاية ثم أكدي الطلب. سنتصل بك لتأكيده.'],['كيف أدفع؟','الدفع عند الاستلام فقط، لا حاجة لأي دفع مسبق.'],['هل التوصيل متوفر لولايتي؟','نعم، التوصيل متوفر إلى 58 ولاية.'],['أين يقع المحل؟','حي الرمال، مقابل مغازة الباشا للألبسة.']];
export default async function Home(){
let products=[];try{products=await sql`SELECT id,name,category,price,image,sizes,colors FROM products WHERE COALESCE(active,TRUE)=TRUE ORDER BY id DESC`}catch(e){}
return <>
<nav className="nav"><div className="brand">تركية <b>Plus</b></div><a className="btn" href="#shop">تسوّقي الآن</a></nav>
<header className="hero"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
<div className="chips"><span className="chip" style={{top:'14%',right:'8%'}}>👠</span><span className="chip" style={{top:'62%',right:'12%',animationDelay:'-2s'}}>👜</span><span className="chip" style={{top:'22%',left:'9%',animationDelay:'-4s'}}>👗</span><span className="chip" style={{top:'70%',left:'14%',animationDelay:'-1s'}}>✨</span></div>
<div style={{position:'relative'}}><h1><span style={{animationDelay:'0ms'}}>تركية&nbsp;</span><span className="g" style={{animationDelay:'200ms'}}>Plus</span><br/><span style={{animationDelay:'500ms'}}>أناقتكِ تبدأ هنا</span></h1>
<p>أحذية، حقائب وأزياء نسائية بأحدث الصيحات، بأسعار تناسبك وتوصيل إلى 58 ولاية.</p><a className="btn" href="#shop">اكتشفي المجموعة</a></div></header>
<div className="marq"><div>{Array(8).fill('✦ أحذية ✦ حقائب ✦ أزياء ✦ الدفع عند الاستلام ✦ توصيل لـ 58 ولاية ').join('')}</div></div>
<section className="sec"><Reveal><h2>تسوّقي حسب القسم</h2></Reveal><div className="cats">
{[['c1','👠','أحذية','أحذية'],['c2','👜','حقائب','حقائب'],['c3','👗','ملابس','ملابس'],['c4','💍','إكسسوارات','إكسسوارات']].map(([c,i,t,k],n)=><Reveal key={k} d={n*120}><a href="#shop" data-cat={k} className={'cat '+c}><i>{i}</i>{t}</a></Reveal>)}</div></section>
<section className="sec" id="shop"><Reveal><h2>أحدث المنتجات</h2></Reveal><Shop products={products} fee={+process.env.DELIVERY_FEE||0}/></section>
<section className="sec"><Reveal><h2>لماذا تركية بلس؟</h2></Reveal><div className="feat">
{[['🚚','توصيل سريع','إلى 58 ولاية حتى باب بيتك.'],['💵','الدفع عند الاستلام','تفحّصي طلبك ثم ادفعي.'],['💎','موديلات عصرية','تشكيلة تتجدد باستمرار.'],['💬','خدمة ودودة','نردّ على رسائلك في إنستغرام.']].map(([i,t,d],n)=><Reveal key={t} d={n*120}><div className="fc"><i>{i}</i><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></section>
<section className="stats"><Reveal><Count to={58}/>ولاية نوصل إليها</Reveal><Reveal d={150}><Count to={7938}/>متابع على إنستغرام</Reveal><Reveal d={300}><Count to={1464}/>منشور وموديل</Reveal></section>
<section className="sec"><Reveal><h2>طلبك في 3 خطوات</h2></Reveal><div className="steps">
{[['اختاري','تصفّحي المجموعة وحدّدي المنتج.'],['أكدي','املئي بياناتك واضغطي تأكيد.'],['استلمي','ندفع عند الاستلام، وصلك الطلب.']].map(([t,d],n)=><Reveal key={t} d={n*150}><div className="st"><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div></section>
<section className="sec"><Reveal><h2>أسئلة شائعة</h2></Reveal>{Q.map(([q,a])=><Reveal key={q}><details><summary>{q}</summary><p>{a}</p></details></Reveal>)}</section>
<section className="sec"><Reveal><div className="cta"><h2>جاهزة لإطلالتكِ الجديدة؟</h2><p style={{margin:'10px 0 20px'}}>تابعينا على إنستغرام لأحدث الوصولات.</p><a className="btn" href="https://instagram.com/tourkia_plus_01">@tourkia_plus_01</a></div></Reveal></section>
<footer><div className="brand" style={{color:'#fff'}}>تركية Plus</div>حي الرمال، مقابل مغازة الباشا للألبسة<br/><a href="https://instagram.com/tourkia_plus_01">@tourkia_plus_01</a> · <a href="https://instagram.com/tourkia_plus02">@tourkia_plus02</a></footer></>}
