import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works with deleting
 * a song. It will be managed by the transaction stack.
 * 
 * @author Tommy Lin
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initSongTitle, initSongArtist, initSongYoutubeId, initSongIndex) {
        super();
        this.app = initApp;
        this.title = initSongTitle;
        this.artist = initSongArtist;
        this.youtubeId = initSongYoutubeId;
        this.songIndex = initSongIndex;
    }

    doTransaction() {
        this.app.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.app.addOldSongBack(this.songIndex, this.title, this.artist, this.youtubeId);
    }
}