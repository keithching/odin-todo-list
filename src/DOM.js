import {TODOInterface, projectInterface} from './application';
import {loadProjectTemplate} from './projectTemplate';
import {loadTODOTemplate} from './TODOTemplate';
import { parse, isDate, getDate, getMonth, getYear } from 'date-fns'

// show the individual project's TODO as card
const projectContent = (() => {

    const create = (project) => {

        // clear existing DOM
        const right = document.querySelector('.right');
        let child = right.lastElementChild; 
        while (child) {
            right.removeChild(child);
            child = right.lastElementChild;
        }
        
        // load project template
        loadProjectTemplate();

        const container = document.querySelector('.right .container');
        container.setAttribute('data-project-index', projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject()));

        // create a addTODO card
        const addTODOCard = document.createElement('div');
        addTODOCard.classList.add('addTODOCard');
        addTODOCard.setAttribute('data-project-index', projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject()));

        const addTODOBtn = document.createElement('button');
        addTODOBtn.classList.add('addTODO_btn');
        addTODOBtn.textContent = '+';

        // add TODO object to current Project when addTODO card is clicked
        addTODOBtn.addEventListener('click', () => {

            const projectDisplay = document.querySelector(`.PROJECT_display[data-project-index='${projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject())}']`);

            // set current project
            projectInterface.setCurrentProject(projectInterface.ProjectArray[projectDisplay.getAttribute('data-project-index')]);

            // current a new TODO
            const TODO = TODOInterface.create();

            // add to sidebar
            const todoDisplay = document.createElement('div');
            todoDisplay.classList.add('TODO_display');
            todoDisplay.setAttribute('data-project-index', projectDisplay.getAttribute('data-project-index'));
            todoDisplay.setAttribute('data-todo-index', projectInterface.getCurrentProject().TODOarray.indexOf(TODO));     
            todoDisplay.textContent = projectInterface.getCurrentProject().TODOarray[todoDisplay.getAttribute('data-todo-index')].title;

            todoDisplay.addEventListener('click', () => {
                // set the clicked TODO to be the current TODO
                TODOInterface.setCurrentTODO(projectInterface.ProjectArray[projectDisplay.getAttribute('data-project-index')].TODOarray[todoDisplay.getAttribute('data-todo-index')]);

                TODOInterface.read(TODOInterface.getCurrentTODO());

                // highlight the current selected TODO
                sidebar.highlightCurrentTODO();
            });
            
            projectDisplay.insertBefore(todoDisplay, projectDisplay.lastElementChild);

            // add card to container
            makeCard(TODO);

            // update TODO counter 
            const ProjectIndex = projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject());
            const currentProject = document.querySelector(`[data-project-index='${ProjectIndex}']`);
            const counter = currentProject.querySelector('.PROJECT_display_counter');
            counter.textContent = projectInterface.ProjectArray[ProjectIndex].TODOarray.length;
        });

        const addTODOText = document.createElement('p');
        addTODOText.classList.add('addTODO_text');
        addTODOText.textContent = 'add TODO';

        addTODOCard.appendChild(addTODOBtn);
        addTODOCard.appendChild(addTODOText);

        container.appendChild(addTODOCard);

        // add cards of the current project to container
        project.TODOarray.forEach(TODO => {
            makeCard(TODO);
        });

    };

    const makeCard = (TODO) => {
            // add a card to the container
            const container = document.querySelector('.right .container');

            if (container) {

                const project = projectInterface.getCurrentProject();

                const card = document.createElement('div');
                card.classList.add('TODOCard');
                card.setAttribute('data-project-index', projectInterface.ProjectArray.indexOf(project));
                card.setAttribute('data-todo-index', project.TODOarray.indexOf(TODO));
    
                const title = document.createElement('div');
                title.classList.add('card_title');
                const titleText = document.createElement('p');
                titleText.textContent = TODO.title;
    
                title.appendChild(titleText);
                card.appendChild(title);
    
            
                const dueDate = document.createElement('div');
                dueDate.classList.add('card_dueDate');
                dueDate.textContent = TODO.dueDate;
            
                card.appendChild(dueDate);
            
                const priority = document.createElement('div');
                priority.classList.add('card_priority');
                priority.textContent = TODO.priority;
            
                card.appendChild(priority);
                
                container.insertBefore(card, container.lastElementChild);

                card.addEventListener('click', () => {

                    // set the clicked TODO to be the current TODO
                    TODOInterface.setCurrentTODO(projectInterface.ProjectArray[card.getAttribute('data-project-index')].TODOarray[card.getAttribute('data-todo-index')]);
    
                    TODOInterface.read(TODOInterface.getCurrentTODO());
    
                    // highlight the current selected TODO
                    sidebar.highlightCurrentTODO();
                });
            }
    };

    return { create, makeCard };
})();


