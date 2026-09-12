import { Controller, UseFilters, UseInterceptors, UsePipes } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { GrpcExceptionFilter } from "../../infrastructure/grpc/grpc.filter.js";
import { GrpcServerInterceptor } from "../../infrastructure/grpc/grpc.server.interceptor.js";
import { InteractionService } from "./interaction.service.js";
import { GetUserActivityDto } from "./dto/get-activity.js";
import { GetUserActivityResponse } from "@juice11-micro/contracts";
import { MyValidationPipe } from "../../shared/utils/validate-dto.js";

@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcServerInterceptor)
@UsePipes(MyValidationPipe)
@Controller()
export class InteractionController {

  constructor(private readonly service: InteractionService) { }

  @GrpcMethod('InteractionService', 'GetUserActivity')
  async findByUser(data: GetUserActivityDto): Promise<GetUserActivityResponse> {
    const logs = await this.service.findByUser(data.userId, data.limit);
    return { logs};
  }
}
