import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { MakesModule } from "./makes/makes.module";
import { UtilsModule } from "./utils/utils.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, MakesModule, UtilsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
