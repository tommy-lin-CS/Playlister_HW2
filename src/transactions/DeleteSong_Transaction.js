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
    constructor(initApp, initSong, initSongIndex) {
        super();
        this.app = initApp;
        this.song = initSong;
        this.songIndex = initSongIndex;
    }

    doTransaction() {
        this.app.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.app.addSong(this.song, this.songIndex);
    }
}