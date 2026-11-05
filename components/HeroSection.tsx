'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';

const videos=[
  {src:'/assets/marwa-hero-motion.mp4',label:'Identidad MARWA'},
  {src:'/assets/marwa-hero-motion-2.mp4',label:'Conectividad'},
  {src:'/assets/marwa-hero-motion-3.mp4',label:'Infraestructura'},
  {src:'/assets/marwa-hero-motion-4.mp4',label:'Innovación MARWA'},
];
const showcase=[
  {name:'Fibra óptica',cat:'fibra',image:'/assets/solution-fiber.jpg'},
  {name:'Networking',cat:'networking',image:'/assets/solution-networking.jpg'},
  {name:'Cableado',cat:'cableado',image:'/assets/solution-cabling.jpg'},
  {name:'Infraestructura',cat:'infraestructura',image:'/assets/solution-infrastructure.jpg'},
  {name:'Línea plástica',cat:'plastica',image:'/assets/solution-plastic.jpg'},
];

export function HeroSection(){
  const [active,setActive]=useState(0);
  const videoRefs=useRef<(HTMLVideoElement|null)[]>([]);
  const go=(index:number)=>setActive((index+videos.length)%videos.length);

  useEffect(()=>{
    videoRefs.current.forEach((video,index)=>{
      if(!video)return;
      if(index===active){video.currentTime=0;void video.play().catch(()=>undefined)}else video.pause();
    });
  },[active]);

  return <section id="inicio" className="hero premium-hero">
    <div className="hero-artwork" aria-hidden="true">
      {videos.map((video,index)=><video key={video.src} ref={node=>{videoRefs.current[index]=node}} className={index===active?'active':''} muted playsInline preload={index===0?'auto':'metadata'} poster="/assets/marwa-hero-magnific.jpg" onEnded={()=>go(active+1)}><source src={video.src} type="video/mp4"/></video>)}
      <Image className="hero-poster" src="/assets/marwa-hero-magnific.jpg" alt="" fill priority sizes="100vw"/>
    </div>
    <div className="hero-carousel-controls" aria-label="Carrusel de videos">
      <button className="carousel-arrow" onClick={()=>go(active-1)} aria-label="Video anterior">←</button>
      <div>{videos.map((video,index)=><button key={video.src} className={index===active?'active':''} onClick={()=>go(index)} aria-label={`Ver video: ${video.label}`}><i/><span>0{index+1}</span></button>)}</div>
      <button className="carousel-arrow" onClick={()=>go(active+1)} aria-label="Video siguiente">→</button>
    </div>
    <div className="solution-dock container">{showcase.map((item,index)=><a href={`/tienda?categoria=${item.cat}`} target="_blank" rel="noopener" key={item.name}><div><Image src={item.image} alt="" fill sizes="180px"/></div><p><span>0{index+1}</span><b>{item.name}</b><small>Explorar línea</small></p><i>↗</i></a>)}</div>
  </section>
}
