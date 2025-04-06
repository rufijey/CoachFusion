import {Module} from '@nestjs/common';
import {PortfoliosService} from './portfolios.service';
import {ImagesModule} from "../images/images.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PortfolioItem} from "./portfolio-item.entity";
import {PortfoliosController} from './portfolios.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
    providers: [PortfoliosService],
    imports: [
        TypeOrmModule.forFeature([PortfolioItem]),
        ImagesModule,
        AuthModule
    ],
    controllers: [PortfoliosController],
    exports: [PortfoliosService],
})
export class PortfoliosModule {
}
