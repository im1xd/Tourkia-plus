'use client';
import {useEffect,useState} from 'react';
export default function Fx(){const [p,setP]=useState(0),[s,setS]=useState(true);
useEffect(()=>{const f=()=>{try{const h=document.documentElement;setP(h.scrollTop/((h.scrollHeight-h.clientHeight)||1))}catch(e){}};addEventListener('scroll',f,{passive:true});
let seen=false;try{seen=!!sessionStorage.getItem('sp');sessionStorage.setItem('sp','1')}catch(e){}
const t=setTimeout(()=>setS(false),seen?0:1500);return()=>{removeEventListener('scroll',f);clearTimeout(t)}},[]);
return <><div className="prog" style={{transform:`scaleX(${p})`}}/>{s&&<div className="splash" aria-hidden="true"><img src="/logo.webp" alt=""/></div>}</>}
