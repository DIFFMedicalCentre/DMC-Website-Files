import { processQueue } from '../lib/email-service';
// Netlify scheduled functions are not public HTTP endpoints in production.
export default async function handler(): Promise<Response> {
  try { await processQueue(null, 2); return new Response('Queue processed', {status:200}); }
  catch { console.error('DMC scheduled queue processing failed'); return new Response('Queue processing failed', {status:500}); }
}
export const config = { schedule: '*/5 * * * *' };
