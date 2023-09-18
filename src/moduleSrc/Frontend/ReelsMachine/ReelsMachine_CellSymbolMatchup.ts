/**
 * ReelsMachine_CellSymbolMatchup.ts
 *
 * Provides a class to match up symbol numbers with the relevant symbolsheet IDs for symbol and background
 */

export interface ReelsMachine_CellSymbolMatchup_Info {
	value: number;
	symbolID: string;
	backgroundID: string;
}

export class ReelsMachine_CellSymbolMatchup {
	protected matchup: ReelsMachine_CellSymbolMatchup_Info[] = [];

	constructor(initialData?: ReelsMachine_CellSymbolMatchup_Info[]) {
		if (initialData !== undefined) {
			initialData.forEach((data) => {
				this.Add(data.value, data.symbolID, data.backgroundID);
			});
		}
	}

	public Add(value: number, symbolID: string, backgroundID: string) {
		this.matchup.push({
			value: value,
			symbolID: symbolID,
			backgroundID: backgroundID,
		});
	}

	public GetData(
		value: number,
	): ReelsMachine_CellSymbolMatchup_Info | undefined {
		return this.matchup.find((existing) => {
			return existing.value === value;
		});
	}
}
