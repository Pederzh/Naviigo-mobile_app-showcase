import { DATA_AVAILABLE } from './types';

export const addData = (data) => ({
    type: DATA_AVAILABLE,
    data
});