import { ObjectType, Field, Int, Directive} from '@nestjs/graphql';
import { Playlist } from './playlist.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Users{

    @Field((type) => Int)
    @Directive('@external')
    id: number;

    @Field((type) => [Playlist])
    playlists?: Playlist[];
}
    

