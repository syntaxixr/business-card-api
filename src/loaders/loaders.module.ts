import { Module } from '@nestjs/common';
import { ExperienceModule } from '../experience/experience.module';
import { ProfileModule } from '../profile/profile.module';
import { ProjectsModule } from '../projects/projects.module';
import { SkillsModule } from '../skills/skills.module';
import { LoadersService } from './loaders.service';

@Module({
  imports: [ProfileModule, SkillsModule, ExperienceModule, ProjectsModule],
  providers: [LoadersService],
  exports: [LoadersService],
})
export class LoadersModule {}
