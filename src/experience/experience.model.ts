import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Period')
export class PeriodModel {
  @Field({ description: 'YYYY-MM' })
  start: string;

  @Field(() => String, { nullable: true, description: 'YYYY-MM, null for the current job' })
  end: string | null;

  @Field()
  isCurrent: boolean;

  @Field(() => Int)
  months: number;
}

@ObjectType('Experience')
export class ExperienceModel {
  @Field(() => ID)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field(() => String, { nullable: true })
  summary: string | null;

  @Field(() => [String])
  achievements: string[];
}
