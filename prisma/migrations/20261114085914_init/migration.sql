-- CreateEnum
CREATE TYPE "LinkKind" AS ENUM ('GITHUB', 'LINKEDIN', 'TELEGRAM', 'WEBSITE', 'EMAIL', 'OTHER');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('LANGUAGE', 'BACKEND', 'DATABASE', 'DEVOPS', 'FRONTEND');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "kind" "LinkKind" NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "level" "SkillLevel" NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "summary" TEXT,
    "achievements" TEXT[],
    "startedAt" DATE NOT NULL,
    "endedAt" DATE,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "experienceId" INTEGER,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "repositoryUrl" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSkill" (
    "projectId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("projectId","skillId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE INDEX "Link_profileId_position_idx" ON "Link"("profileId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Link_profileId_url_key" ON "Link"("profileId", "url");

-- CreateIndex
CREATE INDEX "Skill_profileId_position_idx" ON "Skill"("profileId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_name_key" ON "Skill"("profileId", "name");

-- CreateIndex
CREATE INDEX "Experience_profileId_startedAt_idx" ON "Experience"("profileId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_profileId_company_startedAt_key" ON "Experience"("profileId", "company", "startedAt");

-- CreateIndex
CREATE INDEX "Project_profileId_position_idx" ON "Project"("profileId", "position");

-- CreateIndex
CREATE INDEX "Project_experienceId_idx" ON "Project"("experienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_profileId_name_key" ON "Project"("profileId", "name");

-- CreateIndex
CREATE INDEX "ProjectSkill_skillId_idx" ON "ProjectSkill"("skillId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
