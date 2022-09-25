import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction.js';
import AddSong_Transaction from './transactions/AddSong_Transaction.js'
import DeleteSong_Transaction from './transactions/DeleteSong_Transaction';

// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal.js';
import DeleteSongModal from './components/DeleteSongModal.js';
import EditSongModal from './components/EditSongModal.js';

// THESE REACT COMPONENTS ARE IN OUR UI
import Banner from './components/Banner.js';
import EditToolbar from './components/EditToolbar.js';
import PlaylistCards from './components/PlaylistCards.js';
import SidebarHeading from './components/SidebarHeading.js';
import SidebarList from './components/SidebarList.js';
import Statusbar from './components/Statusbar.js';
import EditSong_Transaction from './transactions/EditSong_Transaction';


class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS IS OUR TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        this.isFlag = false;
        // SETUP THE INITIAL STATE
        this.state = {
            listKeyPairMarkedForDeletion : null,
            songKeyPairMarkedForDeletion: null,
            currentList : null, // CURRENT LIST = CURRENTLY BEING EDITED
            targetDeleteSong: null, // CURRENT SONG = CURRENLTY BEING DELTETED
            songTitleMarkedForDeletion: "",
            songIndexMarkedForDeletion: null,
            songIndexMarkedForEdit: null,
            sessionData : loadedSessionData
        }
    }
