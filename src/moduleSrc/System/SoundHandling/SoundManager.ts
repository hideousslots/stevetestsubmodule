/**
 * SoundManager.ts
 *
 * Sound management class - based around howler
 */

import { Howl, Howler } from 'howler';
import { NodeBuilderFlags } from 'typescript';

interface SoundItemInfo {
	name: string;
	src: string[];
	baseVolume: number;
	loop: boolean;
	music?: boolean;
	rate?: number;
}

class SoundItem extends Howl {
	public isMusic: boolean = false;
	public playInstance: number = -1;
	public data: SoundItemInfo;
	public baseVolume: number;
	constructor(data: SoundItemInfo) {
		super(data);
		this.data = data;
		this.baseVolume = this.data.baseVolume;
		this.volume(this.baseVolume);
		if (this.data.music !== undefined) {
			this.isMusic = this.data.music;
		}
	}

	public Play(): number {
		const newUID: number = super.play();
		this.volume(this.baseVolume);
		this.playInstance = newUID;
		super.on('end', (UID) => {
			this.playInstance = -1;
		});
		return newUID;
	}

	public Stop() {
		if (this.playInstance !== -1) {
			super.stop(this.playInstance);
			this.playInstance = -1;
		}
	}

	public AdjustVolume(volume: number) {
		//Adjust the of the ongoing sound instance

		if (this.playInstance === -1) {
			return;
		}

		this.volume(this.baseVolume * volume);
	}
}

class ActiveMusic {
	public soundID: string = '';
	public fading: boolean = false;
	public fadeIn: boolean = false;
	public fadeStartTime: number = 0;
	public fadeDuration: number = 0;
}

export class SoundManager {
	protected audioAvailable: boolean = false;
	protected soundsArray: { [key: string]: SoundItem } = {};

	protected volume_main: number = 1;
	protected mute_all: boolean = false;
	protected mute_sfx: boolean = false;
	protected mute_music: boolean = false;
	protected musicTrackIDs: string[] = [];

	protected selectedMusicTrack: ActiveMusic = new ActiveMusic();
	protected outgoingMusicTrack: ActiveMusic = new ActiveMusic();

	constructor() {
		Howler.mute(this.mute_all);
	}

	//Controls

	public GetMuteAll(): boolean {
		return this.mute_all;
	}

	public SetMuteAll(mute: boolean) {
		this.mute_all = mute;
		Howler.mute(this.mute_all);
	}

	public GetMuteMusic(): boolean {
		return this.mute_music;
	}

	public SetMuteMusic(mute: boolean) {
		this.mute_music = mute;
	}

	public GetMuteSFX(): boolean {
		return this.mute_sfx;
	}

	public SetMuteSFX(mute: boolean) {
		this.mute_sfx = mute;
	}

	public GetVolume(): number {
		return this.volume_main;
	}

	public SetVolume(vol: number) {
		this.volume_main = vol;
		Howler.volume(this.volume_main);
	}

	//Call from code to note that audio is avaible (usually by mandated click on screen)

	public NoteAudioAvailable() {
		this.audioAvailable = true;
	}

	//Add the sound items

	public LoadSoundItems(soundItemList: SoundItemInfo[]) {
		//Load the sounds and build the sound list and music list

		this.musicTrackIDs = [];
		soundItemList.forEach((item, index) => {
			const soundItem = new SoundItem(item);
			this.soundsArray[item.name] = soundItem;
			if (soundItem.isMusic) {
				this.musicTrackIDs.push(soundItem.data.name);
			}
		});
	}

	public PlaySound(ID: string) {
		if (!this.audioAvailable) {
			return;
		}
		if (this.soundsArray[ID] !== undefined) {
			this.soundsArray[ID].Play();
		}
	}

	public StopSound(ID: string) {
		if (!this.audioAvailable) {
			return;
		}
		if (this.soundsArray[ID] !== undefined) {
			this.soundsArray[ID].Stop();
		}
	}

	public GetMusicList(): string[] {
		if (!this.audioAvailable) {
			return;
		}
		return this.musicTrackIDs;
	}

	public PlayMusic(ID: string, fadeTime: number) {
		if (!this.audioAvailable) {
			return;
		}

		//Switch to a new music track, fading as needed

		const timeNow: number = Date.now();

		//Check same tracks

		if (this.selectedMusicTrack.soundID == ID) {
			//Leave it

			return;
		}

		//Remove current outgoing music (if there is any)

		if (this.outgoingMusicTrack.soundID !== '') {
			this.soundsArray[this.outgoingMusicTrack.soundID].Stop();
			this.outgoingMusicTrack.soundID = '';
		}

		//If fadetime is 0 (instant), stop the current track and start the next

		if (fadeTime === 0) {
			if (this.selectedMusicTrack.soundID !== '') {
				this.soundsArray[this.selectedMusicTrack.soundID].Stop();
				this.selectedMusicTrack.soundID = '';
			}

			//Start the track

			this.selectedMusicTrack.soundID = ID;
			this.selectedMusicTrack.fadeStartTime = 0;
			this.soundsArray[this.selectedMusicTrack.soundID].Play();
			return;
		}

		//Make the current track outgoing

		if (this.selectedMusicTrack.soundID !== '') {
			this.outgoingMusicTrack.soundID = this.selectedMusicTrack.soundID;
			this.outgoingMusicTrack.fadeDuration = fadeTime;
			this.outgoingMusicTrack.fadeStartTime = timeNow;
			this.outgoingMusicTrack.fading = true;
			this.outgoingMusicTrack.fadeIn = false;
		}

		//Finally start this track coming in

		this.selectedMusicTrack.soundID = ID;
		this.selectedMusicTrack.fadeStartTime = timeNow;
		this.selectedMusicTrack.fadeDuration = fadeTime;
		this.selectedMusicTrack.fading = true;
		this.selectedMusicTrack.fadeIn = true;
		this.soundsArray[this.selectedMusicTrack.soundID].Play();
	}

	//Tick the sound manager

	public HandleFade(data: ActiveMusic, timeNow: number) {
		const currentTime: number =
			timeNow - this.outgoingMusicTrack.fadeStartTime;
		if (data.fadeIn) {
			//Handle fadein

			if (currentTime > data.fadeDuration) {
				//Full now
				data.fading = false;
				this.soundsArray[data.soundID].AdjustVolume(1);
			} else {
				//Adjust the volume

				this.soundsArray[data.soundID].AdjustVolume(
					currentTime / data.fadeDuration,
				);
			}
		} else {
			//Handle fadeout

			if (currentTime > data.fadeDuration) {
				//End now
				data.fading = false;
				this.soundsArray[data.soundID].Stop();
				data.soundID = '';
			} else {
				//Adjust the volume

				this.soundsArray[data.soundID].AdjustVolume(
					1 - currentTime / data.fadeDuration,
				);
			}
		}
	}

	public Tick(delta: number, timeNow: number) {
		//Handle music fade in/out

		//Outgoing?

		if (this.outgoingMusicTrack.fading) {
			this.HandleFade(this.outgoingMusicTrack, timeNow);
		}

		if (this.selectedMusicTrack.fading) {
			this.HandleFade(this.selectedMusicTrack, timeNow);
		}
	}
}
