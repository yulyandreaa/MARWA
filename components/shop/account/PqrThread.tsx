'use client';

import {useState} from 'react';
import {replyPqr, type Pqr, type PqrMessage} from '@/lib/pqr';
import {compressPhoto, dateTime} from '@/lib/format';
import {toast} from '@/components/shop/ShopUI';

/** Conversación de una PQR. `as` indica quién escribe en esta pantalla. */
export function PqrThread({pqr, as}: {pqr: Pqr; as: PqrMessage['from']}) {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string>();

  const attach = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await compressPhoto(file, 700));
    } catch (e) {
      toast((e as Error).message);
    }
  };
  const send = () => {
    if (!text.trim()) return toast('Escribe tu mensaje');
    const ok = replyPqr(pqr.id, as, text.trim(), photo);
    if (!ok) return toast('No hay espacio para guardar la foto. Quítala e intenta de nuevo.');
    setText('');
    setPhoto(undefined);
    toast('Mensaje enviado');
  };

  return (
    <div className="pq">
      <ol>
        {pqr.messages.map((m, i) => (
          <li key={i} className={m.from === as ? 'mine' : ''}>
            <b>{m.from === 'marwa' ? 'Equipo MARWA' : pqr.name}</b>
            <p>{m.text}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {m.photo && <a href={m.photo} target="_blank" rel="noopener"><img src={m.photo} alt="Foto adjunta"/></a>}
            <small>{dateTime(m.at)}</small>
          </li>
        ))}
      </ol>
      {pqr.status !== 'cerrada' && (
        <div className="pq-reply">
          <label>Tu respuesta
            <textarea rows={3} value={text} onChange={e => setText(e.target.value)}/>
          </label>
          <div className="pq-actions">
            <label className="pa-text-btn">
              {photo ? 'Cambiar foto' : 'Adjuntar foto'}
              <input type="file" accept="image/*" hidden onChange={e => { attach(e.target.files?.[0]); e.target.value = ''; }}/>
            </label>
            {photo && <button type="button" className="pa-text-btn danger" onClick={() => setPhoto(undefined)}>Quitar foto</button>}
            <button type="button" className="button primary" onClick={send}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}
