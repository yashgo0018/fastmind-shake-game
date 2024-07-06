import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// const bodySchema = z.object({
//   startTime: z.number().int().gt(0),
//   endTime: z.number().int().gt(0),
// });

export const POST = async (req: NextRequest) => {
  // let body: typeof bodySchema._type;

  // try {
  //   const { data, error, success } = bodySchema.safeParse(await req.json());
  //   if (!success) {
  //     return NextResponse.json(
  //       { error: "Invalid body", issues: error.issues },
  //       { status: 409 }
  //     );
  //   }

  //   body = data;
  // } catch (error) {
  //   return NextResponse.json({ error: "Invalid body" }, { status: 409 });
  // }

  const currentTimestamp = Date.now();
  const startTime = currentTimestamp + 1000 * 60 * 1;
  const endTime = currentTimestamp + 1000 * 60 * 2;

  const game = await prisma.games.create({
    data: {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

  await prisma.$disconnect();

  return NextResponse.json({ game });
};