/* ------------------------------------------------------------------------------------------------------------------ */
    // ALL FUNCTIONS FOR LIST

    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }

    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            songs: []
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
    deleteList = (key) => {
        // IF IT IS THE CURRENT LIST, CHANGE THAT
        let newCurrentList = null;
        if (this.state.currentList) {
            if (this.state.currentList.key !== key) {
                // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
                // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
                newCurrentList = this.state.currentList;
            }
        }

        let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
            return (keyNamePair.key === key);
        });
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        if (keyIndex >= 0)
            newKeyNamePairs.splice(keyIndex, 1);

        // AND FROM OUR APP STATE
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            currentList: newCurrentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // DELETING THE LIST FROM PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(key);

            // SO IS STORING OUR SESSION DATA
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    deleteMarkedList = () => {
        this.deleteList(this.state.listKeyPairMarkedForDeletion.key);
        this.hideDeleteListModal();
    }
    // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
    deleteCurrentList = () => {
        if (this.state.currentList) {
            this.deleteList(this.state.currentList.key);
        }
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : null,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: newCurrentList,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList: null,
            sessionData: this.state.sessionData
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.tps.clearAllTransactions();
        });
    }
    setStateWithUpdatedList(list) {
        this.setState(prevState => ({
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            currentList : list,
            sessionData : this.state.sessionData
        }), () => {
            // UPDATING THE LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationUpdateList(this.state.currentList);
        });
    }
    // THIS FUNCTION MARKS THE LIST FOR DELETION GIVEN KEYPAIR
    markListForDeletion = (keyPair) => {
        this.setState(prevState => ({
            currentList: prevState.currentList,
            listKeyPairMarkedForDeletion : keyPair,
            sessionData: prevState.sessionData
        }), () => {
            // PROMPT THE USER
            this.showDeleteListModal();
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }
    // THIS FUNCTION GETS THE SIZE OF THE PLAYLIST
    getPlaylistSize = () => {
        return this.state.currentList.songs.length;
    }

/* ------------------------------------------------------------------------------------------------------------------ */
    // MOVING SONGS

    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    moveSong(start, end) {
        let list = this.state.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        this.setStateWithUpdatedList(list);
    }

/* ------------------------------------------------------------------------------------------------------------------ */
    // ALL FUNCTIONS FOR DEALING WITH TPS

    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(this, start, end);
        this.tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A DeleteSong_Transaction TO THE TRANSACTION STACK
    deleteSongTransaction = (song, songIndex) => {
        songIndex = this.state.songIndexMarkedForDeletion;
        let songAtIndex = this.state.currentList.songs[songIndex];
        let transaction = new DeleteSong_Transaction(this, songAtIndex.title, songAtIndex.artist, songAtIndex.youTubeId, songIndex);
        console.log(songIndex);
        this.tps.addTransaction(transaction);
        this.hideDeleteSongModal();
    }

    // THIS FUNCTION ADDS AN AddSong_Transaction TO THE TRANSACTION STACK
    addSongTransaction = (song, songIndex) => {
        let transaction = new AddSong_Transaction(this, song, songIndex);
        this.tps.addTransaction(transaction);
    }

    // THIS FUNCTION ADDS AN EditSong_Transaction TO THE TRANSACTION STACK
    editSongTransaction = () => {
        let oldSongTitle = this.state.currentList.songs[this.state.songIndexMarkedForEdit].title;
        let oldSongArtist = this.state.currentList.songs[this.state.songIndexMarkedForEdit].artist;
        let oldSongYoutubeId = this.state.currentList.songs[this.state.songIndexMarkedForEdit].youTubeId;

        let newSongTitle = document.getElementById("form-song-title").value;
        let newSongArtist = document.getElementById("form-song-artist").value;
        let newSongYoutubeId = document.getElementById("form-song-ytid").value;

        let transaction = new EditSong_Transaction(this, this.state.songIndexMarkedForEdit, 
                                                    oldSongTitle, oldSongArtist, oldSongYoutubeId,
                                                    newSongTitle, newSongArtist, newSongYoutubeId);
        this.tps.addTransaction(transaction);
        this.hideEditSongModal();
    }

    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            // MAKE SURE THE LIST GETS PERMANENTLY UPDATED
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    
    // THIS HANDLER HANDLES CTRL-Z & CTRL-Y
    handleKeyDown = (event) => {
        if (event.ctrlKey && event.keyCode === 90) {
            this.undo();
        }
        else if (event.ctrlKey && event.keyCode === 89) {
            this.redo();
        }
    }

/* ------------------------------------------------------------------------------------------------------------------ */
    // ALL FUNCTIONS FOR ADDING A SONG

    // THIS FUNCTION ADDS A NEW SONG TO THE LIST WITH DEFAULT INFO
    addNewSong = () => {
        let new_song = {title: "Untitled", artist: "Unknown",youTubeId: "dQw4w9WgXcQ"}
        let newCurrentList = this.state.currentList;
        newCurrentList.songs.push({title: new_song.title, artist: new_song.artist, youTubeId: new_song.youTubeId});
        this.setState(() => ({
            currentList:newCurrentList
        }));
        this.db.mutationUpdateList(this.state.currentList);
    }

    // THIS FUNCTION ADDS A SONG WITH GIVEN INFO ON INDEX
    // PURPOSE: REPLACES THE SONG INFO ON THE CURRENT INDEX. MAINLY USED FOR EDITING TRANSACTIONS!
    addSongGivenAllComponentsOnIndex = (songIndex, songTitle, songArtist, songYoutubeId) => {
        this.state.currentList.songs.splice(songIndex, 1, {
            "title": songTitle,
            "artist": songArtist,
            "youTubeId": songYoutubeId
        })
        this.setStateWithUpdatedList(this.state.currentList);
    }

    // THIS FUNCTION ADDS A SONG WITH GIVEN INFO ON INDEX
    // PURPOSE: ADDS NEW CARD WITH THE INFO
    addSongGivenAllComponentsWithAdd = (songIndex, songTitle, songArtist, songYoutubeId) => {
        this.state.currentList.songs.splice(songIndex, 0, {
            "title": songTitle,
            "artist": songArtist,
            "youTubeId": songYoutubeId
        })
        this.setStateWithUpdatedList(this.state.currentList);
    }

/* ------------------------------------------------------------------------------------------------------------------ */
    // ALL FUNCTIONS FOR DELETING A SONG

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE SONG
    showDeleteSongModal() {
        // FOOLPROOF
        document.getElementById("edit-toolbar").getElementsByTagName('input')[0].disabled = true;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[1].disabled = true;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[2].disabled = true;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[3].disabled = true;

        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteSongModal() {
        // FOOLPROOF
        document.getElementById("edit-toolbar").getElementsByTagName('input')[0].disabled = false;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[3].disabled = false;

        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }
    // THIS FUNCTION MARKS THE SONG FOR DELETION GIVEN INDEX
    markSongForDeletion = (index) => {
        let title = this.state.currentList.songs[index].title;
        this.setState(prevState => ({
            songIndexMarkedForDeletion : index,
            songTitleMarkedForDeletion : title,
            sessionData : prevState.sessionData,
        }),
            // PROMPT THE USER
            this.showDeleteSongModal())
    }
    // THIS FUNCTION DELETES THE SONG GIVEN THE INDEX
    deleteSong = (index) => {
        this.state.currentList.songs.splice(index, 1);
        console.log(index);

        this.setStateWithUpdatedList(this.state.currentList);
    }
    // THIS FUNCTION DELETES THE LAST SONG OF THE PLAYLIST
    deleteLastSong = () => {
        this.state.currentList.songs.splice(this.state.currentList.songs.length - 1, 1);
        this.setStateWithUpdatedList(this.state.currentList);
    }

/* ------------------------------------------------------------------------------------------------------------------ */
    // ALL FUNCTIONS FOR EDITING A SONG

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY WANT TO EDIT THE CONTENT OF THE SONG
    showEditSongModal() {
        // FOOLPROOF
        document.getElementById("edit-toolbar").getElementsByTagName('input')[0].disabled = true;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[1].disabled = true;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[2].disabled = true;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[3].disabled = true;
        console.log(this.tps.hasTransactionToUndo());
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideEditSongModal() {
        // FOOLPROOF
        document.getElementById("edit-toolbar").getElementsByTagName('input')[0].disabled = false;
        document.getElementById("edit-toolbar").getElementsByTagName('input')[3].disabled = false;
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    // THIS FUNCTION MARKS THE SONG FOR EDITING
    markSongForEdit = (index) => {
        document.getElementById("form-song-title").value = this.state.currentList.songs[index].title;
        document.getElementById("form-song-artist").value = this.state.currentList.songs[index].artist;
        document.getElementById("form-song-ytid").value = this.state.currentList.songs[index].youTubeId;

        this.setState(prevState => ({
            songIndexMarkedForEdit : index,
            sessionData : prevState.sessionData
        }),
            this.showEditSongModal)
    }
    
/* ------------------------------------------------------------------------------------------------------------------ */
    render() { 
        let canAddList = this.state.currentList == null;
        let canAddSong = this.state.currentList !== null;
        let canUndo = this.tps.hasTransactionToUndo();
        let canRedo = this.tps.hasTransactionToRedo();
        let canClose = this.state.currentList !== null;
        if(this.state.currentList == null) {
            canUndo = false;
            canRedo = false;
        }
        

        return (
            <div id="inner-root" tabIndex="0" onKeyDown={this.handleKeyDown}>
                <Banner />
                <SidebarHeading
                    createNewListCallback={this.createNewList}
                    canAddList={!canAddList} />
                <SidebarList
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    deleteListCallback={this.markListForDeletion}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList} />
                <EditToolbar
                    canAddSong={!canAddSong}
                    canUndo={!canUndo}
                    canRedo={!canRedo}
                    canClose={!canClose} 
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    closeCallback={this.closeCurrentList} 
                    addSongCallback={this.addSongTransaction}
                    />
                <PlaylistCards
                    currentList={this.state.currentList}
                    moveSongCallback={this.addMoveSongTransaction}
                    deleteSongCallback={this.markSongForDeletion}
                    editSongCallback={this.markSongForEdit} />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteListModal
                    listKeyPair={this.state.listKeyPairMarkedForDeletion}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.deleteMarkedList} />
                <DeleteSongModal
                    songTitleMarkedForDeletion={this.state.songTitleMarkedForDeletion}
                    hideDeleteSongModalCallback={this.hideDeleteSongModal}
                    deleteSongCallback={this.deleteSongTransaction} />
                <EditSongModal
                    canAddSong={!canAddSong}
                    editSongModalCallback={this.editSongTransaction}
                    hideEditSongModalCallback={this.hideEditSongModal} />
            </div>
        );
    }
}

export default App;
