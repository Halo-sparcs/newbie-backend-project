import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './users.dto';
import { IsUserGuard } from '../auth/guards/isUser.guard';
import { Logger } from '@nestjs/common';

const logger = new Logger('UsersController');

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('All')
  async getAll() {
    try {
      logger.log('I got it');
      return await this.usersService.getAll();
    } catch (error) {
      console.error('Error occurred in getAll:', error);
      throw error;
    }
  }

  @Get('byname/:user_name')
  async getByUsername(@Param('user_name') user_name: string) {
    logger.log(user_name);
    return this.usersService.getByName(user_name);
  }

  @Get('byuser_id/:user_id')
  async getByUserId(@Param('user_id') user_id: string) {
    return this.usersService.getByUserId(user_id);
  }

  @Get(':id')
  @UseGuards(IsUserGuard)
  async getById(@Param('id') id: number) {
    return this.usersService.getById(Number(id));
  }

  @Put('update/:id')
  @UseGuards(IsUserGuard)
  async updateUser(@Param('id') id: number, @Body() updateData: createUserDto) {
    await this.usersService.updateUser(id, updateData);
  }
}
