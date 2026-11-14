import { Injectable, NotFoundException } from '@nestjs/common';
import { Link, Profile } from '@prisma/client';
import { groupByKeys } from '../common/group-by-keys';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  async getProfile(): Promise<Profile> {
    const profile = await this.repository.findFirst();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async findLinksByProfiles(profileIds: readonly number[]): Promise<Link[][]> {
    const rows = await this.repository.findLinksByProfileIds(profileIds);
    return groupByKeys(profileIds, rows, (row) => row.profileId);
  }
}
