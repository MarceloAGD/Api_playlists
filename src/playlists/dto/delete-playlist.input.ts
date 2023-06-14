import { Field, InputType } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@InputType()
export class deletePlaylistInput{
    @IsInt()
    @Field()
    idPlaylist: number;

    @IsInt()
    @Field()
    idUser: number;
}