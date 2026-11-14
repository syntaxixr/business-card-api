import { Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Experience, Link, Profile, Project, Skill } from '@prisma/client';
import { ExperienceModel } from '../experience/experience.model';
import type { GqlContext } from '../loaders/loaders.service';
import { ProjectModel } from '../projects/project.model';
import { SkillModel } from '../skills/skill.model';
import { LinkModel, ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel)
  profile(): Promise<Profile> {
    return this.profileService.getProfile();
  }

  @ResolveField(() => [LinkModel])
  links(@Parent() profile: Profile, @Context() { loaders }: GqlContext): Promise<Link[]> {
    return loaders.linksByProfile.load(profile.id);
  }

  @ResolveField(() => [SkillModel])
  skills(@Parent() profile: Profile, @Context() { loaders }: GqlContext): Promise<Skill[]> {
    return loaders.skillsByProfile.load(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  experience(@Parent() profile: Profile, @Context() { loaders }: GqlContext): Promise<Experience[]> {
    return loaders.experienceByProfile.load(profile.id);
  }

  @ResolveField(() => [ProjectModel])
  projects(@Parent() profile: Profile, @Context() { loaders }: GqlContext): Promise<Project[]> {
    return loaders.projectsByProfile.load(profile.id);
  }
}
