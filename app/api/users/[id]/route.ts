import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

const allowedStatuses = ['approved', 'pending'] as const;
const allowedProfileVisibilities = ['members_only', 'partial_private', 'admin_approval'] as const;

type AllowedStatus = (typeof allowedStatuses)[number];
type AllowedProfileVisibility = (typeof allowedProfileVisibilities)[number];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      status?: string;
      profileVisibility?: string;
    };

    const nextData: {
      status?: AllowedStatus;
      profileVisibility?: AllowedProfileVisibility;
    } = {};

    if (body.status !== undefined) {
      if (!allowedStatuses.includes(body.status as AllowedStatus)) {
        return NextResponse.json({ message: 'status는 approved 또는 pending만 허용됩니다.' }, { status: 400 });
      }
      nextData.status = body.status as AllowedStatus;
    }

    if (body.profileVisibility !== undefined) {
      if (!allowedProfileVisibilities.includes(body.profileVisibility as AllowedProfileVisibility)) {
        return NextResponse.json(
          { message: 'profileVisibility는 members_only, partial_private, admin_approval만 허용됩니다.' },
          { status: 400 },
        );
      }
      nextData.profileVisibility = body.profileVisibility as AllowedProfileVisibility;
    }

    if (Object.keys(nextData).length === 0) {
      return NextResponse.json({ message: '수정할 필드가 없습니다.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: nextData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/users/[id] error:', error);
    return NextResponse.json({ message: '사용자 상태 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
