import { Injectable } from '@nestjs/common';
import { Experience, Link, Project, Skill } from '@prisma/client';
import DataLoader from 'dataloader';
import { ExperienceService } from '../experience/experience.service';
import { ProfileService } from '../profile/profile.service';
import { ProjectsService } from '../projects/projects.service';
import { SkillsService } from '../skills/skills.service';

export interface Loaders {
  linksByProfile: DataLoader<number, Link[]>;
  skillsByProfile: DataLoader<number, Skill[]>;
  experienceByProfile: DataLoader<number, Experience[]>;
  projectsByProfile: DataLoader<number, Project[]>;
  projectsByExperience: DataLoader<number, Project[]>;
  stackByProject: DataLoader<number, Skill[]>;
}

export interface GqlContext {
  loaders: Loaders;
}

@Injectable()
export class LoadersService {
  constructor(
    private readonly profile: ProfileService,
    private readonly skills: SkillsService,
    private readonly experience: ExperienceService,
    private readonly projects: ProjectsService,
  ) {}

  create(): Loaders {
    return {
      linksByProfile: new DataLoader((ids) => this.profile.findLinksByProfiles(ids)),
      skillsByProfile: new DataLoader((ids) => this.skills.findByProfiles(ids)),
      experienceByProfile: new DataLoader((ids) => this.experience.findByProfiles(ids)),
      projectsByProfile: new DataLoader((ids) => this.projects.findByProfiles(ids)),
      projectsByExperience: new DataLoader((ids) => this.projects.findByExperiences(ids)),
      stackByProject: new DataLoader((ids) => this.skills.findStackByProjects(ids)),
    };
  }
}
