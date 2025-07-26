import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    private dataSource: DataSource
  ) {}

  findAll() {
    return this.postsRepository.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: CreatePostDto) {
    const user = await this.dataSource.getRepository(User).findOneBy({ id: data.userId });
    if (!user) throw new NotFoundException('User not found');

    const post = this.postsRepository.create({
      title: data.title,
      content: data.content,
      user,
    });

    return this.postsRepository.save(post);
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) throw new NotFoundException('Post not found');

    if (data.userId) {
      const user = await this.dataSource.getRepository(User).findOneBy({ id: data.userId });
      if (!user) throw new NotFoundException('User not found');
      post.user = user;
    }

    post.title = data.title ?? post.title;
    post.content = data.content ?? post.content;

    return this.postsRepository.save(post);
  }

  async remove(id: number) {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Post not found');
    return { message: 'Post deleted' };
  }
}
