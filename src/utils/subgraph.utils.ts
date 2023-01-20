import { differenceInDays } from 'date-fns';

export const isNewSubgraph = (createdAt: number) => differenceInDays(Date.now(), createdAt * 1000) < 2;
