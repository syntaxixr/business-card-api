import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { profile as data } from '../prisma/profile.data';
import { seedProfile } from '../prisma/seed';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { SANDBOX_QUERY } from '../src/sandbox-query';

interface ProfileResponse {
  data: {
    profile: {
      name: string;
      skills: { name: string }[];
      experience: { company: string; period: { isCurrent: boolean }; projects: { name: string }[] }[];
      projects: { name: string; stack: { name: string }[] }[];
    };
  };
}

describe('profile query (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    await seedProfile(prisma, data);
  });

  afterAll(async () => {
    await app.close();
  });

  const query = async (): Promise<ProfileResponse> => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: SANDBOX_QUERY })
      .expect(200);
    return response.body as ProfileResponse;
  };

  it('returns the profile with nested data', async () => {
    const { profile } = (await query()).data;

    expect(profile.name).toBe(data.name);
    expect(profile.skills.map((skill) => skill.name)).toEqual(data.skills.map((skill) => skill.name));
    expect(profile.experience[0].company).toBe(data.experience[0].company);
    expect(profile.experience[0].period.isCurrent).toBe(true);
    expect(profile.experience[0].projects).toHaveLength(4);
    expect(profile.projects.map((project) => project.name)).toEqual(
      data.projects.map((project) => project.name),
    );
    expect(profile.projects[0].stack.map((skill) => skill.name)).toEqual(data.projects[0].stack);
  });

  it('batches nested fields into a fixed number of SQL queries', async () => {
    let queries = 0;
    prisma.$on('query', () => queries++);

    await query();

    expect(queries).toBe(8);
  });

  it('keeps ids stable when the seed runs again', async () => {
    const before = await prisma.skill.findMany({ orderBy: { id: 'asc' } });

    await seedProfile(prisma, data);

    expect(await prisma.skill.findMany({ orderBy: { id: 'asc' } })).toEqual(before);
    expect(await prisma.project.count()).toBe(data.projects.length);
  });

  it('removes rows that are no longer in the data file', async () => {
    await seedProfile(prisma, { ...data, projects: data.projects.slice(0, 2) });
    expect(await prisma.project.count()).toBe(2);

    await seedProfile(prisma, data);
    expect(await prisma.project.count()).toBe(data.projects.length);
  });
});
