export interface VehicleType {
	typeId: number;
	typeName: string;
}

export interface MakesResponse {
	makeId: number;
	makeName: string;
	vehicleTypes: VehicleType[];
}

export type MakesDto = MakesResponse[];
