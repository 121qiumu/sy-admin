import axios from 'axios';
import { requestConfig } from '@/config';
import { setupInterceptors } from './interceptors';

export const http = axios.create({
  baseURL: requestConfig.baseURL,
  timeout: requestConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(http);
