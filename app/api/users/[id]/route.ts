import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const allowedStatuses = ['approved', 'pending'] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== 'admin@test.com') {
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 });
  }
  return null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await ensureAdmin();
    if (unauthorized) {
      return unauthorized;
    }

    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      status?: string;
      isPublic?: boolean;
      role?: string;
    };

    const nextData: {
      name?: string;
      email?: string;
      status?: AllowedStatus;
      isPublic?: boolean;
      role?: string;
    } = {};

    if (body.name !== undefined) {
      const trimmedName = body.name.trim();
      if (!trimmedName) {
        return NextResponse.json({ message: 'name은 비워둘 수 없습니다.' }, { status: 400 });
      }
      nextData.name = trimmedName;
    }

    if (body.email !== undefined) {
      const trimmedEmail = body.email.trim();
      if (!trimmedEmail) {
        return NextResponse.json({ message: 'email은 비워둘 수 없습니다.' }, { status: 400 });
      }
      nextData.email = trimmedEmail;
    }

    if (body.status !== undefined) {
      if (!allowedStatuses.includes(body.status as AllowedStatus)) {
        return NextResponse.json({ message: 'status는 approved 또는 pending만 허용됩니다.' }, { status: 400 });
      }
      nextData.status = body.status as AllowedStatus;
    }

    if (body.isPublic !== undefined) {
      nextData.isPublic = body.isPublic;
    }

    if (body.role !== undefined) {
      const trimmedRole = body.role.trim();
      if (!trimmedRole) {
        return NextResponse.json({ message: 'role은 비워둘 수 없습니다.' }, { status: 400 });
      }
      nextData.role = trimmedRole;
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unauthorized = await ensureAdmin();
    if (unauthorized) {
      return unauthorized;
    }

    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: '회원 삭제 완료' });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json({ message: '회원 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
