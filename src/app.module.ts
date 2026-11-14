import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { ExperienceModule } from './experience/experience.module';
import { LoadersModule } from './loaders/loaders.module';
import { GqlContext, LoadersService } from './loaders/loaders.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectsModule } from './projects/projects.module';
import { SANDBOX_QUERY } from './sandbox-query';
import { SkillsModule } from './skills/skills.module';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProfileModule,
    SkillsModule,
    ExperienceModule,
    ProjectsModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [LoadersModule],
      inject: [LoadersService],
      useFactory: (loaders: LoadersService) => ({
        autoSchemaFile: isProduction || join(process.cwd(), 'schema.gql'),
        sortSchema: true,
        introspection: true,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true, document: SANDBOX_QUERY })],
        context: (): GqlContext => ({ loaders: loaders.create() }),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
