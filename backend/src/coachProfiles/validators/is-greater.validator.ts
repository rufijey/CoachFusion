import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {CoachFilterDto} from "../dto/coach-filter.dto";

@ValidatorConstraint({ name: 'isMaxGreaterThanMin', async: false })
export class IsMaxGreaterThanMin implements ValidatorConstraintInterface {
    validate(maxExperience: number, args: ValidationArguments) {
        const dto = args.object as CoachFilterDto;
        return dto.minExperience === undefined || maxExperience > dto.minExperience;
    }

    defaultMessage(args: ValidationArguments) {
        return 'maxExperience must be greater than minExperience';
    }
}