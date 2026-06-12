import { redirect } from 'next/navigation';
import { getGoogleAuthUrl } from '@/lib/google-photos';

export async function GET(request: Request) {
  const siteUrl = new URL(request.url).origin;
  redirect(getGoogleAuthUrl(siteUrl));
}
