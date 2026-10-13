'use client';
import {useEffect,useState} from 'react';
export default function Fx(){const [p,setP]=useState(0),[s,setS]=useState(true);
useEffect(()=>{const f=()=>{const h=document.documentElement;setP(h.scrollTop/((h.scrollHeight-h.clientHeight)||1))};addEventListener('scroll',f,{passive:true});
let t;if(sessionStorage.getItem('sp'))setS(false);else{sessionStorage.setItem('sp','1');t=setTimeout(()=>setS(false),1400)}return()=>{removeEventListener('scroll',f);clearTimeout(t)}},[]);
return <><div className="prog" style={{transform:`scaleX(${p})`}}/>{s&&<div className="splash" aria-hidden="true"><img src="/logo.webp" alt=""/></div>}</>}
