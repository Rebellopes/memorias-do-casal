import { redirect } from 'next/navigation';
import { exchangeGoogleCode } from '@/lib/google-photos';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  const success = await exchangeGoogleCode(code);
  if (!success) {
    return new Response('Failed to exchange code. Make sure to grant offline access.', { status: 500 });
  }

  redirect('/admin');
}
