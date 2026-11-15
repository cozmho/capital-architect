import { Resend } from 'resend';

let _resend: Resend | null = null;

export function getResend() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    const r = getResend();
    if (!r) throw new Error('Resend not configured');
    return (r as any)[prop];
  },
});
