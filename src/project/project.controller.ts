import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/')
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectService.createProject(dto);
  }
}
