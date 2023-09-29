import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { DatabaseService } from "../database/database.service";
import { UtilsService } from "../utils/utils.service";
import { MakesServiceUtils } from "./makes.service.utils";
import type { ParsedMake, ParsedMakesResponse } from "./types/fetch-makes.type";
import { MakeDto } from "./types/make.dto";

@Injectable()
export class MakesService {
	constructor(
		private readonly configService: ConfigService,
		private readonly databaseService: DatabaseService,
		private readonly makeServiceUtils: MakesServiceUtils,
		private readonly utilsService: UtilsService
	) {}

	public async getMakes(actualize?: boolean): Promise<MakeDto[]> {
		const lastActualizationAt = await this.databaseService.actualization.findFirst({
			select: {
				date: true,
			},
			orderBy: {
				date: "desc",
			},
		});

		if (!actualize && lastActualizationAt && lastActualizationAt.date.getDate() === new Date().getDate()) {
			return await this.getMakesFromDb();
		}

		const makesResponse = await this.fetchMakes();
		const makes = makesResponse.result.slice(0, 50);
		return await this.getVehiclesTypes(makes);
	}

	private async getMakesFromDb(): Promise<MakeDto[]> {
		return this.databaseService.make.findMany({
			select: {
				makeId: true,
				makeName: true,
				vehicleTypes: {
					select: {
						typeId: true,
						typeName: true,
					},
				},
			},
		});
	}

	private async fetchMakes(): Promise<ParsedMakesResponse> {
		const res = await axios.get<string>("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML");
		if (res.status !== 200) {
			throw new Error("Unable to fetch makes from NHTSA API\n" + res.statusText);
		}

		return this.makeServiceUtils.parseMakesXmlResponse(res.data);
	}

	private async getVehiclesTypes(makes: ParsedMake[]): Promise<MakeDto[]> {
		const makesResponses: MakeDto[] = [];

		const chunks = this.utilsService.createChunks(makes, this.configService.get("MAKES_API_CHUNK_SIZE") ?? 10);
		for (const chunk of chunks) {
			const fetchResponse = await Promise.allSettled(
				chunk.map(make => axios.get<string>(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${make.makeId}?format=XML`))
			);

			for (const response of fetchResponse) {
				if (response.status === "rejected") {
					// better handling, e.g. retrying or logging
					continue;
				}

				const parsedVehicleTypes = this.makeServiceUtils.parseVehicleTypesXmlResponse(response.value.data);
				const make = chunk.find(make => make.makeId === parsedVehicleTypes.makeId);
				if (!make) {
					// make from response id not found in chunk, API mistake, because we are fetching only makes from chunk
					// better handling, e.g. logging
					continue;
				}

				const makeDto = this.makeServiceUtils.combineMakesWithTypes(make, parsedVehicleTypes.result);
				await this.saveMake(makeDto);
				makesResponses.push(makeDto);
			}
		}

		return makesResponses;
	}

	private async saveMake(make: MakeDto): Promise<void> {
		for (const type of make.vehicleTypes) {
			await this.databaseService.vehicleType.upsert({
				create: {
					typeId: type.typeId,
					typeName: type.typeName,
				},
				update: {
					typeName: type.typeName,
				},
				where: {
					typeId: type.typeId,
				},
			});
		}

		await this.databaseService.make.upsert({
			create: {
				makeId: make.makeId,
				makeName: make.makeName,
				vehicleTypesIds: {
					set: make.vehicleTypes.map(type => type.typeId),
				},
			},
			update: {
				makeName: make.makeName,
				vehicleTypesIds: {
					set: make.vehicleTypes.map(type => type.typeId),
				},
			},
			where: {
				makeId: make.makeId,
			},
		});

		await this.databaseService.actualization.create({
			data: {
				date: new Date(),
			},
		});
	}
}
