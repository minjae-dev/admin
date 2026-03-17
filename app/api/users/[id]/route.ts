import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (body.status !== 'approved') {
      return NextResponse.json({ message: 'status는 approved만 허용됩니다.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/users/[id] error:', error);
    return NextResponse.json({ message: '사용자 상태 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
