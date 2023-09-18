/**
 * TequityTypes.ts
 *
 * Types needed for tequity server comms
 */

export type TTequityConnectorConfig = {
	settings: {
		game: string;
		key?: string;
		operator?: string;
		provider: string;
		server: string;
		wallet: string;
	};
	callbacks: { [key: string]: () => void };
	theme: { color: string };
};
