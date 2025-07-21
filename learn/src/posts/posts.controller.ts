import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
findOne(@Param('id') id: string) {
  const postId = parseInt(id, 10);
  const post = this.postsService.findOne(postId);
  if (!post) throw new NotFoundException('Post nt found');
  return post;
}

 @Post()
create(@Body() createPostDto: CreatePostDto) {
  return this.postsService.create(createPostDto);
}

@Put(':id')
update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  return this.postsService.update(+id, updatePostDto);
}

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(Number(id));
  }
}
