/**
 * MultiLogger.ts
 *
 * A logger which can log to either console or remote server, or both
 * Potentially later a file too
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
export class MultiLogger {
    constructor() {
        //Control flags
        this.logToConsole = true;
        this.logToRemote = false;
        this.logToFile = false;
        this.remoteURL = '';
        this.fileURL = '';
        this.remoteSessionID = '';
        this.SetRemoteURL = (url, sessionID) => __awaiter(this, void 0, void 0, function* () {
            //Set session
            this.remoteSessionID = sessionID + '__' + Date.now();
            //Validate the URL logger
            const validate = yield this.CallRemoteLogger_GetResponse(url + '/validatelogger', {
                sessionID: this.remoteSessionID,
                payload: {},
            });
            this.logToRemote = false;
            this.remoteURL = '';
            if (validate.valid) {
                if (validate.response.data.serverValidForRemote) {
                    this.logToRemote = true;
                    this.remoteURL = url;
                }
                console.log('Remote Logger setup for session ' +
                    this.remoteSessionID +
                    ' via ' +
                    this.remoteURL);
            }
        });
        //Logging
        this.log = (simpleString) => __awaiter(this, void 0, void 0, function* () {
            if (this.logToConsole) {
                console.log(simpleString);
            }
            if (this.remoteURL) {
                yield this.CallRemoteLogger_GetResponse(this.remoteURL + '/log', {
                    sessionID: this.remoteSessionID,
                    payload: { stringToLog: simpleString },
                });
            }
        });
        //Handling of remote logging
        this.CallRemoteLogger_GetResponse = (URL, payload) => __awaiter(this, void 0, void 0, function* () {
            //Call the remote URL.
            const packet = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8;',
                },
                payload: payload,
            };
            try {
                const response = yield axios.post(URL, packet);
                return {
                    valid: true,
                    response: response,
                    error: null,
                };
            }
            catch (error) {
                // handle error
                return {
                    valid: false,
                    response: 'error!',
                    error: error,
                };
            }
        });
        //By default, allow console logging
    }
    //Select loggers
    AllowConsoleLog(allow) {
        this.logToConsole = allow;
    }
    SetLocalFile(fileURL) {
        //
    }
}
//# sourceMappingURL=MultiLogger.js.map