export interface Make {
	Make_ID: number;
	Make_Name: string;
}

export interface MakesResponse {
	Response: {
		Count: number;
		Message: string;
		Results: {
			AllVehicleMakes: Make[];
		};
	};
}
