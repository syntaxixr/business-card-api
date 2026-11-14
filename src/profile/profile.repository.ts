import { Injectable } from '@nestjs/common';
import { Link, Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findFirst(): Promise<Profile | null> {
    return this.prisma.profile.findFirst({ orderBy: { id: 'asc' } });
  }

  findLinksByProfileIds(profileIds: readonly number[]): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: { position: 'asc' },
    });
  }
}
