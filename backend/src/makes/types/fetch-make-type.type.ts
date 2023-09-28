export interface MakeType {
	VehicleTypeId: number;
	VehicleTypeName: string;
}

export interface MakeTypesResponse {
	Response: {
		Count: number;
		Message: string;
		SearchCriteria: string;
		Results: {
			VehicleTypesForMakeIds: MakeType | MakeType[];
		};
	};
}
