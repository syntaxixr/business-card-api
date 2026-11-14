import { Module } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  providers: [ProjectsRepository, ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
