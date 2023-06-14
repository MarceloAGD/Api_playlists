import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsString } from "class-validator";

@InputType()
export class CreateActorInput{
    @IsInt()
    @Field()
    id: number;

    @IsString()
    @Field()
    name: string;

}
