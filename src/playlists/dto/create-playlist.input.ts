import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsString } from "class-validator";

@InputType()
export class CreatePlaylistInput{
    @IsString()
    @Field()
    name: string;

    @IsInt()
    @Field()
    usersId: number;
    
}
