import React, { Component } from 'react';

export default class EditSongModal extends Component{
    render(){
        const { editSongModalCallback, hideEditSongModalCallback } = this.props;

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
                            <input id="form-song-title" type="text" class="modal-song-content-input" />
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