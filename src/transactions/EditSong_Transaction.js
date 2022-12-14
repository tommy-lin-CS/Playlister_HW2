import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with editing
 * content of a song. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Tommy Lin
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initSongIndex, initOldSongTitle, initOldSongArtist, initOldSongYoutubeId, initNewSongTitle, initNewSongArtist, initNewSongYoutubeId) {
        super();
        this.app = initApp;
        this.songIndex = initSongIndex;
        this.oldSongTitle = initOldSongTitle;
        this.oldSongArtist = initOldSongArtist;
        this.oldSongYoutubeId = initOldSongYoutubeId;
        this.newSongTitle = initNewSongTitle;
        this.newSongArtist = initNewSongArtist;
        this.newSongYoutubeId = initNewSongYoutubeId;
    }

    doTransaction() {
        this.app.addSongGivenAllComponentsOnIndex(this.songIndex, this.newSongTitle, this.newSongArtist, this.newSongYoutubeId);
    }
    
    undoTransaction() {
        this.app.addSongGivenAllComponentsOnIndex(this.songIndex, this.oldSongTitle, this.oldSongArtist, this.oldSongYoutubeId);
    }
}