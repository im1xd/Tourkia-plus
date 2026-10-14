'use client';
import {useEffect,useRef} from 'react';
export default function Reveal({children,d=0,className=''}){
const r=useRef();useEffect(()=>{const el=r.current;if(!el)return;const show=()=>el.classList.add('in');
let o;try{o=new IntersectionObserver(([e])=>{if(e.isIntersecting){show();o.disconnect()}},{threshold:.05,rootMargin:'0px 0px -5% 0px'});o.observe(el)}catch(e){show()}
const t=setTimeout(show,3500);return()=>{clearTimeout(t);o&&o.disconnect()}},[]);
return <div ref={r} className={'rv '+className} style={{transitionDelay:d+'ms'}}>{children}</div>}
