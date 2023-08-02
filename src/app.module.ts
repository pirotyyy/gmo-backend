import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { TemplateModule } from './template/template.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ProjectModule, UserModule, TemplateModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, ProjectService],
})
export class AppModule {}
