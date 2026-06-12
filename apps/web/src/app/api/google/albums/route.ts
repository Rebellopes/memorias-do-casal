import { NextResponse } from 'next/server';
import { listAlbums } from '@/lib/google-photos';

export async function GET() {
  const result = await listAlbums();
  return NextResponse.json(result);
}
