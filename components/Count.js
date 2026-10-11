'use client';
import {useEffect,useRef,useState} from 'react';
export default function Count({to,suffix=''}){const [n,setN]=useState(0),r=useRef();
useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;o.disconnect();let t=0;const s=setInterval(()=>{t+=1;setN(Math.round(to*Math.min(t/40,1)));if(t>=40)clearInterval(s)},30)});o.observe(r.current)},[to]);
return <b ref={r}>{n}{suffix}</b>}
