import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with adding
 * a song. It will be managed by the transaction stack.
 * 
 * @author Tommy Lin
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initApp, initSong, initSongIndex) {
        super();
        this.app = initApp;
        this.song = initSong;
        this.songIndex = initSongIndex;
    }

    doTransaction() {
        this.app.addSong(this.song);
    }
    
    undoTransaction() {
        this.app.deleteSong(this.songIndex);
    }
}