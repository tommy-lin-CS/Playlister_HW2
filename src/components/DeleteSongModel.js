import React, { Component } from 'react';

export default class DeleteSongModal extends Component {
    render() { // NOT DONE
        const { currentList, id, deleteSongCallback, hideDeleteSongCallback } = this.props;
        let name = "";
        
        return (
            <div 
                class="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-root" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Delete playlist?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content">
                                Are you sure you wish to permanently delete the <span class="bold">{name}</span> playlist?
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                onClick={deleteSongCallback}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                onClick={hideDeleteSongCallback}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
        );
    }
}