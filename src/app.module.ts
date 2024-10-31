import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ArticleModule,
    CommentModule,
    LikeModule,
    JwtModule.register({
      secret: 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AppModule {}
