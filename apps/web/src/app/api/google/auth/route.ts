import { NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/google-photos';

export async function GET(request: Request) {
  const siteUrl = new URL(request.url).origin;
  return NextResponse.redirect(getGoogleAuthUrl(siteUrl));
}
