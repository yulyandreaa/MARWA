'use client';

import {read, usePersisted, write} from './persist';

/* Solo opinan quienes recibieron el producto; el vendedor puede ocultar una opinión. */
const KEY = 'marwa.reviews.v1';
const NONE: Review[] = [];

export type Review = {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  email: string;
  name: string;
  rating: number;
  text: string;
  visible: boolean;
  at: string;
};

export const useReviews = () => usePersisted<Review[]>(KEY, NONE);

export function saveReview(input: Omit<Review, 'id' | 'visible' | 'at'>) {
  const review: Review = {...input, id: `${input.orderId}-${input.productId}`, visible: true, at: new Date().toISOString()};
  write(KEY, [review, ...read<Review[]>(KEY, NONE).filter(r => r.id !== review.id)]);
}

export const setReviewVisible = (id: string, visible: boolean) =>
  write(KEY, read<Review[]>(KEY, NONE).map(r => (r.id === id ? {...r, visible} : r)));