// DOM right hand side
// module IIFE
const TODOContent = (() => {

    const create = (object) => {

        // clear existing DOM
        const right = document.querySelector('.right');
        let child = right.lastElementChild; 
        while (child) {
            right.removeChild(child);
            child = right.lastElementChild;
        }
    
        loadTODOTemplate();

        const top = document.querySelector('.right .top');
        
        // Title
        const title = document.createElement('div');
        title.classList.add('TODO_title');
        const titleText = document.createElement('p');
        titleText.textContent = object.title;
    
        title.appendChild(titleText);
        top.appendChild(title);
    
        // Description
        const description = document.createElement('div');
        description.classList.add('TODO_description');
        const descriptionText = document.createElement('p');
        descriptionText.textContent = object.description;
    
        description.appendChild(descriptionText);
        top.appendChild(description);
    
        const dueDate = document.createElement('div');
        dueDate.classList.add('TODO_dueDate');
        const dueDateText = document.createElement('p');
        dueDateText.textContent = object.dueDate;

        dueDate.appendChild(dueDateText);
        top.appendChild(dueDate);
    
        const priority = document.createElement('div');
        priority.classList.add('TODO_priority');
        const priorityText = document.createElement('p');
        priorityText.textContent = object.priority;
    
        priority.appendChild(priorityText);
        top.appendChild(priority);
    

        // TRIAL: put delete button here
        const bottom = document.querySelector('.right .bottom');

        const deleteBtn = document.createElement('button');

        deleteBtn.textContent = 'delete TODO';
        deleteBtn.addEventListener('click', () => sidebar.deleteTODO(object));

        bottom.appendChild(deleteBtn);

        
        // TRIAL: put mark as complete here
        const statusBtn = document.createElement('button');

        statusBtn.textContent = 'update status';
        statusBtn.addEventListener('click', () => TODOContent.changeStatus(object));

        bottom.appendChild(statusBtn);

    };

    // update the values of the TODO properties
    const update = (object) => {
    
        // TODO
        const DOMs = [
            {
                class: '.TODO_title',
                property: 'title'
            },
            {
                class: '.TODO_description',
                property: 'description'
            },
            {
                class: '.TODO_dueDate',
                property: 'dueDate'
            },
            {
                class: '.TODO_priority',
                property: 'priority'
            },
        ];


        DOMs.forEach(DOM => {
            
            const element = document.querySelector(DOM.class);
    
            let tmp = element.firstElementChild;
    
            element.addEventListener('click', () => {
    
                // only allow triggering the code block once
                if (event.target == tmp) {

                        const input = document.createElement('input');
                        input.value = element.textContent;
                        input.autofocus = true;
                        element.removeChild(element.lastElementChild);
                        element.appendChild(input);

                        // update object property's value on change
                        input.addEventListener('change', () => {
                            const elementText = document.createElement('p');
                            
                            if (DOM.property == 'dueDate') {

                                const newDate = parse(input.value, 'MM/dd/yyyy', new Date());

                                if (newDate == 'Invalid Date') {
                                    console.log('invalid date, please input again');
                                    // pop up message to DOM to user
                                } else {
                                    elementText.textContent = TODOInterface.update(object, DOM.property, input.value);
                                    element.removeChild(element.lastElementChild);
                                    element.appendChild(elementText);
                                    // update the variable for checking upon latter click events
                                    tmp = elementText;
                                    const project = projectInterface.getCurrentProject();
                                    sidebar.updateTODO(object);
                                }
                            } else {
                                elementText.textContent = TODOInterface.update(object, DOM.property, input.value);
                                element.removeChild(element.lastElementChild);
                                element.appendChild(elementText);
                                // update the variable for checking upon latter click events
                                tmp = elementText;
                                const project = projectInterface.getCurrentProject();
                                sidebar.updateTODO(object);
                            }
                        });
                    }    
    
            });
    
        });    
    };

    const changeStatus = (object) => {

        // update the object property's value
        TODOInterface.changeTODOStatus(object);

        console.log(TODOInterface.getTODOStatus(object));

        

    };


    return {create, update, changeStatus};
})();


