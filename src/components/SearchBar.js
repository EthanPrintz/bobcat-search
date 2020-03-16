import React, { useEffect } from 'react';
import './css/SearchBar.css';



export default function SearchBar(){
    useEffect(() => {
        // Event listerner fortyping in search bar
        document.getElementById('searchContainer').addEventListener('input', (e) => {
            let searchText = e.target.innerText;
            if(searchText.length > 0){
                (async () => {
                    // Add loading animation
                    document.getElementById('courseLoading').style.opacity = 0.3;
                    // Get data
                    fetch(`https://schedge.a1liu.com/2020/su/search?query=${searchText}&limit=5`)
                        .then(response => response.json())    // one extra step
                        .then(data => {
                            // Update search result HTML
                            document.getElementById('searchResults').innerHTML = (data.map(course => (
                                `<div class="course">
                                    <span class="courseSchoolCode">${course.subjectCode.school}-${course.subjectCode.code}</span>
                                    <span class="courseId">${course.deptCourseId}</span>
                                    <span class="courseName">${course.name}</span>
                                </div>`
                            )) + '').replace(/,/g, '');
                            // Remove loading animation
                            if(searchText == document.getElementById('searchBar').innerText){
                                document.getElementById('courseLoading').style.opacity = 0;
                            }
                        })
                        .catch(error => console.error(error));
                })();
            } else {
                // Remove search resoluts
            }
        });
    }, []);

    return(
        <>
            <img src="./loading.svg" id="courseLoading"/>
            <div id="searchBar" contentEditable="true" placeholder="Search Courses"></div>
            <div id="searchResults"></div>
        </>
    )
}
