import { Args, Query, Resolver } from "@nestjs/graphql";
import { MakesService } from "./makes.service";

@Resolver("Make")
export class MakesResolver {
	constructor(private readonly makesService: MakesService) {}

	@Query("makes")
	async makes(@Args("actualize") actualize?: boolean) {
		return this.makesService.getMakes(actualize);
	}
}
