/**
 * SoundManager.ts
 *
 * Sound management class - based around howler
 */
import { Howl, Howler } from 'howler';
class SoundItem extends Howl {
    constructor(data) {
        super(data);
        this.isMusic = false;
        this.playInstance = -1;
        this.data = data;
        this.baseVolume = this.data.baseVolume;
        this.volume(this.baseVolume);
        if (this.data.music !== undefined) {
            this.isMusic = this.data.music;
        }
    }
    Play() {
        const newUID = super.play();
        this.volume(this.baseVolume);
        this.playInstance = newUID;
        super.on('end', (UID) => {
            this.playInstance = -1;
        });
        return newUID;
    }
    Stop() {
        if (this.playInstance !== -1) {
            super.stop(this.playInstance);
            this.playInstance = -1;
        }
    }
    AdjustVolume(volume) {
        //Adjust the of the ongoing sound instance
        if (this.playInstance === -1) {
            return;
        }
        this.volume(this.baseVolume * volume);
    }
}
class ActiveMusic {
    constructor() {
        this.soundID = '';
        this.fading = false;
        this.fadeIn = false;
        this.fadeStartTime = 0;
        this.fadeDuration = 0;
    }
}
export class SoundManager {
    constructor() {
        this.audioAvailable = false;
        this.soundsArray = {};
        this.volume_main = 1;
        this.mute_all = false;
        this.mute_sfx = false;
        this.mute_music = false;
        this.musicTrackIDs = [];
        this.selectedMusicTrack = new ActiveMusic();
        this.outgoingMusicTrack = new ActiveMusic();
        Howler.mute(this.mute_all);
    }
    //Controls
    GetMuteAll() {
        return this.mute_all;
    }
    SetMuteAll(mute) {
        this.mute_all = mute;
        Howler.mute(this.mute_all);
    }
    GetMuteMusic() {
        return this.mute_music;
    }
    SetMuteMusic(mute) {
        this.mute_music = mute;
    }
    GetMuteSFX() {
        return this.mute_sfx;
    }
    SetMuteSFX(mute) {
        this.mute_sfx = mute;
    }
    GetVolume() {
        return this.volume_main;
    }
    SetVolume(vol) {
        this.volume_main = vol;
        Howler.volume(this.volume_main);
    }
    //Call from code to note that audio is avaible (usually by mandated click on screen)
    NoteAudioAvailable() {
        this.audioAvailable = true;
    }
    //Add the sound items
    LoadSoundItems(soundItemList) {
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
    PlaySound(ID) {
        if (!this.audioAvailable) {
            return;
        }
        if (this.soundsArray[ID] !== undefined) {
            this.soundsArray[ID].Play();
        }
    }
    StopSound(ID) {
        if (!this.audioAvailable) {
            return;
        }
        if (this.soundsArray[ID] !== undefined) {
            this.soundsArray[ID].Stop();
        }
    }
    GetMusicList() {
        if (!this.audioAvailable) {
            return;
        }
        return this.musicTrackIDs;
    }
    PlayMusic(ID, fadeTime) {
        if (!this.audioAvailable) {
            return;
        }
        //Switch to a new music track, fading as needed
        const timeNow = Date.now();
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
    HandleFade(data, timeNow) {
        const currentTime = timeNow - this.outgoingMusicTrack.fadeStartTime;
        if (data.fadeIn) {
            //Handle fadein
            if (currentTime > data.fadeDuration) {
                //Full now
                data.fading = false;
                this.soundsArray[data.soundID].AdjustVolume(1);
            }
            else {
                //Adjust the volume
                this.soundsArray[data.soundID].AdjustVolume(currentTime / data.fadeDuration);
            }
        }
        else {
            //Handle fadeout
            if (currentTime > data.fadeDuration) {
                //End now
                data.fading = false;
                this.soundsArray[data.soundID].Stop();
                data.soundID = '';
            }
            else {
                //Adjust the volume
                this.soundsArray[data.soundID].AdjustVolume(1 - currentTime / data.fadeDuration);
            }
        }
    }
    Tick(delta, timeNow) {
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
//# sourceMappingURL=SoundManager.js.map