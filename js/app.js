/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Define Global Variables
 * 
*/
const navList = document.getElementById('navbar__list');
const sectionList = document.querySelectorAll('section');

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

//Changes fontsize of section to 1.0em (precheck to changing fontsize of active section to 1.5em.)
function changeFontSizeForNonActiveSections() {
    for(section of sectionList){
        if(section.parentElement.tagName === 'MAIN') {
            section.style.fontSize = '1.0em';
        }
    }

}

// Scrolling smoothly to the active section.
function smoothScrollToActiveSection(eventTarget) {
    var activeSection1 = document.getElementById(eventTarget.getAttribute('href').slice(1));
    activeSection1.scrollIntoView({
        behavior: 'smooth'
    });
}

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

// build the nav
// Iterate through all sections that are immediate children of main.
function iterateThroughSectionsInMainAndCreateNav() {
    var fragment = document.createDocumentFragment();
    for (section of sectionList) {
        if(section.parentElement.tagName === 'MAIN') {
           // var itemToBeAdded = populateNav(section);
            let sectionName = section.getAttribute('data-nav');
            let listItem = document.createElement('li');
            let anchorItem = document.createElement('a');

            anchorItem.innerText = sectionName;
            anchorItem.classList.add('menu__link');
            anchorItem.setAttribute('href',`#${section.getAttribute('id')}`);

            listItem.appendChild(anchorItem);
            fragment.appendChild(listItem);
        }  
    }    
    navList.appendChild(fragment);
}

// Add class 'active' to section when near top of viewport
function determineActiveSectionForScroll() {
    var activeSection;
    /* This loop is for determining which section to be shown as active.
    Logic Used for determing if section is active 
    ----------------------------------------------
    1. Checks if section added is under Main element.
    2. If the entire section (from top to bottom) is within viewport, section is set to active.
    3. If section is partially visible in viewport, then percentage of section visible in viewport is calculated.
        3.1. If percentage is more or equal to 0.5, then section is set to active.
        3.2. If percentage is less than 0.5, then 
            3.2.1. If current section the last section, then it is set as active.
            3.2.2. If current section is not the last section, then next section is set as active.
    */
   for (let i = 0; i < sectionList.length; i++) {
        if (sectionList[i].parentElement.tagName === 'MAIN') {
            var sectionBoundingSize = sectionList[i].getBoundingClientRect();
            if ((sectionBoundingSize.top >= 0) && (sectionBoundingSize.bottom <= window.innerHeight)) {
                activeSection = sectionList[i];
                break;
            }
            else if ((sectionBoundingSize.top < window.innerHeight) && (sectionBoundingSize.bottom >= 0)) {
                if (sectionBoundingSize.top < 0) {
                    var calculateSectionScreenPercentage = (sectionBoundingSize.height + sectionBoundingSize.top)/sectionBoundingSize.height;
                    if (calculateSectionScreenPercentage >= 0.5) {
                        activeSection = sectionList[i];
                    }
                    else {
                        if(i === sectionList.length-1) {
                            activeSection = sectionList[i];
                        }
                        else {
                            activeSection = sectionList[i+1];
                        }
                    }
                }
            }
        }
    }
    return activeSection;
}

// Scroll to anchor ID using scrollTO event
// Setting sections to active on scroll. Scroll EventListener.
function scrollSectionToActive() {
    var activeSection = determineActiveSectionForScroll();    
    
    /*If active section based on scroll is the same as the currently active section.
    Set fontSize style to 1.5em for the active section,
    Modify anchor element in nav to reflect the active section corresponding to scroll */
    if(activeSection.getAttribute('class') === 'your-active-class') {
        changeFontSizeForNonActiveSections();
        activeSection.style.fontSize = '1.5em';
        // Highlighting the anchor element in the nav, corresponding to the active section.
        let listOfAnchorElements = document.getElementsByTagName('a');
        for(anchorElement of listOfAnchorElements) {
            // Setting default style to all anchor elements.            
            anchorElement.setAttribute('style', null);
            anchorElement.setAttribute('style', 'color: #000');

            // Highlighting the anchor element corresponding the active section.
            if((anchorElement.parentElement.parentElement.parentElement.nodeName === 'NAV') && 
            (anchorElement.getAttribute('href') === `#${activeSection.getAttribute('id')}`)) {
                anchorElement.setAttribute('style', 'background: #333; color: #fff');
            }
        }   
    }
    /*If active section based on scroll is different than the last currently active section,
    Update new active section,
    Set fontSize style to 1.5em for the active section,
    Modify anchor element in nav to reflect the active section corresponding to scroll */
    else {
        let currentActiveSection = document.querySelectorAll('.your-active-class');
        currentActiveSection[0].classList.remove('your-active-class');        
        activeSection.classList.add('your-active-class');
        changeFontSizeForNonActiveSections();
        activeSection.style.fontSize = '1.5em';

        // Highlighting the anchor element in the nav, corresponding to the active section.
        let listOfAnchorElements = document.getElementsByTagName('a');
        for(anchorElement of listOfAnchorElements) {
            // Setting default style to all anchor elements.            
            anchorElement.setAttribute('style', null);
            anchorElement.setAttribute('style', 'color: #000');

            // Highlighting the anchor element corresponding the active section.
            if((anchorElement.parentElement.parentElement.parentElement.nodeName === 'NAV') && 
            (anchorElement.getAttribute('href') === `#${activeSection.getAttribute('id')}`)) {
                anchorElement.setAttribute('style', 'background: #333; color: #fff');                              
            }
        }   
    }
}

/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu
// PopulateNav only after DOM Content is Loaded.
document.addEventListener('DOMContentLoaded', iterateThroughSectionsInMainAndCreateNav);

// Adding scroll event listener on window.
window.addEventListener('scroll', scrollSectionToActive, true);

// Adding click event listener.
document.addEventListener('click', function checkIfItsNavLink(event) {
    event.preventDefault();    
    window.removeEventListener('scroll', scrollSectionToActive, true);
    
    if (event.target.nodeName === 'A') {
        //Clear any styling that might have been added to the active section during scroll listener.
        var listOfAnchorElements = document.getElementsByTagName('a');
        for(anchorElement of listOfAnchorElements) {
            anchorElement.setAttribute('style', null);
            anchorElement.setAttribute('style', 'color: #000');
        }
        setActiveSection(event.target);    
    }
    window.addEventListener('scroll', scrollSectionToActive, true);
});

// Scroll to section on link click
// Set sections as active
// Set section selected in nav to active (Click EventListener).
function setActiveSection(eventTarget) {
    let sectionRef = (eventTarget.getAttribute('href')).slice(1);
    let sectionToBeSetActive = document.getElementById(sectionRef);

    if (sectionToBeSetActive.getAttribute('class') === 'your-active-class') {
        changeFontSizeForNonActiveSections();
        sectionToBeSetActive.style.fontSize = '1.5em';
        return;        
    }
    else {
        let currentActiveSection1 = document.querySelectorAll('.your-active-class');
        currentActiveSection1[0].classList.remove('your-active-class');
        sectionToBeSetActive.classList.add('your-active-class');
        changeFontSizeForNonActiveSections();
        sectionToBeSetActive.style.fontSize = '1.5em';
        smoothScrollToActiveSection(event.target);
    }
}
