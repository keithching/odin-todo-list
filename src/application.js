import {sidebar, TODOContent} from './DOM';
import { format } from 'date-fns'

// factory function for project creation
const ProjectFactory = (name) => {

    name = name || 'Project Name';

    // an array to control how many TODO objects are there
    let TODOarray = [];
            
    return {name, TODOarray};
};


// create TODO object with factory functions
// title, description, due date, priority, notes, checklist
const TODOFactory = (title, description, dueDate, priority) => {

    title = title || 'Object Title';
    description = description || 'Object Description';
    dueDate = dueDate || format(new Date(), 'MM/dd/yyyy');
    priority = priority || 'Priority';
    let completeStatus = false;

    return { title, description, dueDate, priority, completeStatus};
};


// Project control interface as IIFE Module
const projectInterface = (() => {

    let ProjectArray = [];

    let currentProject;

    // create a new project object
    const create = () => {
        const Project = ProjectFactory('My Project');
        ProjectArray.push(Project);
        return Project;
    };

    const setCurrentProject = (project) => currentProject = project;

    const getCurrentProject = () => currentProject;

    return {create, setCurrentProject, getCurrentProject, ProjectArray};
})();


// TODO control interface as IIFE Module
const TODOInterface = (() => {

    let currentTODO;

    // create a TODO object under the current Project object
    const create = () => {
        const project = projectInterface.getCurrentProject();

        const TODO = TODOFactory('', '', '', '');

        // push TODO into the current Project's TODO array
        project.TODOarray.push(TODO);

        return TODO;
    };

    // read the TODO and write to DOM
    const read = (object) => {
        TODOContent.create(object);
        TODOContent.update(object);
    };

    // update TODO fields
    const update = (object, property, value) => {

        if (property == 'title') {
            object.title = value || 'Object Title';
            // update DOM
            return object.title;

        } else if (property == 'description') {
            object.description = value || 'Object Description';
            // update DOM
            return object.description;

        } else if (property == 'dueDate') {
            object.dueDate = value || format(new Date(), 'MM/dd/yyyy');
            // update DOM
            return object.dueDate;
        } else if (property == 'priority') {
            object.priority = value || 'Priority';
            // update DOM
            return object.priority;
        }

    };

    const deleteTODO = (object) => {
        const project = projectInterface.getCurrentProject();
        const projectIndex = projectInterface.ProjectArray.indexOf(project);

        const index = projectInterface.ProjectArray[projectIndex].TODOarray.indexOf(object);

        // delete the TODO from array
        projectInterface.ProjectArray[projectIndex].TODOarray.splice(index, 1);
    };

    const setCurrentTODO = (TODO) => currentTODO = TODO;

    const getCurrentTODO = () => currentTODO;

    const changeTODOStatus = (TODO) => {
        if (TODO.completeStatus == false) {
            TODO.completeStatus = true;
        } else {
            TODO.completeStatus = false;
        }
    };

    const getTODOStatus = (TODO) => TODO.completeStatus;

    return {
        create, 
        read, 
        update, 
        deleteTODO, 
        setCurrentTODO, 
        getCurrentTODO, 
        changeTODOStatus,
        getTODOStatus,
    };
})();


export {
    TODOInterface, projectInterface
};