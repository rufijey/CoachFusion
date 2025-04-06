import {CoachFilterDto, SortByField, SortDirection} from './dto/coach-filter.dto';
import {Between, In, LessThanOrEqual, MoreThanOrEqual} from 'typeorm';
import {WorkMode} from './coach-profile.entity';
import {CoachFilter} from "./coach.filter";

describe('CoachFilter', () => {
    let coachFilter: CoachFilter;

    beforeEach(() => {
        coachFilter = new CoachFilter();
    });

    describe('getFilterOptions', () => {
        it('should return default options if no filters are provided', () => {
            const filterDto: CoachFilterDto = {};
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options).toEqual({
                where: {},
            });
        });

        it('should apply specialization filter', () => {
            const filterDto: CoachFilterDto = { specialization: 1 };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({
                specializations: { id: 1 },
            });
        });

        it('should apply minExperience filter', () => {
            const filterDto: CoachFilterDto = { minExperience: 2 };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({
                experience: MoreThanOrEqual(2),
            });
        });

        it('should apply maxExperience filter', () => {
            const filterDto: CoachFilterDto = { maxExperience: 5 };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({
                experience: LessThanOrEqual(5),
            });
        });

        it('should apply both minExperience and maxExperience filters', () => {
            const filterDto: CoachFilterDto = { minExperience: 2, maxExperience: 5 };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({
                experience: Between(2, 5),
            });
        });

        it('should apply city filter', () => {
            const filterDto: CoachFilterDto = { city: 'New York' };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({
                city: 'New York',
            });
        });

        it('should apply workMode filter', () => {
            const filterDto: CoachFilterDto = { workMode: WorkMode.ONLINE };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({
                workMode: In([WorkMode.ONLINE, WorkMode.BOTH]),
            });
        });

        it('should not apply workMode filter if BOTH is selected', () => {
            const filterDto: CoachFilterDto = { workMode: WorkMode.BOTH };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.where).toEqual({});
        });

        it('should apply sortBy filter with ASC direction', () => {
            const filterDto: CoachFilterDto = { sortBy: SortByField.EXPERIENCE, sortDirection: SortDirection.ASC };
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.order).toEqual({
                experience: 'ASC',
            });
        });

        it('should apply sortBy filter with DESC direction', () => {
            const filterDto: CoachFilterDto = { sortBy: SortByField.EXPERIENCE, sortDirection: SortDirection.DESC};
            const options = coachFilter.getFilterOptions(filterDto);

            expect(options.order).toEqual({
                experience: 'DESC',
            });
        });

    });
});