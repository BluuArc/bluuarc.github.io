"use strict";

var jccc = jccc || new JCCC_App();

(function (postLoadFn) {
    function initCustomVueComponents(){
        let container = Vue.component("container", {
            template: `<div class="container">
                            <slot>No container content found.</slot>
                        </div>`
        });

        let card = Vue.component("card", {
            template: `<div class="card">
                            <slot>No card content found.</slot>
                        </div>`
        });

        let filler_image = Vue.component("filler-image", {
            props: ['width','height', 'class', 'style'],
            computed: {
                createImage: function(){
                    // originally from https://getbootstrap.com/docs/4.0/content/images/
                    let width = +this.width || 200;
                    let height = +this.height || 200;
                    console.log(width,height);
                    return `data:image/svg+xml;charset=UTF-8,<svg%20width%3D"${width}"%20height%3D"${height}"%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20viewBox%3D"0%200%20${width}%20${height}"%20preserveAspectRatio%3D"none"><defs><style%20type%3D"text%2Fcss">%23holder_15ec8c963ad%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3B<%2Fstyle><%2Fdefs><g%20id%3D"holder_15ec8c963ad"><rect%20width%3D"${width}"%20height%3D"${height}"%20fill%3D"%23777"><%2Frect><g><text%20x%3D"${width*0.1}"%20y%3D"${height*0.25}">Filler Image<%2Ftext><%2Fg><%2Fg><%2Fsvg>`;
                }
            },
            template: `<img :src="createImage" alt="filler image"></img>`,
            mounted: function(){
                console.log("Mounted image");
            }
        });

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

        let jobEntryApp = new Vue({
            el: "#workExperienceCard",
            data: {
                jobs: [ //in reverse chronological order
                    { 
                        name: "Research Experience Undergraduate",
                        location: "Chicago, IL",
                        company: "University of Illinois at Chicago",
                        time: "Summer 2017",
                        desc: `Designed a web-based tool to submit as an entry to VAST Challenge 2017. 
                            Collaborated with a group of 4 to develop and deploy a web-based service for Englewood. 
                            Learned how to develop and deploy Unity applications for CAVE2.<br>
                            <b>Relevant Projects</b>
                            <ul>
                                <li><a target="_blank" href="https://github.com/BluuArc/vast-challenge-2017">VAST Challenge 2017</a></li>
                                <li><a target="_blank" href="https://github.com/BluuArc/three.js-point-cloud-project">Three.js Point Cloud Project</a></li>
                                <li><a target="_blank" href="https://github.com/BluuArc/bubbles-tactile-demo">Bubbles TacTile Demo</a></li>
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
        })
    }


    jccc.init('Home',
        {
            initHeader: true,
            attachTrackers: true,
            initCustomVueComponents
        },
        postLoadFn
    );
})(function(){
    

    console.log("Ready");
});