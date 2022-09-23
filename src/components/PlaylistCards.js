import SongCard from './SongCard.js';
import React from "react";

export default class PlaylistCards extends React.Component {
    render() {
        const { currentList, 
                moveSongCallback, selected } = this.props;
        if (currentList === null) {
            return (
                <div id="playlist-cards"></div>
            )
        }
        else {
            let selectSong = "unselected-list-card";
            if(selected) {
                selectSong = "selected-list-card"
            }
            return (
                <div id="playlist-cards">
                    {
                        currentList.songs.map((song, index) => (
                            <SongCard
                                class={'list-card'}
                                id={'playlist-song-' + (index+1)}
                                key={'playlist-song-' + (index+1)}
                                song={song}
                                moveCallback={moveSongCallback}
                            />
                        ))
                    }
                </div>
            )
        }
    }
}