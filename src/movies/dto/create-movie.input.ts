import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsString } from "class-validator";

@InputType()
export class CreateNovieInput{
    @IsInt()
    @Field()
    id: number;

    @IsString()
    @Field()
    title: string;

    @IsString()
    @Field()
    poster_path: string;

    @IsString()
    @Field()
    overview: string;

}