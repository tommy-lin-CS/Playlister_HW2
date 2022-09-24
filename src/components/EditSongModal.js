import React, { Component } from 'react';

export default class EditSongModal extends Component{
    render(){
        const { currentList, id, editSongModalCallback, hideEditSongModalCallback } = this.props;
        // let title = currentList.songs[id - 1].title;
        // let artist = currentList.songs[id - 1].artist;
        // let youtubeId = currentList.songs[id - 1].youtubeId;

        let title = "1";
        let artist = "2";
        let youtubeId = "3";

        return (
           <div class="modal" id="edit-song-modal" data-animation="slideInOutLeft">
            <div class="modal-root" id="edit-song-content">
                <div class="modal-song-north">
                    Edit song
                </div>
                <div class="modal-center">
                    <div class="modal-edit-song">
                        <div>
                            <span>Title: </span>
                            <input id="form-song-title" type="text" class="modal-song-content-input" value={title}/>
                        </div>
                        <div>
                            <span>Artist: </span>
                            <input id="form-song-artist" type="text" class="modal-song-content-input" value={artist}/>
                        </div>
                        <div>
                            <span>YouTube Id: </span>
                            <input id="form-song-ytid" type="text" class="modal-song-content-input" value={youtubeId}/>
                        </div>
                    </div>
                </div>
                <div class="modal-song-south">
                    <input type="button" 
                        id="edit-song-confirm-button" 
                        onClick={editSongModalCallback}
                        class="song-modal-button" 
                        value='Confirm' />
                    <input type="button" 
                        id="edit-song-cancel-button" 
                        onClick={hideEditSongModalCallback}
                        class="song-modal-button" 
                        value='Cancel' />
                </div>
            </div>
        </div>
        );
        
    };
}