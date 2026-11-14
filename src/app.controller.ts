import { Controller, Get, Redirect } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Redirect('/graphql')
  root(): void {}

  @Get('health')
  async health(): Promise<{ status: string }> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
