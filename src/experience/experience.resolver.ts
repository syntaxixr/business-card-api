import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Experience, Project } from '@prisma/client';
import type { GqlContext } from '../loaders/loaders.service';
import { ProjectModel } from '../projects/project.model';
import { ExperienceModel, PeriodModel } from './experience.model';
import { ExperienceService, Period } from './experience.service';

@Resolver(() => ExperienceModel)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @ResolveField(() => PeriodModel)
  period(@Parent() experience: Experience): Period {
    return this.experienceService.getPeriod(experience);
  }

  @ResolveField(() => [ProjectModel])
  projects(@Parent() experience: Experience, @Context() { loaders }: GqlContext): Promise<Project[]> {
    return loaders.projectsByExperience.load(experience.id);
  }
}
