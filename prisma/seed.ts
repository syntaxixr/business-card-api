import { PrismaClient } from '@prisma/client';
import { profile, ProfileData } from './profile.data';

export async function seedProfile(prisma: PrismaClient, data: ProfileData): Promise<void> {
  const { slug, links, skills, experience, projects, ...fields } = data;

  await prisma.$transaction(async (tx) => {
    const { id: profileId } = await tx.profile.upsert({
      where: { slug },
      create: { slug, ...fields },
      update: fields,
    });

    for (const [position, link] of links.entries()) {
      await tx.link.upsert({
        where: { profileId_url: { profileId, url: link.url } },
        create: { ...link, profileId, position },
        update: { ...link, position },
      });
    }
    await tx.link.deleteMany({ where: { profileId, url: { notIn: links.map((l) => l.url) } } });

    const skillIds = new Map<string, number>();
    for (const [position, skill] of skills.entries()) {
      const { id } = await tx.skill.upsert({
        where: { profileId_name: { profileId, name: skill.name } },
        create: { ...skill, profileId, position },
        update: { ...skill, position },
      });
      skillIds.set(skill.name, id);
    }
    await tx.skill.deleteMany({ where: { profileId, id: { notIn: [...skillIds.values()] } } });

    const experienceIds = new Map<string, number>();
    for (const { key, startedAt, endedAt, ...rest } of experience) {
      const row = {
        ...rest,
        startedAt: new Date(startedAt),
        endedAt: endedAt ? new Date(endedAt) : null,
      };
      const { id } = await tx.experience.upsert({
        where: {
          profileId_company_startedAt: { profileId, company: row.company, startedAt: row.startedAt },
        },
        create: { ...row, profileId },
        update: row,
      });
      experienceIds.set(key, id);
    }
    await tx.experience.deleteMany({ where: { profileId, id: { notIn: [...experienceIds.values()] } } });

    for (const [position, { stack, experience: experienceKey, ...rest }] of projects.entries()) {
      const row = {
        ...rest,
        position,
        experienceId: experienceKey ? getId(experienceIds, experienceKey) : null,
      };
      const { id: projectId } = await tx.project.upsert({
        where: { profileId_name: { profileId, name: row.name } },
        create: { ...row, profileId },
        update: row,
      });
      await tx.projectSkill.deleteMany({ where: { projectId } });
      await tx.projectSkill.createMany({
        data: stack.map((name, i) => ({ projectId, skillId: getId(skillIds, name), position: i })),
      });
    }
    await tx.project.deleteMany({ where: { profileId, name: { notIn: projects.map((p) => p.name) } } });
  });
}

function getId(ids: Map<string, number>, key: string): number {
  const id = ids.get(key);
  if (id === undefined) {
    throw new Error(`"${key}" is referenced in profile.data.ts but not defined`);
  }
  return id;
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedProfile(prisma, profile)
    .then(() => console.log(`Seeded profile "${profile.slug}"`))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
