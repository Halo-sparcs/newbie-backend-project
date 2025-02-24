import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { createReviewDto, updateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private reviewRepository: ReviewRepository) {}

  async createReview(user_id: number, createReviewDto: createReviewDto) {
    return this.reviewRepository.createReview(user_id, createReviewDto);
  }

  async updateReview(user_id: number, id: number, updateReviewDto: updateReviewDto) {
    const review = await this.existenceChecker(id);
    if (review.reviewer_id !== user_id) {
      throw new ForbiddenException("You don't have permission to update review");
    }
    return this.reviewRepository.updateReview(id, updateReviewDto);
  }

  async deleteReview(user_id: number, review_id: number) {
    const review = await this.existenceChecker(review_id);
    if (review.reviewer_id !== user_id) {
      throw new ForbiddenException("You don't have permission to delete review");
    }
    return this.reviewRepository.deleteReview(review_id);
  }

  async getById(review_id: number) {
    return this.reviewRepository.getById(review_id);
  }

  async existenceChecker(review_id: number) {
    const review = await this.getById(review_id);
    if (review === null) {
      throw new NotFoundException('No review found');
    }
    return review;
  }

  async getByReviewerId(last_id: number, reviewer_id: number) {
    return this.reviewRepository.getByReviewerUserID(last_id, reviewer_id);
  }

  async getByTargetId(last_id: number, target_id: number) {
    return this.reviewRepository.getByTargetUserID(last_id, target_id);
  }
}
