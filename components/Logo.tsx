import Image from 'next/image';

export function Logo({inverse=false}:{inverse?:boolean}) { return <a href="/#inicio" className={`logo official-logo${inverse?' inverse':''}`} aria-label="MARWA Redes y Energía — inicio"><Image src="/assets/marwa-hex-logo.svg" alt="MARWA Redes y Energía" width={261} height={290} priority/></a> }
