import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id } = await params;
  const status = body?.status;

  if (status !== 'approved' && status !== 'pending') {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedUser);
}
