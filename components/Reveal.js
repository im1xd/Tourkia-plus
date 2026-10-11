'use client';
import {useEffect,useRef} from 'react';
export default function Reveal({children,d=0,className=''}){
const r=useRef();useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){e.target.classList.add('in');o.disconnect()}},{threshold:.15});o.observe(r.current);return()=>o.disconnect()},[]);
return <div ref={r} className={'rv '+className} style={{transitionDelay:d+'ms'}}>{children}</div>}
