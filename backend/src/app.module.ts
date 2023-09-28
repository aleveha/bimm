import { Module } from "@nestjs/common";
import { MakesModule } from "./makes/makes.module";
import { UtilsModule } from "./utils/utils.module";

@Module({
	imports: [MakesModule, UtilsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
