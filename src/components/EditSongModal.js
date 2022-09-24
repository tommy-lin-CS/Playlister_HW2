import React, { Component } from 'react';

export default class EditPlayListModal extends Component{
    render(){
        const { currentList, id, editSongCallBank, hideEditSongCallback } = this.props;
        let title = currentList.songs[id - 1].title;
        let artist = currentList.songs[id - 1].artist;
        let youtubeId = currentList.songs[id - 1].youtubeId;

        return (
           <div class="modal" id="edit-song-content" data-animation="slideInOutLeft">
            <div class="modal-root" id="edit-song-modal">
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
                            <input id="form-song-artist" type="text" class="modal-song-content-input" />
                        </div>
                        <div>
                            <span>YouTube Id: </span>
                            <input id="form-song-ytid" type="text" class="modal-song-content-input" />
                        </div>
                    </div>
                </div>
                <div class="modal-song-south">
                    <input type="button" id="edit-song-confirm-button" class="song-modal-button" value='Confirm' />
                    <input type="button" id="edit-song-cancel-button" class="song-modal-button" value='Cancel' />
                </div>
            </div>
        </div>
        );
        
    };
}