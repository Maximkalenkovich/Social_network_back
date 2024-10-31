import { IsNumber } from 'class-validator';

export class LikeDto {
    @IsNumber()
    id: number;

    @IsNumber()
    targetId: number; // articleId or commentId
}
