import Image from 'next/image';

export function Logo({inverse=false}:{inverse?:boolean}) { return <a href="/#inicio" className={`logo official-logo${inverse?' inverse':''}`} aria-label="MARWA Redes y Energía — inicio"><Image src="/assets/marwa-logo-hex.png" alt="MARWA Redes y Energía" width={512} height={581} priority/></a> }
