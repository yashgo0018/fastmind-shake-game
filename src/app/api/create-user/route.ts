import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const bodySchema = z.object({
  publicKey: z.string(),
  username: z.string(),
});

export const POST = async (req: NextRequest) => {
  let body: typeof bodySchema._type;

  try {
    const { data, error, success } = bodySchema.safeParse(await req.json());
    if (!success) {
      return NextResponse.json(
        { error: "Invalid body", issues: error.issues },
        { status: 409 }
      );
    }

    body = data;
  } catch (error) {
    return NextResponse.json({ error: "Invalid body" }, { status: 409 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: body.username },
  });

  if (existingUser && existingUser.publicKey !== body.publicKey) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  if (existingUser) {
    return NextResponse.json({ success: true }, { status: 208 });
  }

  await prisma.user.create({
    data: {
      publicKey: body.publicKey,
      username: body.username,
    },
  });

  await prisma.$disconnect();

  return NextResponse.json({ success: true });
};
