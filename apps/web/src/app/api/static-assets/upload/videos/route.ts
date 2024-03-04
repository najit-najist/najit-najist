import { UserRoles } from '@najit-najist/api';
import { getLoggedInUser } from '@najit-najist/api/server';
import fs from 'fs-extra';
import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('contents') as unknown as File;
  const root = data.get('root')?.toString() || '/';

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const user = await getLoggedInUser();

  if (!user || user.role !== UserRoles.ADMIN) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await fs.outputFile(
    path.join(
      process.cwd(),
      'shared-static-assets',
      'videos',
      ...root.split('/').filter(Boolean),
      file.name
    ),
    buffer
  );

  return NextResponse.json({ success: true });
}
