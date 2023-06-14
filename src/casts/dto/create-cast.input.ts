import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsString } from "class-validator";

@InputType()
export class CreateCastInput{
    @IsInt()
    @Field()
    cast_id: number;

    @IsInt()
    @Field()
    idActor: number;

    @IsInt()
    @Field()
    nameActor: string;

    @IsString()
    @Field()
    character: string
}