// DOM left hand side
// sidebar module IIFE
const sidebar = (() => {

    // create the current project to DOM
    const create = () => {

        const left = document.querySelector('.left');

        const currentProject = projectInterface.getCurrentProject();

        const projectDisplay = document.createElement('div');
        projectDisplay.classList.add('PROJECT_display');
        projectDisplay.setAttribute('data-project-index', projectInterface.ProjectArray.indexOf(currentProject));

        const projectDisplayTitle = document.createElement('div');
        projectDisplayTitle.classList.add('PROJECT_display_title');

        const projectDisplayText = document.createElement('p');
        projectDisplayText.classList.add('PROJECT_display_text');
        projectDisplayText.textContent = currentProject.name;

        const projectDisplayCounter = document.createElement('p');
        projectDisplayCounter.classList.add('PROJECT_display_counter');
        projectDisplayCounter.textContent = currentProject.TODOarray.length;

        projectDisplayTitle.appendChild(projectDisplayText);
        projectDisplayTitle.appendChild(projectDisplayCounter);

        projectDisplay.appendChild(projectDisplayTitle);

        // create the project Content DOM when clicked
        projectDisplayText.addEventListener('click', () => {
            
            // set clicked as current project 
            projectInterface.setCurrentProject(projectInterface.ProjectArray[projectDisplay.getAttribute('data-project-index')]);

            // remove current highlight of TODOs
            sidebar.removeHighlightOfTODO();

            // create the project DOM content
            projectContent.create(projectInterface.getCurrentProject());
        });


        // create the add TODO DOM
        const addTODO = document.createElement('div');
        addTODO.classList.add('addTODO');
        addTODO.setAttribute('data-project-index', projectInterface.ProjectArray.indexOf(currentProject));

        const addTODOBtn = document.createElement('button');
        addTODOBtn.classList.add('addTODO_btn');
        addTODOBtn.textContent = '+';

        // add TODO object to current Project
        addTODOBtn.addEventListener('click', () => {

            // set current project
            projectInterface.setCurrentProject(projectInterface.ProjectArray[addTODO.getAttribute('data-project-index')]);

            // current a new TODO
            const TODO = TODOInterface.create();

            const todoDisplay = document.createElement('div');
            todoDisplay.classList.add('TODO_display');
            todoDisplay.setAttribute('data-project-index', addTODO.getAttribute('data-project-index'));
            todoDisplay.setAttribute('data-todo-index', projectInterface.getCurrentProject().TODOarray.indexOf(TODO));     
            todoDisplay.textContent = projectInterface.getCurrentProject().TODOarray[todoDisplay.getAttribute('data-todo-index')].title;

            todoDisplay.addEventListener('click', () => {
                // set the clicked TODO to be the current TODO
                TODOInterface.setCurrentTODO(projectInterface.ProjectArray[addTODO.getAttribute('data-project-index')].TODOarray[todoDisplay.getAttribute('data-todo-index')]);

                TODOInterface.read(TODOInterface.getCurrentTODO());

                // highlight the current selected TODO
                sidebar.highlightCurrentTODO();
            });
            
            projectDisplay.insertBefore(todoDisplay, projectDisplay.lastElementChild);

            // add a card to the container
            if (document.querySelector('.right .container')) {
                if (document.querySelector('.right .container').getAttribute('data-project-index') == projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject())) {
                    projectContent.makeCard(TODO);    
                }
            }

            // update TODO counter 
            const ProjectIndex = projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject());
            const currentProject = document.querySelector(`[data-project-index='${ProjectIndex}']`);
            const counter = currentProject.querySelector('.PROJECT_display_counter');
            counter.textContent = projectInterface.ProjectArray[ProjectIndex].TODOarray.length;
        });

        const addTODOText = document.createElement('p');
        addTODOText.classList.add('addTODO_text');
        addTODOText.textContent = 'add TODO';

        addTODO.appendChild(addTODOBtn);
        addTODO.appendChild(addTODOText);

        projectDisplay.appendChild(addTODO);

        left.appendChild(projectDisplay);

    };

    // update TODO arrays, refreshing DOM
    const updateTODO = (object) => {

        const ProjectIndex = projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject());

        const TODOIndex = projectInterface.getCurrentProject().TODOarray.indexOf(object);

        const currentTODO = document.querySelector(`[data-project-index='${ProjectIndex}'][data-todo-index='${TODOIndex}']`);

        // update the title at sidebar DOM
        currentTODO.textContent = projectInterface.getCurrentProject().TODOarray[TODOIndex].title;

    };

    const highlightCurrentTODO = () => {

        // const currentProject = projectInterface.getCurrentProject();
        const currentTODO = TODOInterface.getCurrentTODO();

        // set the currentTODO's project as the current Project
        projectInterface.ProjectArray.forEach(project => {
            if (project.TODOarray.indexOf(currentTODO) != -1) {
                projectInterface.setCurrentProject(project);
            }
        });

        const currentProject = projectInterface.getCurrentProject();

        // All the TODOs at DOM
        const TODOs = document.querySelectorAll(`[data-todo-index]`);

        projectInterface.ProjectArray.forEach(project => {
            TODOs.forEach(TODO => {
                if (TODO.getAttribute('data-todo-index') == currentProject.TODOarray.indexOf(currentTODO) && TODO.getAttribute('data-project-index') == projectInterface.ProjectArray.indexOf(currentProject)) {
                    TODO.classList.add('currentTODO');
                } else {
                    TODO.classList.remove('currentTODO');
                }            
            });
        });
    };

    const removeHighlightOfTODO = () => {

        const TODOs = document.querySelectorAll(`[data-todo-index]`);

        projectInterface.ProjectArray.forEach(project => {
            TODOs.forEach(TODO => {
                TODO.classList.remove('currentTODO');
            });
        });

    };

    const deleteTODO = (object) => {

        const projectIndex = projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject());

        // delete from sidebar DOM
        const TODO = document.querySelector(`[data-project-index='${projectIndex}'][data-todo-index='${projectInterface.ProjectArray[projectIndex].TODOarray.indexOf(object)}']`);

        // remove TODO from DOM
        TODO.remove();

        // delete the TODO from TODOarray of the current project
        TODOInterface.deleteTODO(object);

        // reassign the data-todo-index to the current project's TODO
        const TODOs = document.querySelectorAll(`.TODO_display[data-project-index='${projectIndex}']`);

        // reassign consecutively
        let i = 0;

        TODOs.forEach(TODO => {
            TODO.setAttribute('data-todo-index', i);
            i++;
        });

        // update TODO counter 
        const ProjectIndex = projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject());
        const currentProject = document.querySelector(`[data-project-index='${ProjectIndex}']`);
        const counter = currentProject.querySelector('.PROJECT_display_counter');
        counter.textContent = projectInterface.ProjectArray[ProjectIndex].TODOarray.length;

        // display the Project DOM after each deletion
        projectContent.create(projectInterface.getCurrentProject());
    };

    return {create, updateTODO, highlightCurrentTODO, removeHighlightOfTODO, deleteTODO};
})();


export {projectContent, TODOContent, sidebar};