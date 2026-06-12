import { redirect } from 'next/navigation';
import { getGoogleAuthUrl } from '@/lib/google-photos';

export async function GET() {
  redirect(getGoogleAuthUrl());
}
