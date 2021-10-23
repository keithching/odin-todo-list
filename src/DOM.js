import {TODOInterface, projectInterface} from './application';
import {loadProjectTemplate} from './projectTemplate';
import {loadTODOTemplate} from './TODOTemplate';
import { parse, isDate, getDate, getMonth, getYear } from 'date-fns';

import TrashIcon from './trash.svg';
import CircleIcon from './circle.svg';
import CircleHalfFillIcon from './circle-half.svg';
import CircleFillIcon from './circle-fill.svg';


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
            projectContent.makeCard(TODO);

            // update TODO counter 
            sidebar.updateTODOCounter();
        });

        addTODOCard.appendChild(addTODOBtn);
        container.appendChild(addTODOCard);

        // add cards of the current project to container
        project.TODOarray.forEach(TODO => {
            makeCard(TODO);
        });

    };

    const makeCard = (TODO) => {

            // check current show toggle setting
            const currentToggle = projectInterface.getToggle();

            // exit function if current TODO's status not match with the current Toggle
            if (TODO.completeStatus == false && currentToggle == 'Complete') {
                return;
            } else if (TODO.completeStatus == true && currentToggle == 'Active') {
                return;
            }

            // add a card to the container
            const container = document.querySelector('.right .container');

            if (container) {

                const project = projectInterface.getCurrentProject();

                const card = document.createElement('div');
                card.classList.add('TODOCard');
                card.setAttribute('data-project-index', projectInterface.ProjectArray.indexOf(project));
                card.setAttribute('data-todo-index', project.TODOarray.indexOf(TODO));

                // TITLE
                const title = document.createElement('div');
                title.classList.add('card_title');
                const titleText = document.createElement('p');
                titleText.textContent = TODO.title;
    
                title.appendChild(titleText);
                card.appendChild(title);
    
                // DUE DATE
                const dueDate = document.createElement('div');
                dueDate.classList.add('card_dueDate');
                dueDate.textContent = TODO.dueDate;
            
                card.appendChild(dueDate);
            
                // PRIORITY
                const priority = TODO.priority;

                if (priority == 'default') {
                    card.classList.add('card_priorityDefault');
                } else if (priority == 'medium') {
                    card.classList.add('card_priorityMedium');
                } else if (priority == 'high') {
                    card.classList.add('card_priorityHigh');
                }

            
                // STATUS
                const status = document.createElement('div');
                status.classList.add('card_status');
                if (TODO.completeStatus == false) {
                    status.textContent = 'Ongoing';
                } else {
                    status.textContent = 'Done';
                }

                card.appendChild(status);

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

    const filterCards = () => {

        let filteredArray = [];

        const filterOption = projectInterface.getToggle();

        if (filterOption == 'All') {
            filteredArray = projectInterface.getCurrentProject().TODOarray;
        } else if (filterOption == 'Active') {
            filteredArray = projectInterface.getCurrentProject().TODOarray.filter(TODO => TODOInterface.getTODOStatus(TODO) == false);
        } else if (filterOption == 'Complete') {
            filteredArray = projectInterface.getCurrentProject().TODOarray.filter(TODO => TODOInterface.getTODOStatus(TODO) == true);
        }

        // create all cards on DOM, then remove the unmatching cards with the filter Array
        projectContent.create(projectInterface.getCurrentProject());

        // get all objects from the current DOM TODO cards
        const TODOs = document.querySelectorAll('.TODOCard');
        // console.log(TODOs);
        TODOs.forEach(TODO => {

            const currentObject = projectInterface.getCurrentProject().TODOarray[TODO.getAttribute('data-todo-index')];

            // compare with the filtered array
            if (!filteredArray.find(object => object == currentObject)) {
                // remove the cards that are not matching with the filtered array TODOs
                TODO.remove();
            } else {
                // do nothing
            }
        });
    };

    const resetToggle = () => {

        const toggle = document.querySelector('.toggle');

        toggle.childNodes.forEach(child => {

            child.classList.remove('currentShowSelection');

        });

        projectInterface.setToggle('All');
        const showAll = document.querySelector('.toggle .showAll');
        showAll.classList.add('currentShowSelection');
    };


    return { 
        create, 
        makeCard, 
        filterCards, 
        resetToggle,
    };
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
        const topLeft = document.querySelector('.top .topLeft');
        const topRight = document.querySelector('.top .topRight');
        const topRightTop = document.querySelector('.top .topRight .topRightTop');
        const topRightBottom = document.querySelector('.top .topRight .topRightBottom');

        // Title
        const title = document.createElement('div');
        title.classList.add('TODO_title');
        const titleText = document.createElement('span');
        
        // make it expandable
        titleText.setAttribute('class', 'input');
        titleText.setAttribute('role', 'textbox');
        titleText.setAttribute('contenteditable', true);

        titleText.textContent = object.title;

        titleText.onblur = () => {
            object.title = titleText.textContent;
            sidebar.updateTODO(object);
        };
    
        title.appendChild(titleText);
        topLeft.appendChild(title);
    
        // Description
        const description = document.createElement('div');
        description.classList.add('TODO_description');
        const descriptionText = document.createElement('span');
        
        // make it expandable
        descriptionText.setAttribute('class', 'input');
        descriptionText.setAttribute('role', 'textbox');
        descriptionText.setAttribute('contenteditable', true);
        descriptionText.textContent = object.description;
        descriptionText.onblur = () => object.description = descriptionText.textContent;

        description.appendChild(descriptionText);
        topLeft.appendChild(description);
    

        // DUE DATE
        const dueDate = document.createElement('div');
        dueDate.classList.add('TODO_dueDate');
        const dueDateText = document.createElement('input');
        dueDateText.value = object.dueDate;

        const dueDateErrorMessage = document.createElement('p');
        dueDateErrorMessage.textContent = 'invalid date';
        dueDateErrorMessage.classList.add('TODO_dueDateErrorMessage');
        dueDateErrorMessage.classList.add('dueDateErrorMessage_hide');

        dueDateText.onblur = () => {

            const newDate = parse(dueDateText.value, 'MM/dd/yyyy', new Date());

            if (newDate != 'Invalid Date') {
                dueDateText.classList.remove('error');
                dueDateErrorMessage.classList.add('dueDateErrorMessage_hide');
                object.dueDate = dueDateText.value;
            } else {
                dueDateErrorMessage.classList.remove('dueDateErrorMessage_hide');
                dueDateText.classList.add('error');
                dueDateText.focus();
            }

        };

        // esc key & enter key support - blur
        document.addEventListener('keydown', () => {
            if (event.key === "Escape" || event.key === "Enter") {

                if (event.target == dueDateText) {

                    const newDate = parse(dueDateText.value, 'MM/dd/yyyy', new Date());

                    if (newDate != 'Invalid Date') {
                        dueDateText.classList.remove('error');
                        dueDateErrorMessage.classList.add('dueDateErrorMessage_hide');
                        object.dueDate = dueDateText.value;
                        dueDateText.blur();
                    } else {
                        dueDateErrorMessage.classList.remove('dueDateErrorMessage_hide');
                        dueDateText.classList.add('error');
                        dueDateText.focus();
                    }

                } else if (event.target == titleText) {
                    titleText.blur();
                } else if (event.target == descriptionText) {
                    descriptionText.blur();
                }

            }
        });

        dueDate.appendChild(dueDateText);
        dueDate.appendChild(dueDateErrorMessage);
        topRightTop.appendChild(dueDate);


        // DELETE
        const deleteTODO = document.createElement('div');
        deleteTODO.classList.add('delete');
        const deleteBtn = new Image();
        deleteBtn.src = TrashIcon;
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', () => sidebar.deleteTODO(object));
        const deleteMessage = document.createElement('p');

        deleteTODO.appendChild(deleteBtn);

        topRightBottom.appendChild(deleteTODO);


        // PRIORITY DISPLAY
        const priorityDisplay = document.createElement('p');
        priorityDisplay.classList.add('priorityDisplay');
        priorityDisplay.textContent = `${TODOInterface.getPriority()} priority`;
        if (TODOInterface.getPriority() == 'default') {
            priorityDisplay.classList.add('priorityDefault');
        } else if (TODOInterface.getPriority() == 'medium') {
            priorityDisplay.classList.add('priorityMedium');
        } else if (TODOInterface.getPriority() == 'high') {
            priorityDisplay.classList.add('priorityHigh');
        }

        priorityDisplay.addEventListener('click', () => {
            if (TODOInterface.getPriority() == 'default') {
                TODOInterface.setPriority('medium');
                priorityDisplay.textContent = `${TODOInterface.getPriority()} priority`;
                priorityDisplay.classList.add('priorityMedium');
            } else if (TODOInterface.getPriority() == 'medium') {
                TODOInterface.setPriority('high');
                priorityDisplay.textContent = `${TODOInterface.getPriority()} priority`;
                priorityDisplay.classList.remove('priorityMedium');
                priorityDisplay.classList.add('priorityHigh');
            } else if (TODOInterface.getPriority() == 'high') {
                TODOInterface.setPriority('default');
                priorityDisplay.textContent = `${TODOInterface.getPriority()} priority`;
                priorityDisplay.classList.remove('priorityHigh');
                priorityDisplay.classList.add('priorityDefault');
            }
        });




        topRightBottom.appendChild(priorityDisplay);

        // STATUS DISPLAY
        const statusDisplay = document.createElement('p');
        statusDisplay.classList.add('statusDisplay');
        if (TODOInterface.getTODOStatus(object) == false) {
            statusDisplay.textContent = 'ongoing';
            statusDisplay.classList.remove('statusDisplayDone');
        } else {
            statusDisplay.textContent = 'done';
            statusDisplay.classList.add('statusDisplayDone');
        }
    
        statusDisplay.addEventListener('click', () => {
            if (TODOInterface.getTODOStatus(object) == false) {
                TODOInterface.changeTODOStatus(object);
                statusDisplay.textContent = 'done';
                statusDisplay.classList.add('statusDisplayDone');
            } else {
                TODOInterface.changeTODOStatus(object);
                statusDisplay.textContent = 'ongoing';
                statusDisplay.classList.remove('statusDisplayDone');
            }                
        });


        topRightBottom.appendChild(statusDisplay);


        // Bottom section
        const bottom = document.querySelector('.right .bottom');
        

        const bottomLeft = document.createElement('div');
        bottomLeft.classList.add('bottomLeft');

        const bottomRight = document.createElement('div');
        bottomRight.classList.add('bottomRight');


        // add note section
        const notes = document.createElement('div');
        notes.classList.add('TODO_notes');

        const addNotes = document.createElement('p');
        addNotes.classList.add('TODO_addNotes');
        addNotes.textContent = '+ notes';
        notes.appendChild(addNotes);

        const notesCards = document.createElement('div');
        notesCards.classList.add('TODO_notesCards');

        addNotes.addEventListener('click', () => {

            // add property to object
            const index = TODOInterface.addNotes(object, 'start typing here');
            const notesCard = document.createElement('span');
            notesCard.setAttribute('data-note-index', index);
            notesCard.setAttribute('role', 'textbox');
            notesCard.setAttribute('contenteditable', true);
            notesCard.classList.add('TODO_notesCard');

            notesCard.textContent = object.notes[index];

            notesCard.onblur = () => object.notes[index] = notesCard.textContent;

            notesCards.appendChild(notesCard);

        });

        // write the existing notes into DOM if available
        object.notes.forEach(note => {

            const notesCard = document.createElement('span');
            notesCard.classList.add('TODO_notesCard');
            notesCard.setAttribute('data-note-index', object.notes.indexOf(note));
            notesCard.setAttribute('role', 'textbox');
            notesCard.setAttribute('contenteditable', true);
            notesCard.classList.add('TODO_notesCard');

            notesCard.textContent = note;

            notesCards.appendChild(notesCard);

        });

        notes.appendChild(notesCards);

        bottomLeft.appendChild(notes);


        // add checklist section
        const checklists = document.createElement('div');
        checklists.classList.add('TODO_checklist');

        const addChecklist = document.createElement('p');
        addChecklist.classList.add('TODO_addChecklist');
        addChecklist.textContent = '+ checklist';
        checklists.appendChild(addChecklist);

        const checklistCards = document.createElement('div');
        checklistCards.classList.add('TODO_checklistCards');


        addChecklist.addEventListener('click', () => {

            // add checklist array to object, save the array index to variable index
            const checklistIndex = TODOInterface.addChecklist(object);

            const checklistCard = document.createElement('p');
            checklistCard.classList.add('TODO_checklistCard');
            checklistCard.setAttribute('data-checklist-index', checklistIndex);

            const checklistCardAddItem = document.createElement('p');
            checklistCardAddItem.classList.add('TODO_checklistCard_addItem');
            checklistCardAddItem.textContent = '+ item';

            checklistCard.appendChild(checklistCardAddItem);

            checklistCardAddItem.addEventListener('click', () => {
                
                const checklistItemValue = 'start typing here';

                // push item into checklist array of the TODO object
                const itemIndex = TODOInterface.addItemToChecklist(object, checklistIndex, checklistItemValue);

                // write to DOM
                const checklistItemGroup = document.createElement('div');
                checklistItemGroup.classList.add('TODO_checklistCard_checklistItemGroup');
                checklistItemGroup.setAttribute('data-checklistItem-index', itemIndex);
                
                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                
                const checklistItem = document.createElement('span');
                checklistItem.classList.add('TODO_checklistCard_checklistItem');
                checklistItem.setAttribute('role', 'textbox');
                checklistItem.setAttribute('contenteditable', true);

                checklistItem.textContent = checklistItemValue;

                checklistItem.onblur = () => object.checklists[checklistIndex][itemIndex] = checklistItem.textContent;

                checklistItemGroup.appendChild(checkbox);
                checklistItemGroup.appendChild(checklistItem);

                checklistCard.appendChild(checklistItemGroup);
            });

            // checklistCard.textContent = 'testing';
            checklistCards.appendChild(checklistCard);

        });

        // write the existing checklist into DOM if available
        object.checklists.forEach(checklist => {

            const checklistIndex = object.checklists.indexOf(checklist);

            // create each checklist as card
            const checklistCard = document.createElement('p');
            checklistCard.classList.add('TODO_checklistCard');
            checklistCard.setAttribute('data-checklist-index', object.checklists.indexOf(checklist));

            const checklistCardAddItem = document.createElement('p');
            checklistCardAddItem.classList.add('TODO_checklistCard_addItem');
            checklistCardAddItem.textContent = '+ item';

            checklistCard.appendChild(checklistCardAddItem);

            checklistCardAddItem.addEventListener('click', () => {
                
                // push item into checklist array of the TODO object
                const itemIndex = TODOInterface.addItemToChecklist(object, object.checklists.indexOf(checklist), checklistItemValue);

                // write to DOM
                const checklistItemGroup = document.createElement('div');
                checklistItemGroup.classList.add('TODO_checklistCard_checklistItemGroup');
                checklistItemGroup.setAttribute('data-checklistItem-index', itemIndex);
                
                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');

                const checklistItem = document.createElement('span');
                checklistItem.classList.add('TODO_checklistCard_checklistItem');
                checklistItem.setAttribute('role', 'textbox');
                checklistItem.setAttribute('contenteditable', true);

                checklistItem.textContent = checklistItemValue;

                checklistItem.onblur = () => object.checklists[checklistIndex][itemIndex] = checklistItem.textContent;

                checklistItemGroup.appendChild(checkbox);
                checklistItemGroup.appendChild(checklistItem);

                checklistCard.appendChild(checklistItemGroup);
            });

            // write the individual checklist's item
            let i = 0;

            checklist.forEach(Item => {

                const checklistItemGroup = document.createElement('div');
                checklistItemGroup.classList.add('TODO_checklistCard_checklistItemGroup');
                checklistItemGroup.setAttribute('data-checklistItem-index', i);

                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');

                const checklistItem = document.createElement('span');
                checklistItem.classList.add('TODO_checklistCard_checklistItem');
                checklistItem.setAttribute('role', 'textbox');
                checklistItem.setAttribute('contenteditable', true);

                checklistItem.textContent = Item;
    
                checklistItemGroup.appendChild(checkbox);
                checklistItemGroup.appendChild(checklistItem);

                checklistCard.appendChild(checklistItemGroup);

                // increment
                i++;
            });

            checklistCards.appendChild(checklistCard);
        });

        checklists.appendChild(checklistCards);

        bottomRight.appendChild(checklists);

        bottom.appendChild(bottomLeft);
        bottom.appendChild(bottomRight);
    };

  
    const changeStatus = (object) => {

        // update the object property's value
        TODOInterface.changeTODOStatus(object);
    };


    return {create, changeStatus};
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

            // reset toggle
            projectContent.resetToggle();
            
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
            sidebar.updateTODOCounter();
        });

        addTODO.appendChild(addTODOBtn);
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

    const updateTODOCounter = () => {
        const ProjectIndex = projectInterface.ProjectArray.indexOf(projectInterface.getCurrentProject());
        const currentProject = document.querySelector(`[data-project-index='${ProjectIndex}']`);
        const counter = currentProject.querySelector('.PROJECT_display_counter');
        counter.textContent = projectInterface.ProjectArray[ProjectIndex].TODOarray.length;
    };


    return {
        create, 
        updateTODO, 
        highlightCurrentTODO, 
        removeHighlightOfTODO, 
        deleteTODO, 
        updateTODOCounter
    };

})();


export {projectContent, TODOContent, sidebar};