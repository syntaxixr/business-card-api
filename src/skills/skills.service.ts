import { Injectable } from '@nestjs/common';
import { Skill } from '@prisma/client';
import { groupByKeys } from '../common/group-by-keys';
import { SkillsRepository } from './skills.repository';

@Injectable()
export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  async findByProfiles(profileIds: readonly number[]): Promise<Skill[][]> {
    const rows = await this.repository.findByProfileIds(profileIds);
    return groupByKeys(profileIds, rows, (row) => row.profileId);
  }

  async findStackByProjects(projectIds: readonly number[]): Promise<Skill[][]> {
    const rows = await this.repository.findStackByProjectIds(projectIds);
    const groups = groupByKeys(projectIds, rows, (row) => row.projectId);
    return groups.map((group) => group.map((row) => row.skill));
  }
}
