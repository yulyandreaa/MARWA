'use client';

import Image from 'next/image';
import {FormEvent,useEffect,useMemo,useState} from 'react';
import {catalogProducts} from '@/data/catalogProducts';

type Mode='diagnostico'|'buscador'|'proyecto';
const questions=[
  {label:'La red presenta caídas o lentitud',impact:18},
  {label:'El cableado tiene más de cinco años',impact:16},
  {label:'No existe respaldo energético',impact:14},
  {label:'Planeamos crecer durante este año',impact:10},
];
const zones=[
  {name:'Data center',left:'18%',top:'74%',copy:'Infraestructura crítica, racks y organización de equipos.',metric:'99.9%',metricLabel:'continuidad',query:'Racks y gabinetes para data center'},
  {name:'Fibra óptica',left:'45%',top:'33%',copy:'Enlaces de alta velocidad y baja pérdida entre pisos.',metric:'10 Gbps',metricLabel:'capacidad',query:'Fibra óptica de alta velocidad'},
  {name:'Networking',left:'65%',top:'53%',copy:'Switches y equipos que administran una red segura.',metric:'24/7',metricLabel:'monitoreo',query:'Networking y switches empresariales'},
  {name:'Wi-Fi',left:'29%',top:'37%',copy:'Cobertura inalámbrica estable para todos los espacios.',metric:'100%',metricLabel:'cobertura',query:'Mejorar la cobertura Wi-Fi de una oficina'},
  {name:'Energía',left:'77%',top:'77%',copy:'Continuidad operativa y protección para equipos críticos.',metric:'0',metricLabel:'interrupciones',query:'Respaldo de energía para equipos críticos'},
];

