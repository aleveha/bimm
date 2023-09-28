import { Injectable } from "@nestjs/common";
import type { MakeType, MakeTypesResponse } from "./types/fetch-make-type.type";
import type { Make, MakesResponse } from "./types/fetch-makes.type";

@Injectable()
export class MakesServiceUtils {
	public isMakesResponse(obj: unknown): obj is MakesResponse {
		if (typeof obj !== "object" || obj === null) {
			return false;
		}

		if (!("Response" in obj && typeof obj["Response"] === "object" && obj["Response"] !== null)) {
			return false;
		}

		if (
			!("Count" in obj["Response"] && typeof obj["Response"]["Count"] === "number") ||
			!("Message" in obj["Response"] && typeof obj["Response"]["Message"] === "string") ||
			!("Results" in obj["Response"] && typeof obj["Response"]["Results"] === "object" && obj["Response"]["Results"] !== null)
		) {
			return false;
		}

		return "AllVehicleMakes" in obj["Response"]["Results"] && Array.isArray(obj["Response"]["Results"]["AllVehicleMakes"]);
	}

	public isMakeTypesResponse(obj: unknown): obj is MakeTypesResponse {
		if (typeof obj !== "object" || obj === null) {
			return false;
		}

		if (!("Response" in obj && typeof obj["Response"] === "object" && obj["Response"] !== null)) {
			return false;
		}

		if (
			!("Count" in obj["Response"] && typeof obj["Response"]["Count"] === "number") ||
			!("Message" in obj["Response"] && typeof obj["Response"]["Message"] === "string") ||
			!("SearchCriteria" in obj["Response"] && typeof obj["Response"]["SearchCriteria"] === "string") ||
			!(
				"Results" in obj["Response"] &&
				(typeof obj["Response"]["Results"] === "object" || typeof obj["Response"]["Results"] === "string") &&
				obj["Response"]["Results"] !== null
			)
		) {
			return false;
		}

		if (typeof obj["Response"]["Results"] === "string") {
			obj["Response"]["Results"] = {
				VehicleTypesForMakeIds: [],
			};
			return true;
		}

		if (!("VehicleTypesForMakeIds" in obj["Response"]["Results"])) {
			return false;
		}

		return (
			Array.isArray(obj["Response"]["Results"]["VehicleTypesForMakeIds"]) ||
			typeof obj["Response"]["Results"]["VehicleTypesForMakeIds"] === "object"
		);
	}

	public isMake(obj: unknown): obj is Make {
		if (typeof obj !== "object" || obj === null) {
			return false;
		}

		return "Make_ID" in obj && typeof obj["Make_ID"] === "number" && "Make_Name" in obj && typeof obj["Make_Name"] === "string";
	}

	public isMakeType(obj: unknown): obj is MakeType {
		if (typeof obj !== "object" || obj === null) {
			return false;
		}

		return (
			"VehicleTypeId" in obj &&
			typeof obj["VehicleTypeId"] === "number" &&
			"VehicleTypeName" in obj &&
			typeof obj["VehicleTypeName"] === "string"
		);
	}
}
