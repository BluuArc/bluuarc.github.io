//globals for statcounter tracker
var sc_project=11034084;
var sc_invisible=1; 
var sc_security="3e7dba9f"; 
var scJsHost = (("https:" == document.location.protocol) ? "https://secure." : "http://www."); 

//parent must be a d3 object
function addProjectEntry(parent, options) {
    options = options || {};
    let content = options.content;
    if (Array.isArray(content)) {
        content = content.join("");
    }
    //regex based off of https://stackoverflow.com/questions/20731966/regex-remove-all-special-characters-except-numbers
    let projectName = options.name.replace(/[^a-zA-Z0-9]/g, "") || "emptyProject";
    let shortDescTag = `${projectName}ShortDesc`;
    let contentTag = `${projectName}Content`;
    let entry = parent.append('div').classed('panel', true)
        .classed('panel-primary', true)
        .classed('project-entry', true)
        .attr('id', projectName);

    //add title
    let entryTitle = entry.append('div').classed('panel-heading', true)
        .append('h4').classed('panel-title', true).classed('row', true);

    //add project name
    entryTitle.append('h4').attr('class', 'text-left col-md-10 col-xs-10 col-lg-10')
        .attr('style', 'margin-top:0; margin-bottom: 0;').html(options.name || "Empty Project");
    let arrowIndicator = entryTitle.append('div').attr('class', 'text-right col-md-2 col-xs-2 col-lg-2')
        .attr('style', 'margin-top:0; margin-bottom: 0;')
        .append('span').attr('class', 'glyphicon glyphicon-chevron-down').attr('id', 'arrow');

    let toggleFn = function () {
        $(`#${shortDescTag}`).collapse("toggle");
        $(`.panel-body>#${contentTag}`).collapse("toggle");
        $(`#${contentTag}-wrapper`).collapse("toggle");
        //on transition end code based on http://blog.teamtreehouse.com/using-jquery-to-detect-when-css3-animations-and-transitions-end
        $(`#${shortDescTag}`).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function (e) {
                //toggle arrow based on what is currently shown
                if (entry.select(`#${shortDescTag}`).classed('in')) {
                    // console.log("changing to down arrow");
                    arrowIndicator.classed('glyphicon-chevron-up', false);
                    arrowIndicator.classed('glyphicon-chevron-down', true);
                } else {
                    // console.log("changing to up arrow");
                    arrowIndicator.classed('glyphicon-chevron-down', false);
                    arrowIndicator.classed('glyphicon-chevron-up', true);
                };
            });
    }

    entry.select('.panel-heading').on('click', toggleFn);
    // entryTitle.on('click',toggleFn);

    let entryBody = entry.append('div').classed('panel-body', true)
    //short description
    entryBody.append('div').attr('id', `${shortDescTag}`)
        .classed('collapse', true).classed('in', true).classed('fade', true)
        .html(options.shortDesc || "Empty Short Description")
        .classed('in', true).classed('active', true);
    //long description
    entryBody.append('div').attr('id', `${contentTag}`)
        .classed('collapse', true).classed('fade', true)
        .html(content || "Empty Content");

    let entryFooter = entry.append('div').attr('id', `${contentTag}-wrapper`).classed('collapse', true) //wrapper div for collapsing
        .append('div').classed('panel-footer', true)
    // .append('div').classed('tab-content', true);
    entryFooter.append('div').attr('id', `${contentTag}`)
        .html(options.footer || "Empty Footer");

}

//pure javascript version of appending a script
//based off of https://howchoo.com/g/mmu0nguznjg/learn-the-slow-and-fast-way-to-append-elements-to-the-dom
function appendScript(url){
    return new Promise(function (fulfill, reject) {
        let e = document.createElement('script');
        e.src = url;
        e.onload = () => { fulfill(); };
        e.onerror = reject;
        document.body.appendChild(e);
    });
}

//load common scripts and trackers
function setupPage(currentPage,options){
    let common_page_scripts = [
        "https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.6/d3.min.js"
    ];
    let body;
    options = options || {};

    //load jQuery first
    return appendScript(common_page_scripts.shift())
        .then(() => {
            //load everything else
            let loadPromises = [];
            for(let c of common_page_scripts){
                loadPromises.push(appendScript(c));
            }
            return Promise.all(loadPromises); //wait for all scripts to load
        }).then(() => {//load navbar
            body = d3.select('body');
            if(!options.doNotLoadNavbar){
                $('body').prepend('<nav class="navbar navbar-inverse navbar-fixed-top" id="mainNavbarContainer"></nav>');
                let navbar = body.select('nav#mainNavbarContainer');
                let container = navbar.append('div').classed('container-fluid',true);
                
                let header = container.append('div').classed('navbar-header',true);
                //add button used for smaller screens
                let navButton = header.append('button').classed('navbar-toggle',true)
                    .attr('data-toggle','collapse').attr('data-target','#mainNavbar')
                for(let i = 0; i < 3; ++i){
                    navButton.append('span').classed('icon-bar',true);
                }
                header.append('a').classed('navbar-brand',true)
                    .attr('href','https://bluuarc.github.io').text("JCCC")
                    .attr('title',"Joshua Castor's Code Compendium");

                //add links
                let navLinksContainer = container.append('div').attr('id','mainNavbar')
                    .attr('class', 'collapse navbar-collapse')
                    .append('ul').attr('class', 'nav navbar-nav');

                let webLinks = [
                    {
                        name: 'Projects',
                        link: 'https://bluuarc.github.io/'
                    },
                    {
                        name: 'About',
                        link: 'https://bluuarc.github.io/about.html'
                    },
                    {
                        name: 'Contact',
                        link: 'https://bluuarc.github.io/contact.html'
                    },
                ];
                for(let w of webLinks){
                    // console.log("Adding link to", w.name);
                    navLinksContainer.append('li')
                        .classed('active', w.name === currentPage)
                        .append('a').attr('href',w.link)
                        .text(w.name);
                }
            }
        }).then(() => {//load stat counter tracker
            body.append('noscript').append('div').classed('statcounter',true)
                .append('a')
                    .attr('title', "shopify site analytics").attr('target','_blank')
                    .attr('href', 'http://statcounter.com/shopify/')
                .append('img')
                    .classed('statcounter',true).attr('alt','shopify site analytics')
                    .attr('src','//c.statcounter.com/11034084/0/3e7dba9f/1/');

            return appendScript(`${scJsHost}statcounter.com/counter/counter.js`);
        }).catch((err) => {
            console.log(err);
        });

}

function onLoad(pageName,afterLoadFunction){
    return setupPage(pageName).then(() => {
        afterLoadFunction();
    });
}