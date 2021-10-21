import './style.css';
import {loadCommonTemplate} from './commonTemplate';
import {loadProjectTemplate} from './projectTemplate';
import {loadTODOTemplate} from './TODOTemplate';
import {TODOInterface, projectInterface} from './application';
import {projectContent, TODOContent, sidebar} from './DOM';



// initialize common DOM
loadCommonTemplate();

// initialize project DOM
loadProjectTemplate();

// create a Project when button clicked
document.querySelector('.BtnAddProject').addEventListener('click', () => {
    const project = projectInterface.create();
    projectInterface.setCurrentProject(project);
    sidebar.create();
    projectContent.create(projectInterface.getCurrentProject());
});


