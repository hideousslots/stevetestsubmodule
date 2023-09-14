var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BUILDTARGETOPTIONS } from '../../../Utility/BuildTargetOptions';
const CONNECTORSCRIPTBASE_URL = 'https://cdn-test.tequity.ventures';
const CONNECTORSCRIPT_URL = '/slotify/connector/connector.js';
const SERVER_URL = 'https://test.tequity.ventures';
export const TEQUITY_CONFIG = {
    callbacks: {},
    settings: {
        game: 'space-hive-7',
        //key: "xxx:200:eur",
        //operator: "example-operator",
        provider: 'dreamspin',
        //server: "https://test.tequity.ventures",
        //server: "https://dstest.oinkygames.co.uk:3003",
        server: SERVER_URL,
        wallet: 'demo',
    },
    theme: { color: 'white' },
};
export class TequityBackend {
    get balance() {
        return this._balance;
    }
    get currency() {
        return this._currency;
    }
    constructor() {
        //NB On server, the connect URL must be localised. This is now driven by buildtarget settings
        this.ID = 'tequity';
        this.available = false;
        this._connectorURL = BUILDTARGETOPTIONS.IsSet('localiseconnector')
            ? CONNECTORSCRIPT_URL
            : CONNECTORSCRIPTBASE_URL + CONNECTORSCRIPT_URL;
    }
    IsAvailable() {
        return this.available;
    }
    Install(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.LoadConnector(settings);
                yield this.Authenticate(settings.playerID);
                this.available = true;
            }
            catch (_a) {
                console.log('error with installing server backend - tequity');
            }
        });
    }
    Initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                serverID: this.ID,
                serverVersion: 'stillwriting',
                gameID: 'gameid...',
            };
        });
    }
    Authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fullResponse = yield this._connector.authenticate();
                const { balance, currency } = fullResponse;
                this._currency = currency;
                this._balance = balance;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    Play(mode, stake) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                data: {},
            };
        });
    }
    Continue() {
        return __awaiter(this, void 0, void 0, function* () {
            return { data: {} };
        });
    }
    Complete() {
        return __awaiter(this, void 0, void 0, function* () {
            return { data: {} };
        });
    }
    // public async complete(): Promise<BackendResponse_Complete_Base> {
    // 	const { balance } = await this._connector.complete();
    // 	return { balance };
    // }
    // public async continue(): Promise<BackendResponse_Continue> {
    // 	const response = await this.getNextCachedSpinResponse();
    // 	this._balance = response.balance;
    // 	return response;
    // }
    // public async init(): Promise<IBaseInitResponse> {
    // 	const { wagers } = await this._connector.recover();
    // 	const { config, state, bets } = await this._connector.info();
    // 	//Apply the report stakes and default index from the response (use "main"'s) - others scale
    // 	let availableBetSteps: number[] = [
    // 		0.25, 0.5, 1, 2, 4, 6, 8, 10, 20, 40, 60, 80, 100, 200, 300, 400,
    // 		500, 1000,
    // 	];
    // 	let defaultBetIndex: number = 1;
    // 	if (bets['main'] !== undefined) {
    // 		availableBetSteps = bets['main'].available;
    // 		defaultBetIndex = availableBetSteps.findIndex((step) => {
    // 			return step === bets['main'].default;
    // 		});
    // 	}
    // 	let fullStakeInfo: any = {};
    // 	let types: string[] = ['main', 'ante', 'bonusbuy', 'coinbonusbuy'];
    // 	types.forEach((type) => {
    // 		let available: number[] = [0];
    // 		let defaultIndex: number = 0;
    // 		if (bets[type] !== undefined) {
    // 			available = bets[type].available;
    // 			defaultIndex = available.findIndex((step) => {
    // 				return step === bets[type].default;
    // 			});
    // 		}
    // 		fullStakeInfo[type] = { available, defaultIndex };
    // 	});
    // 	//Feed full list of bet ranges to model
    // 	return {
    // 		balance: this._balance,
    // 		bet_recovery: undefined,
    // 		currency: this._currency,
    // 		game_id: '',
    // 		init_balance: 0,
    // 		maths_version_info: '',
    // 		pay_table: [],
    // 		reel_set: 0,
    // 		reel_sets: [],
    // 		reels_display: [
    // 			[7, 7],
    // 			[6, 10, 1],
    // 			[0, 0, 2, 2],
    // 			[4, 4, 4, 0],
    // 			[7, 7, 5],
    // 			[1, 1],
    // 		],
    // 		session_id: '',
    // 		stake: {
    // 			//Single (main) bet stakes
    // 			steps: availableBetSteps,
    // 			starting: defaultBetIndex,
    // 			//Full stakes
    // 			fullStakeInfo: fullStakeInfo,
    // 		},
    // 		stops: [1, 43, 57, 11, 54, 12],
    // 		version: '',
    // 	};
    // }
    LoadConnector(config) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.setAttribute('src', this._connectorURL);
                script.onload = () => __awaiter(this, void 0, void 0, function* () {
                    //@ts-ignore
                    this._connector = yield window.connector.create(config.settings, config.callbacks, config.theme);
                    resolve();
                });
                script.onerror = (event) => {
                    reject('[ TequityBackend ] - Error loading Connector from ' +
                        this._connectorURL);
                };
                if (document.documentElement.firstChild !== null) {
                    document.documentElement.firstChild.appendChild(script);
                }
            });
        });
    }
}
//# sourceMappingURL=TequityBackend.js.map