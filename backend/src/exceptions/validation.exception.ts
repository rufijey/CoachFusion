import {HttpException, HttpStatus} from "@nestjs/common";

export class ValidationException extends HttpException {
    messages: {field: string; message: string}[];

    constructor(response: {field: string; message: string}[]) {
        super(response, HttpStatus.BAD_REQUEST);
        this.messages = response
    }
}