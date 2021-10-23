import './style.css';
import {loadCommonTemplate} from './commonTemplate';
import {loadProjectTemplate} from './projectTemplate';
import {loadTODOTemplate} from './TODOTemplate';
import {TODOInterface, projectInterface} from './application';
import {projectContent, TODOContent, sidebar} from './DOM';


const initializePage = (() => {

// initialize common DOM
loadCommonTemplate();

// initialize project DOM
loadProjectTemplate();

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
    });
    
})();