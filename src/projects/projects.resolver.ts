import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Project, Skill } from '@prisma/client';
import type { GqlContext } from '../loaders/loaders.service';
import { SkillModel } from '../skills/skill.model';
import { ProjectModel } from './project.model';

@Resolver(() => ProjectModel)
export class ProjectsResolver {
  @ResolveField(() => [SkillModel])
  stack(@Parent() project: Project, @Context() { loaders }: GqlContext): Promise<Skill[]> {
    return loaders.stackByProject.load(project.id);
  }
}
