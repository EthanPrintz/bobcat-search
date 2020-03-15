import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import './css/SearchPage.css';

export default function SearchPage(){
    // Set state
    const [departments, setDepartments] = useState({});
    const [schools, setSchools] = useState({});

    // Query departments on component mount
    useEffect(() => {
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
    }, []);

    return(
        <div id="pageContainer">
            <div id="searchContainer">
                <div id="searchBar"></div>
            </div>
            <div id="departmentContainer">
                <div id="departmentTitle">Departments</div>
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
    )
}