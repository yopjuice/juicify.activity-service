import { IsNumber, IsUUID } from "class-validator";

export class GetUserActivityDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  limit: number;
}
