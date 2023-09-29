import { Controller, Get, Query } from "@nestjs/common";
import { MakesService } from "./makes.service";

@Controller("makes")
export class MakesController {
	constructor(private readonly makeService: MakesService) {}

	@Get()
	getAll(@Query("source") source?: string) {
		if (source === "db") {
			return this.makeService.getMakesFromDb();
		}

		return this.makeService.getMakes();
	}
}
