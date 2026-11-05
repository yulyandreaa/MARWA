import {statusFlow, statusLabel, type Order} from '@/lib/shop';
import {dateTime} from '@/lib/format';

export function OrderTimeline({order}: {order: Order}) {
  if (order.status === 'cancelado') {
    const c = order.history.find(h => h.status === 'cancelado');
    return (
      <div className="timeline cancelled">
        <b>Pedido cancelado</b>
        {c && <span>{dateTime(c.at)}{c.note ? ` · ${c.note}` : ''}</span>}
      </div>
    );
  }
  const reached = statusFlow.indexOf(order.status);
  return (
    <ol className="timeline">
      {statusFlow.map((s, i) => {
        const h = order.history.find(x => x.status === s);
        return (
          <li key={s} className={i <= reached ? 'done' : ''}>
            <i/>
            <b>{statusLabel[s]}</b>
            <span>{h ? dateTime(h.at) : 'Pendiente'}</span>
            {s === 'enviado' && order.tracking && i <= reached && <span>Guía: {order.tracking}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function StatusPill({status}: {status: Order['status']}) {
  return <span className={`pill pill-${status}`}>{statusLabel[status]}</span>;
}
