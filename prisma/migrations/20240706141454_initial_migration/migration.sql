-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameMembership" (
    "gameId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameMembership_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");
