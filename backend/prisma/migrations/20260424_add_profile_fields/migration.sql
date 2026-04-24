-- AlterTable: add personal fields to profiles
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cpf" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "birth_date" TIMESTAMP(3);
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "gender" TEXT;
