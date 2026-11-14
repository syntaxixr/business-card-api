import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }

  findStackByProjectIds(projectIds: readonly number[]): Promise<{ projectId: number; skill: Skill }[]> {
    return this.prisma.projectSkill.findMany({
      where: { projectId: { in: [...projectIds] } },
      orderBy: { position: 'asc' },
      select: { projectId: true, skill: true },
    });
  }
}
