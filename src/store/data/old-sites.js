export default [
  {
    lastUpdated: 'Jan 5, 2017',
    link: 'http://bluuarc.github.io/old/index_v001.html',
    name: 'My First Site',
    description: 'Very first version of the site. Utilized Boostrap 3.3.7 and jQuery 1.12.4 with traditional hardcoded pages for index, about, and contact.',
    image: require('../../assets/img/old_sites/v001.PNG')
  },
  {
    lastUpdated: 'Dec 12, 2017',
    link: 'http://bluuarc.github.io/old/index_v002.html',
    name: 'The SPA Treatment (Attempt 1) - Bootstrap',
    description: `First attempt at a SPA style site. Used Bootstrap 4.0.0-beta with the Darkly Bootstrap theme.
      All the routing was done with pure JS (i.e. no framework or libary used for routing).
      A lot of the core layout was defined here (3 main pages, GitHub style language bars, etc.).
      This was also my first attempt at using Vue, but I didn't quite understand how frameworks like Vue worked and ended up with multiple Vue instances on a single page in an attempt to separate data.
      These instances included the main instance for the page, an instance for the coursework card, and an instance for the job entries card.`,
    image: require('../../assets/img/old_sites/v002.PNG')
  },
  {
    lastUpdated: 'May 14, 2018',
    link: 'http://bluuarc.github.io/old/index_v003.html',
    name: 'The SPA Treatment (Attempt 2) - Material Design',
    description: `This was a rewrite of the Bootstrap version using Material Components for Web (a.k.a. Material Design).
      I experimented quite a bit with this one. From the Bootstrap version came the basic layout and routing code. What was new was a little spinning animation on first loading the page.
      Most necessary scripts were loaded once the spinner was showing, resulting in a slightly faster first-load time.
      There were separate Vue instances for the Home Page, Projects Page, Contact Page, Error Page, and for the Page Controller. (I had the right idea of separating those portions, but had the wrong implementation of using separate Vue instances instead of components.
      The Home Page had a nifty title bar that follows where the user scrolls for easier navigation.
      All the language listings in the project bars were buttons for an unfinished filter/search filter.
      The Contact Page changed from a simple list of links to a list of icons with titles.`,
    image: require('../../assets/img/old_sites/v003.PNG')
  },
  {
    isCurrent: true,
    link: 'http://bluuarc.github.io/',
    name: 'The SPA Treatment (Attempt 3) - Getting the Correct Point of Vue',
    description: `The current version of the site.
      It uses Vuetify for most of the components, as well as Webpack for bundling.
      By this point, I've made a couple 'proper' Vue applications using the webpack boilerplate (bf-mt, Coliberate), so I feel pretty confident in the page and file structure of this version.
      For this version, I try to limit the amount of libraries I import and try to stick to vanilla JS as much as possible (which means no using jQuery or d3 for DOM manipulation).
      I also try to limit the amount of color overall, making them more noticeable wherever I do put color.
      Some differences from Attempt 2 (at the time of writing) include lack of loading screen, multiple Vue instances, and the Home page scroll-navigator.
      This version also features proper search, filter, and sort functionality, which wasn't fully implemented in Attempt 2.`
  }
];
