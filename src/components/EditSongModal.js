import React, { Component } from 'react';

export default class EditSongModal extends Component{

    render(){
        const { editSongModalCallback, hideEditSongModalCallback } = this.props;

        return (
           <div className="modal" id="edit-song-modal" data-animation="slideInOutLeft">
            <div className="modal-root" id="edit-song-content">
                <div className="modal-song-north">
                    Edit song
                </div>
                <div className="modal-center">
                    <div className="modal-edit-song">
                        <div>
                            <span>Title: </span>
                            <input id="form-song-title" type="text" className="modal-song-content-input" />
                        </div>
                        <div>
                            <span>Artist: </span>
                            <input id="form-song-artist" type="text" className="modal-song-content-input" />
                        </div>
                        <div>
                            <span>YouTube Id: </span>
                            <input id="form-song-ytid" type="text" className="modal-song-content-input" />
                        </div>
                    </div>
                </div>
                <div className="modal-song-south">
                    <input type="button" 
                        id="edit-song-confirm-button" 
                        onClick={editSongModalCallback}
                        className="song-modal-button" 
                        value='Confirm' />
                    <input type="button" 
                        id="edit-song-cancel-button" 
                        onClick={hideEditSongModalCallback}
                        className="song-modal-button" 
                        value='Cancel' />
                </div>
            </div>
        </div>
        );
        
    };
}