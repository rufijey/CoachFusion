import { CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {PortfoliosService} from "./portfolios.service";

@Injectable()
export class PortfolioOwnerGuard implements CanActivate {
    constructor(private portfoliosService: PortfoliosService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const portfolioId = Number(request.params.id);
        const imageIdsForDelete = request.body?.imageIdsForDelete;

        if (!portfolioId) {
            throw new NotFoundException('Portfolio ID is required');
        }

        const isOwner = await this.portfoliosService.isOwner(user.id, portfolioId);
        if (!isOwner) {
            throw new ForbiddenException('You are not the owner of this portfolio');
        }

        if (imageIdsForDelete && Array.isArray(imageIdsForDelete)) {
            const allImagesBelong = await this.portfoliosService
                .areImagesFromPortfolio(portfolioId, imageIdsForDelete);
            if (!allImagesBelong) {
                throw new ForbiddenException('Some images do not belong to this portfolio');
            }
        }

        return true;
    }
}
