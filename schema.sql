import { NextResponse } from 'next/server';
import { getGalleryImages } from '@/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') ?? undefined;
  const take = Math.min(Number(searchParams.get('take') ?? 60), 120);
  const images = getGalleryImages({ category, take });
  return NextResponse.json({ images });
}
