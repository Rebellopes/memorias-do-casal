import { NextResponse } from 'next/server';
import { syncGooglePhotos } from '@/lib/google-photos';

export async function POST() {
  const result = await syncGooglePhotos();
  return NextResponse.json(result);
}
