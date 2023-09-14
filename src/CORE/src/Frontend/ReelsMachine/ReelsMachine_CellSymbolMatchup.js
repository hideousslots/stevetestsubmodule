/**
 * ReelsMachine_CellSymbolMatchup.ts
 *
 * Provides a class to match up symbol numbers with the relevant symbolsheet IDs for symbol and background
 */
export class ReelsMachine_CellSymbolMatchup {
    constructor(initialData) {
        this.matchup = [];
        if (initialData !== undefined) {
            initialData.forEach((data) => {
                this.Add(data.value, data.symbolID, data.backgroundID);
            });
        }
    }
    Add(value, symbolID, backgroundID) {
        this.matchup.push({
            value: value,
            symbolID: symbolID,
            backgroundID: backgroundID,
        });
    }
    GetData(value) {
        return this.matchup.find((existing) => {
            return existing.value === value;
        });
    }
}
//# sourceMappingURL=ReelsMachine_CellSymbolMatchup.js.map