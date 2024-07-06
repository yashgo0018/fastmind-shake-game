/*
  Warnings:

  - The primary key for the `GameMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GameMembership" DROP CONSTRAINT "GameMembership_pkey",
ADD CONSTRAINT "GameMembership_pkey" PRIMARY KEY ("gameId", "username");
