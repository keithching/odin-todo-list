import {sidebar, TODOContent} from './DOM';
import { format } from 'date-fns'

// factory function for project creation
const ProjectFactory = (name) => {

    name = name || 'My Project';

    // an array to control how many TODO objects are there
    let TODOarray = [];
            
    return {
        name, 
        TODOarray
    };

};


// create TODO object with factory functions
// title, description, due date, priority, notes, checklist
const TODOFactory = (title, description, dueDate, priority) => {

    title = title || 'Title';
    description = description || 'Description';
    dueDate = dueDate || format(new Date(), 'MM/dd/yyyy');
    priority = priority || 'default';
    let completeStatus = false;
    let notes = [];
    let checklists = [];

    return { 
        title, 
        description, 
        dueDate, 
        priority, 
        completeStatus,
        notes,
        checklists
    };

};


// Project control interface as IIFE Module
const projectInterface = (() => {

    let ProjectArray = [];

    let currentProject;

    // create a new project object
    const create = () => {
        const Project = ProjectFactory('My Project');

        projectInterface.ProjectArray.push(Project);

        // save to localStorage
        projectInterface.saveToLocalStorage();

        return Project;
    };

    const setCurrentProject = (project) => currentProject = project;

    const getCurrentProject = () => currentProject;

    let currentToggle;

    const setToggle = (option) => currentToggle = option;

    const getToggle = () => currentToggle;

    const updateName = (project, name) => {
        project.name = name || 'My Project';

        // save to localStorage
        projectInterface.saveToLocalStorage();
    };
    
    const removeProject = (project) => {

        const projectIndex = projectInterface.ProjectArray.indexOf(project);
        projectInterface.ProjectArray.splice(projectIndex, 1);

        // save to localStorage
        projectInterface.saveToLocalStorage();
    };
    
    const saveToLocalStorage = () => {
        // save to localStorage
        localStorage.setItem('ProjectArray', JSON.stringify(projectInterface.ProjectArray));
    };


    return {
        create, 
        setCurrentProject, 
        getCurrentProject, 
        ProjectArray,
        setToggle,
        getToggle,
        updateName,
        removeProject,
        saveToLocalStorage
    };

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

        // save to localStorage
        projectInterface.saveToLocalStorage();
        
        return TODO;
    };

    // read the TODO and write to DOM
    const read = (object) => {
        TODOContent.create(object);
    };

    // update TODO fields
    const update = (object, property, value) => {

        if (property == 'title') {
            object.title = value || 'Object Title';

            // save to localStorage
            projectInterface.saveToLocalStorage(); 

            // update DOM
            return object.title;

        } else if (property == 'description') {
            object.description = value || 'Object Description';

            // save to localStorage
            projectInterface.saveToLocalStorage(); 

            // update DOM
            return object.description;

        } else if (property == 'dueDate') {
            object.dueDate = value || format(new Date(), 'MM/dd/yyyy');

            // save to localStorage
            projectInterface.saveToLocalStorage(); 

            // update DOM
            return object.dueDate;
        }



    };

    const setPriority = (option) => {
        currentTODO.priority = option;
        
        // save to localStorage
        projectInterface.saveToLocalStorage(); 

    };

    const getPriority = () => currentTODO.priority;

    const deleteTODO = (object) => {
        const project = projectInterface.getCurrentProject();
        const projectIndex = projectInterface.ProjectArray.indexOf(project);

        const index = projectInterface.ProjectArray[projectIndex].TODOarray.indexOf(object);

        // delete the TODO from array
        projectInterface.ProjectArray[projectIndex].TODOarray.splice(index, 1);

        // save to localStorage
        projectInterface.saveToLocalStorage(); 
    };

    const setCurrentTODO = (TODO) => currentTODO = TODO;

    const getCurrentTODO = () => currentTODO;

    const changeTODOStatus = (TODO) => {
        if (TODO.completeStatus == false) {
            TODO.completeStatus = true;
        } else {
            TODO.completeStatus = false;
        }
        // save to localStorage
        projectInterface.saveToLocalStorage(); 

    };

    const getTODOStatus = (TODO) => TODO.completeStatus;

    const addNotes = (TODO, value) => {
        // add individual note item into the notes array
        TODO.notes.push(value);

        // save to localStorage
        projectInterface.saveToLocalStorage();

        // return the array index for the individual note
        return TODO.notes.length - 1;
    };

    const updateNotes = (TODO, index, value) => {

        TODO.notes[index] = value;

        // save to localStorage
        projectInterface.saveToLocalStorage();
    };

    const deleteNotes = (TODO, index) => {

        // remove the item off the array
        TODO.notes.splice(index, 1);

        // save to localStorage
        projectInterface.saveToLocalStorage();

    };

    const addChecklist = (TODO) => {
        // add individual checklist array into the checklists array
        TODO.checklists.push([]);
        
        // save to localStorage
        projectInterface.saveToLocalStorage(); 

        // return the array index for the individual checklist
        return TODO.checklists.length - 1;
    };

    const deleteChecklist = (TODO, index) => {

        TODO.checklists.splice(index, 1);

        // save to localStorage
        projectInterface.saveToLocalStorage();

    };


    const addItemToChecklist = (TODO, checklistIndex) => {
        // add individual checklist item into the checklist of the checklists array
        const defaultValue = 'start typing here';

        TODO.checklists[checklistIndex].push(defaultValue);

        // save to localStorage
        projectInterface.saveToLocalStorage();

        return TODO.checklists[checklistIndex].length - 1;
    };

    const updateChecklistItem = (TODO, checklistIndex, itemIndex, value) => {

        TODO.checklists[checklistIndex][itemIndex] = value;

        // save to localStorage
        projectInterface.saveToLocalStorage();

    };


    const getChecklistItemValue = (TODO, checklistIndex, itemIndex) => {

        return TODO.checklists[checklistIndex][itemIndex];

    };


    return {
        create, 
        read, 
        update, 
        setPriority, 
        getPriority,
        deleteTODO, 
        setCurrentTODO, 
        getCurrentTODO, 
        changeTODOStatus,
        getTODOStatus,
        addNotes,
        updateNotes,
        deleteNotes,
        addChecklist,
        deleteChecklist,
        addItemToChecklist,
        updateChecklistItem,
        getChecklistItemValue
    };

})();


export {
    TODOInterface, 
    projectInterface
};