import { TequityBackend } from "./TequityBackend";
const CONNECTORSCRIPT_URL = "http://localhost:3002/getconnector";
const SERVER_URL = "http://localhost:3002";
export const TEQUITY_FAKELOCAL_CONFIG = {
    callbacks: {},
    settings: {
        game: "space-hive-7",
        key: "xxx:200:eur",
        operator: "example-operator",
        provider: "dreamspin",
        server: SERVER_URL,
        wallet: "demo"
    },
    theme: { color: "white" }
};
export class TequityBackend_FakeLocal extends TequityBackend {
    constructor() {
        super();
        this._connectorURL = CONNECTORSCRIPT_URL;
    }
}
//# sourceMappingURL=TequityBackend_FakeLocal.js.map