"use strict";

var jccc = jccc || new JCCC_App();

(function (postLoadFn) {
    let customComponents = function(){
        let table = Vue.component("bs-table", {
            props: ["thead-class","rows","names"],
            template:   `<table>
                            <thead class="bg-secondary">
                                <tr>
                                    <th class="text-center" v-for="name in names">{{ name }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="row in rows">
                                    <tr>
                                        <td class="align-middle" v-for="column in row" v-html="column"></td>
                                    </tr>
                                </template>
                            </tbody>
            
                        </table>`
        });

        let job_entry = Vue.component("job-entry", {
            props: ["job"],
            template:   `<div class="card-block">  
                            <div class="row">
                                <div class="col">
                                    <h4 class="card-title row">{{ job.name }}</h4>
                                    <h5 class="card-title row">{{ job.company }} | {{ job.location }}</h5>
                                </div>
                                <div class="col text-right">
                                    <h5 class="text-muted">{{ job.time }}</h5>
                                </div>
                            </div>
                            <div class="row">
                                <div class="card-block">
                                    <div class="card-text" v-html="job.desc">
                                    </div>
                                </div>
                            </div>
                            

                        </div>`
        });

        let job_list = Vue.component("job-list", {
            props: ["jobs"],
            template:   `<ul class="list-group list-grouo-flush job-list">
                            <template v-for="job in jobs">
                                <li class="list-group-item border-primary border-left-0 border-right-0 border-bottom-0">
                                    <job-entry :job="job"></job-entry>
                                </li>
                            </template>
                        </ul>`,
        });

        let courseworkApp = new Vue({
            el: "#courseworkCard",
            data: {
                courses: [
                    ["Program Design I (CS111)", "Java", "Fall 2015"],
                    ["Program Design II (CS141)", "C, C++", "Spring 2016"],
                    ["Mathematical Foundations of Computing (CS151)", "Tarski's World", "Spring 2016"],
                    ["Programming Practicum (CS211)", "C, Java", "Fall 2016"],
                    ["Data Structures (CS251)", "C, C++", "Fall 2016"],
                    ["Machine Organization (CS261)", "C, y86", "Fall 2016"],
                    ["Languages and Automata (CS301)", "JFLAP", "Spring 2017"],
                    ["Programming Language Design and Implementation (CS341)", "C++, F#, C#, SQL", "Spring 2017"],
                    ["Software Design (CS342)", "Java, Raspberry Pi, Node.js, design patterns", "Spring 2017"],
                    ["Computer Systems (CS361)", "C, pipelining, threading", "Spring 2017"],
                    ["Computer Design (CS362)", "C, Arduino", "Fall 2017"],
                    ["Communication and Ethical Issues in Computing (CS377)", "", "Fall 2017"],
                    ["Software Engineering I (CS440)", "Requirements Analysis, UML Diagrams", "Fall 2017"],
                    ["Computer Algorithms I (CS401)", "Algorithm Analysis", "Fall 2017"],
                    ["Undergraduate Research (CS398)", "JavaScript, D3.js, Leaflet", "Fall 2017"]
                ],
                columnNames: ["Course Name", "Languages/Technologies/Techniques", "Semester"]
            }
        }); 
        jccc.addApplication(courseworkApp,"coursework");

        let jobEntryApp = new Vue({
            el: "#workExperienceCard",
            data: {
                jobs: [ //in reverse chronological order
                    { 
                        name: "Research Experience Undergraduate",
                        location: "Chicago, IL",
                        company: "University of Illinois at Chicago",
                        time: "May 2017 - Dec 2017",
                        desc: `Designed a web-based tool to submit as an entry to VAST Challenge 2017. 
                            Collaborated with a group of 4 to develop and deploy a web-based service for Englewood. 
                            Learned how to develop and deploy Unity applications for CAVE2.<br>
                            <b>Relevant Projects</b>
                            <ul>
                                <li>VAST Challenge 2017: <a target="_blank" href="https://github.com/BluuArc/vast-challenge-2017">Repo</a> | <a target="_blank" href="https://bluuarc.github.io/vast-challenge-2017/challenge-2/">Demo</a></li>
                                <li>Bubbles TacTile Demo: <a target="_blank" href="https://github.com/BluuArc/bubbles-tactile-demo">Repo</a> | <a target="_blank" href="https://bluuarc.github.io/bubbles-tactile-demo/">Demo</a></li>
                                <li>Three.js Point Cloud Project: <a target="_blank" href="https://github.com/BluuArc/three.js-point-cloud-project">Repo</a> | <a target="_blank" href="https://bluuarc.github.io/three.js-point-cloud-project/">Demo</a></li>
                            </ul>` 
                    },
                    {
                        name: "Research Intern",
                        location: "Chicago, IL",
                        company: "University of Illinois at Chicago",
                        time: "Summer 2016",
                        desc: `Tested multiple websites to see which accessible web-commands are necessary for normal usage by disabling certain web standards and elements. 
                            Saved and analyzed data with Google Sheets.`
                    },
                    {
                        name: "Sophomore Level Student Peer Tutor",
                        location: "Chicago, IL",
                        company: "University of Illinois at Chicago",
                        time: "Jan 2017 - May 2017",
                        desc: `Tutored an average of 5 students per week in classes of Programming Practicum, Data Structures, and Machine Organization; included material in C and Java.`
                    },
                    {
                        name: "Freshman Level Student Peer Tutor",
                        location: "Chicago, IL",
                        company: "University of Illinois at Chicago",
                        time: "Aug 2016 - Dec 2016",
                        desc: `Tutored students in classes of Intro to Programming and Program Design; included material in C and Python.`
                    },
                ]
            }
        });
        jccc.addApplication(jobEntryApp, "jobEntries");


    }


    jccc.init('Home',
        {
            initHeader: true,
            attachTrackers: true,
            initCustomVueComponents: () => { initCommonCustomVueComponents(customComponents); },
            pageDivs: [
                {
                    name: "Home",
                    selector: ".page#HomePage"
                },
                {
                    name: "Projects",
                    selector: ".page#ProjectsPage"
                },
                {
                    name: "Contact",
                    selector: ".page#ContactPage"
                },   
            ],
            errorDiv: ".page#ErrorPage"
        },
        postLoadFn
    );
})(function(){ //run this after loading page
    if(window.location.search.indexOf("?") > -1){ //auto set page based on url
        let parameters = window.location.search.slice(1).split("&");
        let data = {};
        for(let p of parameters){
            let [key,value,extra] = p.split('=').map(decodeURIComponent);
            data[key] = value;
        }
        // console.log(data);
        if(data.link){
            jccc.changeDisplayedPage(data.link);
        }else{
            jccc.changeDisplayedPage('Home'); //default to home
        }
    } else {
        jccc.changeDisplayedPage('Home'); //default to home
    }

    function getData(url){
        return new Promise(function(fulfill,reject){
            $.get(url,function(response){
                fulfill(response);
            });
        });
    }

    // let repoData = [];
    // getData("https://api.github.com/users/BluuArc/repos")
    //     .then((data) => {
    //         console.log(data);
    //         repoData = data;

    //         let langPromises = [];
    //         for(let d of data){
    //             langPromises.push(getData(`${d.url}/languages`));
    //         }

    //         return Promise.all(langPromises);
    //     }).then((languageStats) => {
    //         console.log(languageStats);
    //     });


    // $.get("https://api.github.com/users/BluuArc/repos",function(response){
    //     let project_list = $("#projectStatsCard #project-list");

    //     let sorted_list = response.sort((a, b) => { return new Date(b.pushed_at) - new Date(a.pushed_at); });
    //     console.log(sorted_list);
    //     $.each(sorted_list,function(i,d){
    //         project_list.append(`<li><a href="${d.html_url}">${d.name}</a></li>`)
    //     })
    // })

    console.log("Ready");
});