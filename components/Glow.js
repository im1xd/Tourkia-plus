'use client';
import {useEffect} from 'react';
export default function Glow(){useEffect(()=>{const m=e=>{const t=e.touches?e.touches[0]:e;document.documentElement.style.setProperty('--x',t.clientX+'px');document.documentElement.style.setProperty('--y',t.clientY+'px')};
addEventListener('pointermove',m);addEventListener('touchmove',m,{passive:true});return()=>{removeEventListener('pointermove',m);removeEventListener('touchmove',m)}},[]);return null}
