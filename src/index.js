import './style.css';
import {loadCommonTemplate} from './commonTemplate';
import {loadProjectTemplate} from './projectTemplate';
import {loadTODOTemplate} from './TODOTemplate';
import {TODOInterface, projectInterface} from './application';
import {projectContent, TODOContent, sidebar} from './DOM';


// implementing localStorage from Web Storage API
// documentation : https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

if (storageAvailable('localStorage')) {
    // Yippee! We can use localStorage awesomeness
} else {
    // Too bad, no localStorage for us
    alert('no localStorage...');
}



// initialize page by loading the DOM templates
const initializePage = (() => {

    // initialize common DOM
    loadCommonTemplate();
    
    // initialize project DOM
    loadProjectTemplate();

    if (!localStorage.getItem('ProjectArray')) {
        // stringify before storing
        // https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
        localStorage.setItem('ProjectArray', JSON.stringify(projectInterface.ProjectArray));
        
    } else {
        // parse the JSON string
        projectInterface.ProjectArray = JSON.parse(localStorage.getItem('ProjectArray'));

        projectInterface.ProjectArray.forEach(project => {
            projectInterface.setCurrentProject(project);
            sidebar.create();
        });
    }

})();


// create a Project when button clicked
const createProject = (() => {

    document.querySelector('.BtnAddProject').addEventListener('click', () => {

        const project = projectInterface.create();
        projectInterface.setCurrentProject(project);
        sidebar.create();
        projectContent.create(projectInterface.getCurrentProject());
    
        // assign toggle to show All
        projectContent.resetToggle();

        // // create a function button for renaming project and delete project
        // projectContent.createFunctionButton();
    });
    
})();



