import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavsModule,
    DatabaseModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
