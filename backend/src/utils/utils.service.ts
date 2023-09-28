import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
	public createChunks<T>(array: T[], chunkSize: number) {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize));
		}

		return chunks;
	}
}
