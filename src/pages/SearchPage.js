import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import './css/SearchPage.css';

import SearchBar from '../components/SearchBar'

export default function SearchPage(){
    // Set state
    const [departments, setDepartments] = useState({});
    const [schools, setSchools] = useState({});

    // Query departments on component mount
    useEffect(() => {
        // Get Schedge data
        (async () => {
            fetch('https://schedge.torchnyu.com/subjects')
                .then(response => response.json())    // one extra step
                .then(data => setDepartments(data))
                .catch(error => console.error(error));
        })();
        (async () => {
            fetch('https://schedge.torchnyu.com/schools')
                .then(response => response.json())    // one extra step
                .then(data => setSchools(data))
                .catch(error => console.error(error));
        })();
        // Animate in elements
        document.getElementById('departmentTitle').style.opacity = 1;
        let checkLoaded = setInterval(() => {
            // Wait until departments are loaded
            if(document.querySelector('.school')){
                document.getElementById('departments').style.opacity = 1;
                document.getElementById('departments').style.paddingTop = '4rem';
                clearInterval(checkLoaded);
            }
        }, 50);
    }, []);

    return(
        <div id="pageContainer">
            <div id="searchContainer">
                <SearchBar />
            </div>
            <div id="departmentContainer">
                <div id="departmentTitle">Majors</div>
                <div id="departments">
                {
                    ReactHtmlParser((Object.keys(departments)
                        .sort((a,b) => {
                            return Object.keys(departments[b]).length - Object.keys(departments[a]).length
                        })
                        .map((schoolCode, i) => (
                        `<div class="school" key="${i}">
                            <div class="schoolTitle">
                                <span class="schoolCode">${schoolCode}</span>
                                <span class="schoolName">${(schools[schoolCode] ?? '')}</span>
                            </div>
                            ${Object.keys(departments[schoolCode]).map((departmentCode, i) => (`
                                <div class="department">
                                    <span class="departmentCode">
                                        ${departmentCode}
                                    </span>
                                    <span class="departmentName">
                                        ${departments[schoolCode][departmentCode]}
                                    </span>
                                </div>
                            `))}
                        </div>`
                    )) + "").replace(/,/g, ''))
                }
                </div>
            </div>  
        </div>
    )
}