import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PostService } from '../../post/post.service';
import { ReviewService } from '../../review/review.service';
import { LogService } from '../../log/log.service';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthorGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly postService: PostService,
    private readonly reviewService: ReviewService,
    private readonly logService: LogService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    if (!resourceId || !user) {
      throw new ForbiddenException('유효하지 않은 요청입니다.');
    }

    const resourceType = this.reflector.get<string>(
      'resourceType',
      context.getHandler(),
    );
    if (!resourceType) {
      throw new ForbiddenException('리소스 타입이 지정되지 않았습니다.');
    }

    const resourceService = this.getResourceService(resourceType);
    if (!resourceService) {
      throw new ForbiddenException('잘못된 리소스 요청입니다.');
    }

    const resource = await this.getOwner(resourceType, resourceId);
    if (resource !== user.id) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }

  handleRequest(err, user, info) {
    // Handle any authentication errors
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  private getResourceService(resourceType: string) {
    switch (resourceType) {
      case 'post':
        return this.postService;
      case 'review':
        return this.reviewService;
      case 'log':
        return this.logService;
      default:
        return null;
    }
  }

  private async getOwner(resourceType: string, id: number) {
    switch (resourceType) {
      case 'post': {
        const post = await this.postService.getById(id);
        if (post === null) {
          throw new NotFoundException('resource not found');
        }
        return post.ownerId;
      }
      case 'review': {
        const review = await this.reviewService.getById(id);
        if (review === null) {
          throw new NotFoundException('resource not found');
        }
        return review.reviewer_id;
      }
      case 'log': {
        // at Return -> only owner of post can do this
        const log = await this.logService.getById(id);
        if (log === null) {
          throw new NotFoundException('resource not found');
        }
        const post = await this.postService.getById(log.post_id);
        return post.ownerId;
      }
    }
  }
}
