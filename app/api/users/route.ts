import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const allowedStatuses = ['approved', 'pending'] as const;

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== 'admin@test.com') {
    return NextResponse.json({ message: '권한이 없습니다.' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const unauthorized = await ensureAdmin();
    if (unauthorized) {
      return unauthorized;
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ message: '사용자 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = await ensureAdmin();
    if (unauthorized) {
      return unauthorized;
    }

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      status?: string;
      isPublic?: boolean;
      role?: string;
    };

    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json({ message: 'name, email은 필수입니다.' }, { status: 400 });
    }

    const status = body.status ?? 'pending';
    const isPublic = body.isPublic ?? false;
    const role = body.role?.trim() || 'member';

    if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
      return NextResponse.json({ message: 'status는 approved 또는 pending만 허용됩니다.' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        status,
        isPublic,
        role,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ message: '사용자 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
