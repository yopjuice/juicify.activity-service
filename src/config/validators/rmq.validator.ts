import { IsNumber, IsString } from 'class-validator';

export class RmqValidator {
  @IsString()
  RMQ_HOST: string;

  @IsNumber()
  RMQ_PORT: number;
}
