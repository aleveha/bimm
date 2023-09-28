import { Module } from "@nestjs/common";
import { UtilsModule } from "../utils/utils.module";
import { MakesController } from "./makes.controller";
import { MakesService } from "./makes.service";
import { MakesServiceUtils } from "./makes.service.utils";

@Module({
	imports: [UtilsModule],
	controllers: [MakesController],
	providers: [MakesService, MakesServiceUtils],
})
export class MakesModule {}
