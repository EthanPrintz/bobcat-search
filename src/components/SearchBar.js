import React, { useEffect } from 'react';
import './css/SearchBar.css';



export default function SearchBar(){
    useEffect(() => {
        // Event listerner fortyping in search bar
        document.getElementById('searchBar').addEventListener('input', (e) => {
            if(e.target.innerText.length > 0){
                (async () => {
                    fetch(`https://schedge.torchnyu.com/2020/sp/search?query=${e.target.innerText.length}&limit=4`)
                        .then(response => response.json())    // one extra step
                        .then(data => console.log(data))
                        .catch(error => console.error(error));
                })();
            } else {
                // Remove search resoluts
            }
        });
    }, []);

    return(
        <>
            <div id="searchBar" contentEditable="true" placeholder="Search Courses">

            </div>
            <div id="searchResults"></div>
        </>
    )
}