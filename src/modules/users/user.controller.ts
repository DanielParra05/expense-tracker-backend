import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { UserResponseDto } from './dto/user-response.dto';
import { userMapper } from './user.mapper';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(dto);
    return userMapper.toResponse(user);
  }

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userService.findAll();
    return users.map((user) => userMapper.toResponse(user));
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return userMapper.toResponse(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, dto);
    return userMapper.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
