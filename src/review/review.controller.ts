import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Request,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { IsUserGuard } from '../auth/guards/isUser.guard';
import { ReviewService } from './review.service';
import { createReviewDto, updateReviewDto } from './review.dto';

export const SetField = (fieldName: string) => SetMetadata('fieldName', fieldName);

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(IsUserGuard)
  @Post('create')
  createReview(@Request() req, @Body() createReviewDto: createReviewDto) {
    return this.reviewService.createReview(Number(req.user.user_id), createReviewDto);
  }

  @UseGuards(IsUserGuard)
  @SetField('reviewerId')
  @Get('reviewerid/:reviewerId/:last_id')
  findByReviewerId(
    @Param('reviewerId') reviewerId: number,
    @Param('last_id') last_id: number) {
    return this.reviewService.getByReviewerId(+last_id, +reviewerId);
  }

  @UseGuards(IsUserGuard)
  @SetField('targetId')
  @Get('targetid/:targetId/:last_id')
  findByTargetId(
    @Param('targetId') targetId: number,
    @Param('last_id') last_id: number) {
    return this.reviewService.getByTargetId(+last_id, +targetId);
  }

  @UseGuards(IsUserGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: updateReviewDto, @Request() req ) {
    return this.reviewService.updateReview(Number(req.user.user_id), +id, updateReviewDto);
  }

  @UseGuards(IsUserGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.reviewService.deleteReview(Number(req.user.user_id), +id);
  }
}
