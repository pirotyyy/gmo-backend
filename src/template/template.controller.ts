import { Body, Controller, Get, Post } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/template.dto';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/')
  async create(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  @Get('/all')
  async getAll() {
    return this.templateService.getAll();
  }
}
