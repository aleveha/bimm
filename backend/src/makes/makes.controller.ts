import { Controller, Get } from "@nestjs/common";
import { MakesService } from "./makes.service";

@Controller("makes")
export class MakesController {
	constructor(private readonly makeService: MakesService) {}

	@Get()
	getAll() {
		return this.makeService.getMakes();
	}
}
