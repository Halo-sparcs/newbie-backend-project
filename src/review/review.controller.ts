import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthorGuard } from '../auth/guards/authorGuard.guard';
import { IsUserGuard } from '../auth/guards/isUser.guard';
import { ReviewService } from './review.service';
import { createReviewDto, updateReviewDto } from './review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(IsUserGuard)
  @Post()
  createReview(@Body() createReviewDto: createReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get('reviewerid/:reviewerId')
  findByReviewerId(@Param('reviewerId') reviewerId: number) {
    return this.reviewService.getByReviewerId(reviewerId);
  }

  @Get('targetid/:targetId')
  findByTargetId(@Param('targetId') targetId: number) {
    return this.reviewService.getByTargetId(targetId);
  }

  @UseGuards(AuthorGuard)
  @SetMetadata('resourceType', 'review')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: updateReviewDto) {
    return this.reviewService.updateReview(+id, updateReviewDto);
  }

  @UseGuards(AuthorGuard)
  @SetMetadata('resourceType', 'review')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.deleteReview(+id);
  }
}
