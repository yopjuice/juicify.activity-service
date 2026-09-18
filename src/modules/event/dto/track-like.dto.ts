import { IsUUID, IsNotEmpty } from 'class-validator';

export class TrackLikeEventDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  trackId: string;
}
