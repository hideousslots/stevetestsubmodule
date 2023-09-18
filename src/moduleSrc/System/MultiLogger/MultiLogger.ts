/**
 * MultiLogger.ts
 *
 * A logger which can log to either console or remote server, or both
 * Potentially later a file too
 */

import axios from 'axios';

export class MultiLogger {
	//Control flags

	protected logToConsole: boolean = true;
	protected logToRemote: boolean = false;
	protected logToFile: boolean = false;

	protected remoteURL: string = '';
	protected fileURL: string = '';
	protected remoteSessionID: string = '';

	constructor() {
		//By default, allow console logging
	}

	//Select loggers

	public AllowConsoleLog(allow: boolean) {
		this.logToConsole = allow;
	}

	public SetRemoteURL = async (url: string, sessionID: string) => {
		//Set session

		this.remoteSessionID = sessionID + '__' + Date.now();

		//Validate the URL logger

		const validate: { valid: boolean; response: any } =
			await this.CallRemoteLogger_GetResponse(url + '/validatelogger', {
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
			console.log(
				'Remote Logger setup for session ' +
					this.remoteSessionID +
					' via ' +
					this.remoteURL,
			);
		}
	};

	public SetLocalFile(fileURL: string) {
		//
	}

	//Logging

	public log = async (simpleString: string) => {
		if (this.logToConsole) {
			console.log(simpleString);
		}

		if (this.remoteURL) {
			await this.CallRemoteLogger_GetResponse(this.remoteURL + '/log', {
				sessionID: this.remoteSessionID,
				payload: { stringToLog: simpleString },
			});
		}
	};

	//Handling of remote logging

	protected CallRemoteLogger_GetResponse = async (
		URL: string,
		payload: any,
	): Promise<any> => {
		//Call the remote URL.

		const packet = {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8;',
			},
			payload: payload,
		};

		try {
			const response = await axios.post(URL, packet);

			return {
				valid: true,
				response: response,
				error: null,
			};
		} catch (error) {
			// handle error

			return {
				valid: false,
				response: 'error!',
				error: error,
			};
		}
	};
}
