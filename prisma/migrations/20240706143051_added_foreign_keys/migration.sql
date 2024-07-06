-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameMembership" ADD CONSTRAINT "GameMembership_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