export function DigitalExperienceSection(){
  const [mode,setMode]=useState<Mode>('diagnostico');
  const [zone,setZone]=useState('Data center');
  const [touring,setTouring]=useState(false);
  const [answers,setAnswers]=useState<boolean[]>([false,false,false,false]);
  const [query,setQuery]=useState('');
  const [searched,setSearched]=useState(false);
  const [quantities,setQuantities]=useState<Record<string,number>>({'rack-piso':1,'patch-panel':1,'cable-cat5e':1});
  const score=Math.max(35,92-answers.reduce((sum,value,index)=>sum+(value?questions[index].impact:0),0));
  const recommendations=useMemo(()=>{
    const term=query.toLowerCase();
    if(term.includes('fibra')||term.includes('velocidad'))return catalogProducts.filter(p=>p.category==='Fibra óptica');
    if(term.includes('rack')||term.includes('gabinete')||term.includes('infra'))return catalogProducts.filter(p=>p.category==='Infraestructura');
    return catalogProducts.filter(p=>p.category==='Cableado').slice(0,3);
  },[query]);
  const total=Object.values(quantities).reduce((sum,value)=>sum+value,0);
  const update=(id:string,delta:number)=>setQuantities(current=>({...current,[id]:Math.max(0,(current[id]||0)+delta)}));
  const activeZone=zones.find(item=>item.name===zone)||zones[0];
  useEffect(()=>{if(!touring)return;const timer=setInterval(()=>setZone(current=>zones[(zones.findIndex(item=>item.name===current)+1)%zones.length].name),2400);return()=>clearInterval(timer)},[touring]);
  const exploreZone=()=>{setQuery(activeZone.query);setSearched(true);setMode('buscador');setTimeout(()=>document.querySelector('.digital-shell')?.scrollIntoView({behavior:'smooth',block:'start'}),40)};

  return <section className="digital-experience" id="experiencia">
    <div className="container digital-intro"><div><p className="eyebrow">MARWA Digital Experience</p><h2>De la necesidad<br/><span>a la solución.</span></h2></div><p>Una experiencia interactiva para diagnosticar tu infraestructura, encontrar los productos correctos y preparar tu proyecto.</p></div>
    <div className="container digital-building">
      <div className="building-stage">
        <div className="building-label"><small>EXPLORADOR DE INFRAESTRUCTURA</small><b>Descubre cómo se conecta una empresa.</b></div>
        <Image src="/assets/marwa-digital-building.png" alt="Edificio empresarial con soluciones MARWA de red, fibra, seguridad y energía" fill priority sizes="(max-width: 1200px) 100vw, 1180px"/>
        {zones.map((item,index)=><button key={item.name} className={`building-hotspot ${zone===item.name?'active':''}`} style={{left:item.left,top:item.top}} onClick={()=>{setZone(item.name);setTouring(false)}} aria-label={`Explorar ${item.name}`}><span>{index+1}</span><b>{item.name}</b></button>)}
        <button className={`tour-control ${touring?'active':''}`} onClick={()=>setTouring(value=>!value)}><i>{touring?'Ⅱ':'▶'}</i>{touring?'Pausar recorrido':'Iniciar recorrido'}</button>
      </div>
      <aside className="zone-panel"><span>ZONA ACTIVA · {String(zones.findIndex(item=>item.name===zone)+1).padStart(2,'0')}</span><h3>{zone}</h3><p>{activeZone.copy}</p><div className="zone-metric"><b>{activeZone.metric}</b><small>{activeZone.metricLabel}</small></div><ul>{zones.map(item=><li key={item.name} className={zone===item.name?'active':''}><button onClick={()=>{setZone(item.name);setTouring(false)}}><i/>{item.name}</button></li>)}</ul><button onClick={exploreZone}>Ver recomendación <span>→</span></button><div><i/><small>{touring?'RECORRIDO AUTOMÁTICO ACTIVO':'MARWA CONNECTED BUILDING'}</small></div></aside>
    </div>
    <div className="container digital-shell">
      <nav className="digital-tabs" aria-label="Herramientas digitales">
        <button className={mode==='diagnostico'?'active':''} onClick={()=>setMode('diagnostico')}><span>01</span>Diagnóstico</button>
        <button className={mode==='buscador'?'active':''} onClick={()=>setMode('buscador')}><span>02</span>Buscador inteligente</button>
        <button className={mode==='proyecto'?'active':''} onClick={()=>setMode('proyecto')}><span>03</span>Project builder</button>
      </nav>

      {mode==='diagnostico'&&<div className="diagnostic-workspace">
        <div className="diagnostic-copy"><small>DIAGNÓSTICO DE CONECTIVIDAD</small><h3>¿Qué tan preparada está tu empresa?</h3><p>Selecciona las situaciones que aplican actualmente.</p><div className="question-list">{questions.map((question,index)=><button key={question.label} className={answers[index]?'selected':''} onClick={()=>setAnswers(current=>current.map((value,i)=>i===index?!value:value))}><i>{answers[index]?'✓':'+'}</i>{question.label}</button>)}</div></div>
        <div className="score-panel"><div className="score-ring" style={{'--score':`${score*3.6}deg`} as React.CSSProperties}><div><b>{score}%</b><span>Nivel de infraestructura</span></div></div><h4>{score>75?'Empresa conectada':score>55?'Oportunidades de mejora':'Infraestructura en riesgo'}</h4><p>{score>75?'Tu base tecnológica es sólida. Podemos ayudarte a escalar.':'MARWA recomienda reforzar los puntos críticos seleccionados.'}</p><button onClick={()=>setMode('proyecto')}>Construir solución <span>→</span></button></div>
      </div>}

      {mode==='buscador'&&<div className="search-workspace"><div className="search-title"><small>BUSCADOR DE SOLUCIONES</small><h3>Cuéntanos qué necesita tu empresa.</h3><p>Describe el reto en tus propias palabras.</p></div><form onSubmit={(event:FormEvent)=>{event.preventDefault();setSearched(true)}}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ej. Necesito mejorar el Wi-Fi de una oficina de 80 personas"/><button>Encontrar solución</button></form>{searched&&<div className="solution-result"><div><small>SOLUCIÓN RECOMENDADA</small><h4>{query||'Infraestructura empresarial confiable'}</h4></div><div className="recommended-products">{recommendations.map(product=><article key={product.id}><div><Image src={product.image} alt={product.name} fill sizes="100px"/></div><span>{product.name}</span></article>)}</div><button onClick={()=>setMode('proyecto')}>Usar en mi proyecto →</button></div>}</div>}

      {mode==='proyecto'&&<div className="builder-workspace"><div className="builder-list"><small>PROYECTO · NUEVA INFRAESTRUCTURA</small><h3>Configura una solución inicial.</h3>{catalogProducts.slice(0,5).map(product=><div className="builder-line" key={product.id}><div className="builder-thumb"><Image src={product.image} alt="" fill sizes="54px"/></div><span>{product.name}</span><div><button onClick={()=>update(product.id,-1)}>−</button><b>{quantities[product.id]||0}</b><button onClick={()=>update(product.id,1)}>＋</button></div></div>)}</div><aside className="builder-summary"><span>RESUMEN DEL PROYECTO</span><div className="builder-preview"><Image src="/assets/solution-infrastructure.jpg" alt="Infraestructura MARWA" fill sizes="320px"/></div><small>Elementos seleccionados</small><b>{total}</b><p>Un asesor validará las cantidades, compatibilidad y disponibilidad antes de cotizar.</p><button onClick={()=>{window.location.href='/catalogo'}}>Solicitar cotización <span>→</span></button></aside></div>}
    </div>
  </section>
}
