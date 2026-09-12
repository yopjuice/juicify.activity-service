import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from '../errors/domain-errors.js';

@Injectable()
export class MyValidationPipe implements PipeTransform<any> {


  async transform(value: any, { metatype }: ArgumentMetadata) {

    // Skip validation if there's no DTO metatype assigned to the payload
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert the plain JavaScript object from gRPC into a class instance
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      // Format error messages nicely
      const errorMessages = errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; ');

      throw new ValidationError(errorMessages);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];

    if (types.includes(metatype) || metatype.name.endsWith('Context')) {
    return false;
  }
    return !types.includes(metatype);
  }
}
