import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { createReviewDto, updateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private reviewRepository: ReviewRepository) {}

  async createReview(createReviewDto: createReviewDto) {
    return this.reviewRepository.createReview(createReviewDto);
  }

  async updateReview(id: number, updateReviewDto: updateReviewDto) {
    await this.existenceChecker(id);
    return this.reviewRepository.updateReview(id, updateReviewDto);
  }

  async deleteReview(review_id: number) {
    await this.existenceChecker(review_id);
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
  }

  async getByReviewerId(reviewer_id: number) {
    return this.reviewRepository.getByReviewerUserID(reviewer_id);
  }

  async getByTargetId(target_id: number) {
    return this.reviewRepository.getByTargetUserID(target_id);
  }
}
