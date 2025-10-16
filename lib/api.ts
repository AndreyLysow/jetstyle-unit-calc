import axios from 'axios';

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000' });

export async function postCompute(payload: any) {
  const { data } = await API.post('/api/compute', payload);
  return data;
}
export async function postLead(payload: { email: string; payload?: any }) {
  const { data } = await API.post('/api/lead', payload);
  return data;
}
export async function postCallback(payload: { name: string; email: string; message: string }) {
  const { data } = await API.post('/api/callback', payload);
  return data;
}