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
                const message = err.constraints ? Object.values(err.constraints)[0] : 'Unknown validation error';
                return {
                    field: err.property,
                    message: message
                };
            });
            throw new ValidationException(messages);
        }
        return value;
    }
}
