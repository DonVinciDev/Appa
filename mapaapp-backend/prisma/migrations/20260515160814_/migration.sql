/*
  Warnings:

  - You are about to drop the column `geometry` on the `areas` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "areas_geometry_idx";

-- AlterTable
ALTER TABLE "areas" DROP COLUMN "geometry";
