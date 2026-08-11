-- AlterTable
ALTER TABLE "Poetrys" ADD COLUMN IF NOT EXISTS "titulo" TEXT,
ADD COLUMN IF NOT EXISTS "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "poetryId" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Comment_poetryId_fkey'
  ) THEN
    ALTER TABLE "Comment" 
    ADD CONSTRAINT "Comment_poetryId_fkey" 
    FOREIGN KEY ("poetryId") REFERENCES "Poetrys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
