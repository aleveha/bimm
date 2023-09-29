import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { UtilsService } from "../utils/utils.service";
import { MakesServiceUtils } from "./makes.service.utils";
import type { MakeType, MakeTypesResponse } from "./types/fetch-make-type.type";
import type { Make } from "./types/fetch-makes.type";
import { MakesResponse } from "./types/fetch-makes.type";
import { MakesDto, VehicleType } from "./types/makes.dto";

@Injectable()
export class MakesService {
	constructor(
		private readonly configService: ConfigService,
		private readonly makeServiceUtils: MakesServiceUtils,
		private readonly utilsService: UtilsService
	) {}

	public async getMakes() {
		const makesResponse = await this.fetchMakes();
		const makes = makesResponse.Response.Results.AllVehicleMakes.slice(0, 1000);
		const makeTypes = await this.fetchAllMakesTypes(makes);
		return this.combineMakesWithTypes(makes, makeTypes);
	}

	private async fetchMakes() {
		const res = await axios.get<string>("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML");
		if (res.status !== 200) {
			throw new Error("Unable to fetch makes from NHTSA API\n" + res.statusText);
		}

		return this.parseMakesXmlResponse(res.data);
	}

	private async fetchAllMakesTypes(makes: Make[]) {
		const fulFilledResponses: MakeTypesResponse[] = [];

		const chunks = this.utilsService.createChunks(makes, this.configService.get("MAKES_API_CHUNK_SIZE") ?? 10);
		for (const chunk of chunks) {
			const fetchResponse = await Promise.allSettled(
				chunk.map(make => axios.get<string>(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${make.Make_ID}?format=XML`))
			);

			for (const response of fetchResponse) {
				if (response.status === "rejected") {
					// TODO improve handling of errors, e.g. retrying or better logging
					continue;
				}

				fulFilledResponses.push(this.parseMakeTypesXmlResponse(response.value.data));
			}
		}

		return fulFilledResponses;
	}

	private combineMakesWithTypes(makes: Make[], makeTypes: MakeTypesResponse[]): MakesDto {
		const result: MakesDto = [];
		for (const make of makes) {
			const makeType = makeTypes.find(makeType => makeType.Response.SearchCriteria.split(":")[1].trim() === make.Make_ID.toString());
			if (!makeType) {
				continue;
			}

			const type = makeType.Response.Results.VehicleTypesForMakeIds;

			result.push({
				makeId: make.Make_ID,
				makeName: make.Make_Name,
				vehicleTypes: Array.isArray(type) ? type.map(this.createVehicleType) : [this.createVehicleType(type)],
			});
		}
		return result;
	}

	private parseMakesXmlResponse(xml: string): MakesResponse {
		const validationResult = XMLValidator.validate(xml);
		if (typeof validationResult !== "boolean") {
			throw new Error("Unable to validate XML with makes response:\n" + validationResult.err.msg);
		}

		const parser = new XMLParser();
		const json = parser.parse(xml);
		if (!this.makeServiceUtils.isMakesResponse(json)) {
			throw new Error("XML does not fulfills makes response requirements\n" + json);
		}

		return {
			Response: {
				...json.Response,
				Results: {
					AllVehicleMakes: json.Response.Results.AllVehicleMakes.filter(this.makeServiceUtils.isMake),
				},
			},
		};
	}

	private parseMakeTypesXmlResponse(xml: string): MakeTypesResponse {
		const validationResult = XMLValidator.validate(xml);
		if (typeof validationResult !== "boolean") {
			throw new Error("Unable to validate XML with make types:\n" + validationResult.err.msg);
		}

		const parser = new XMLParser();
		const json = parser.parse(xml);
		if (!this.makeServiceUtils.isMakeTypesResponse(json)) {
			throw new Error("XML does not fulfills make types requirements\n" + json);
		}

		const vehicleTypes = json.Response.Results.VehicleTypesForMakeIds;
		if (Array.isArray(vehicleTypes)) {
			return {
				Response: {
					...json.Response,
					Results: {
						VehicleTypesForMakeIds: vehicleTypes.filter(this.makeServiceUtils.isMakeType),
					},
				},
			};
		}

		if (!this.makeServiceUtils.isMakeType(vehicleTypes)) {
			throw new Error("XML does not fulfills make types requirements\n" + vehicleTypes);
		}

		return json;
	}

	private createVehicleType(type: MakeType): VehicleType {
		return {
			typeId: type.VehicleTypeId,
			typeName: type.VehicleTypeName,
		};
	}
}
