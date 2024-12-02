import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './users.dto';
import { IsUserGuard } from '../auth/guards/isUser.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(IsUserGuard)
  @Get(':id')
  async getById(@Param() id: number) {
    return await this.usersService.getById(id);
  }

  @Get('byname/:user_name')
  async getByUsername(@Param() user_name: string) {
    return await this.usersService.getByName(user_name);
  }

  @Get('all')
  async getAll() {
    console.log("I got it");
    return await this.usersService.getAll();
  }

  @UseGuards(IsUserGuard)
  @Put('update/:id')
  async updateUser(@Param() id: number, @Body() updateData: createUserDto) {
    await this.usersService.updateUser(id, updateData);
  }
}
