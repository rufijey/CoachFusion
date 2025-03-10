import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {plainToClass, plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {ValidationException} from "../exceptions/validation.exception";


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!metadata.metatype) {
            return value;
        }
        const obj = plainToInstance(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length) {
            const messages = errors.map(err => {
                const constraints = err.constraints ? Object.values(err.constraints).join(', ') : 'Unknown validation error';
                return `${err.property} - ${constraints}`;
            });
            throw new ValidationException(messages)
        }
        return value;
    }

}