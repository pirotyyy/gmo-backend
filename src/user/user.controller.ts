import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Msg } from 'src/models/res.model';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async create(@Body() dto: CreateUserDto): Promise<Msg> {
    return this.userService.create(dto);
  }

  @Get('/:userId')
  async getById(@Param('userId') userId: string): Promise<any> {
    return this.userService.getById(userId);
  }
}
