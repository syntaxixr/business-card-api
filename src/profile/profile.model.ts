import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '@prisma/client';

registerEnumType(LinkKind, { name: 'LinkKind' });

@ObjectType('Link')
export class LinkModel {
  @Field(() => ID)
  id: number;

  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  label: string;

  @Field()
  url: string;
}

@ObjectType('Profile')
export class ProfileModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  headline: string;

  @Field()
  description: string;

  @Field(() => String, { nullable: true })
  location: string | null;
}
