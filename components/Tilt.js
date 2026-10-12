'use client';
import {useState} from 'react';
export default function Tilt({children,className}){const [t,setT]=useState('');
return <div className={className} style={{transform:t,transition:'transform .25s'}} onPointerMove={e=>{if(e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect();setT(`perspective(900px) rotateY(${((e.clientX-r.left)/r.width-.5)*-14}deg) rotateX(${((e.clientY-r.top)/r.height-.5)*10}deg)`)}} onPointerLeave={()=>setT('')}>{children}</div>}
