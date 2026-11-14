import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger('Prisma');

  constructor(config: ConfigService) {
    super({ log: [{ emit: 'event', level: 'query' }] });
    if (config.get('LOG_QUERIES') === 'true') {
      this.$on('query', (e) => this.logger.debug(`${e.query} ${e.params} (${e.duration} ms)`));
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
