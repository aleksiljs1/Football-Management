-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_jerseyNumber_key" ON "Player"("jerseyNumber");
