const certifications=[
  {name:'RITEL',description:'Reglamento Técnico para Redes Internas de Telecomunicaciones',mark:'RT',type:'Telecomunicaciones'},
  {name:'RETIE',description:'Reglamento Técnico de Instalaciones Eléctricas',mark:'RE',type:'Seguridad eléctrica'},
  {name:'LENOR',description:'Procesos y productos con calidad certificada',mark:'LN',type:'Calidad certificada'},
];

export function CertificationsSection(){return <section className="section certifications"><div className="container cert-layout"><header className="cert-heading"><p className="eyebrow">Confianza verificada</p><h2>Respaldo que<br/><span>se puede comprobar.</span></h2><p>Cada solución MARWA responde a estándares técnicos que protegen la instalación, el desempeño y la continuidad de tu proyecto.</p></header><div className="cert-list">{certifications.map((cert,index)=><article key={cert.name}><div className="cert-seal"><span>{cert.mark}</span><i>✓</i></div><div className="cert-copy"><small>0{index+1} · {cert.type}</small><h3>{cert.name}</h3><p>{cert.description}</p></div><b>MARWA<br/>CERTIFICADO</b></article>)}</div></div></section>}
