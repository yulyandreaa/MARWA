import {Icon} from '@/components/premium/Icons';

export function Stars({value}: {value: number}) {
  return (
    <span className="stars" role="img" aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(n => <span key={n} className={n <= Math.round(value) ? 'on' : ''}><Icon name="star"/></span>)}
    </span>
  );
}
