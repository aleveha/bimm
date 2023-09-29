import { Controller, Get, Query } from "@nestjs/common";
import { MakesService } from "./makes.service";

@Controller("makes")
export class MakesController {
	constructor(private readonly makeService: MakesService) {}

	@Get()
	getAll(@Query("actualize") actualize?: boolean) {
		return this.makeService.getMakes(actualize);
	}
}
