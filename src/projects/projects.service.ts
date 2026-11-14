import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { groupByKeys } from '../common/group-by-keys';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectsRepository) {}

  async findByProfiles(profileIds: readonly number[]): Promise<Project[][]> {
    const rows = await this.repository.findByProfileIds(profileIds);
    return groupByKeys(profileIds, rows, (row) => row.profileId);
  }

  async findByExperiences(experienceIds: readonly number[]): Promise<Project[][]> {
    const rows = await this.repository.findByExperienceIds(experienceIds);
    return groupByKeys(experienceIds, rows, (row) => row.experienceId);
  }
}
