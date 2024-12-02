import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
// import { Review } from '@prisma/client';
import { createReviewDto, updateReviewDto } from './review.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(createReviewDto: createReviewDto) {
    return this.prisma.review.create({
      data: {
        log_id: createReviewDto.log_id,
        rate: createReviewDto.rate,
        comment: createReviewDto.comment,
        reviewer_id: createReviewDto.reviewer_id,
        target_id: createReviewDto.target_id,
      },
      include: {
        log: true,
        reviewer: true,
        target: true,
      },
    });
  }

  async updateReview(id: number, updateReviewDto: updateReviewDto) {
    this.prisma.review.update({
      where: {
        id: id,
      },
      data: {
        rate: updateReviewDto.rate,
        comment: updateReviewDto.comment,
      },
    });
  }

  async deleteReview(review_id: number) {
    this.prisma.review.delete({
      where: {
        id: review_id,
      },
    });
  }

  async getById(id: number) {
    return this.prisma.review.findUnique({
      where: {
        id: id,
      },
    });
  }

  async getByTargetUserID(user_id: number) {
    return this.prisma.review.findMany({
      where: {
        target_id: user_id,
      },
    });
  }

  async getByReviewerUserID(user_id: number) {
    return this.prisma.review.findMany({
      where: {
        reviewer_id: user_id,
      },
    });
  }
}
