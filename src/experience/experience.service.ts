import { Injectable } from '@nestjs/common';
import { Experience } from '@prisma/client';
import { groupByKeys } from '../common/group-by-keys';
import { ExperienceRepository } from './experience.repository';

export interface Period {
  start: string;
  end: string | null;
  isCurrent: boolean;
  months: number;
}

@Injectable()
export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  async findByProfiles(profileIds: readonly number[]): Promise<Experience[][]> {
    const rows = await this.repository.findByProfileIds(profileIds);
    return groupByKeys(profileIds, rows, (row) => row.profileId);
  }

  getPeriod({ startedAt, endedAt }: Pick<Experience, 'startedAt' | 'endedAt'>, now = new Date()): Period {
    const until = endedAt ?? now;
    const months =
      (until.getUTCFullYear() - startedAt.getUTCFullYear()) * 12 +
      (until.getUTCMonth() - startedAt.getUTCMonth()) +
      1;

    return {
      start: formatMonth(startedAt),
      end: endedAt ? formatMonth(endedAt) : null,
      isCurrent: endedAt === null,
      months,
    };
  }
}

function formatMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}
