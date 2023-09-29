import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MakesModule } from "./makes/makes.module";
import { UtilsModule } from "./utils/utils.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), MakesModule, UtilsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
