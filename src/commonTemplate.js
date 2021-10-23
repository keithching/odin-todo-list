import { projectContent } from './DOM';
import { projectInterface } from './application';

const loadCommonTemplate = () => {

    const content = document.querySelector('div#content');

    const header = document.createElement('div');
    header.classList.add('header');

    const headerLeft = document.createElement('div');
    headerLeft.classList.add('headerLeft');

    const headerText = document.createElement('p');
    headerText.textContent = 'TODO';

    headerLeft.appendChild(headerText);

    const headerRight = document.createElement('div');
    headerRight.classList.add('headerRight');

    const headerButton1 = document.createElement('button');
    headerButton1.classList.add('BtnAddProject');
    headerButton1.textContent = 'Add Project';

    // show all, show active, show complete toggles
    const toggle = document.createElement('ul');
    toggle.classList.add('toggle');
    const showAll = document.createElement('li');
    showAll.classList.add('showAll');
    showAll.textContent = 'all';
    const separator1 = document.createElement('li');
    separator1.textContent = '|';
    const showActive = document.createElement('li');
    showActive.classList.add('showActive');
    showActive.textContent = 'active';
    const separator2 = document.createElement('li');
    separator2.textContent = '|';
    const showComplete = document.createElement('li');
    showComplete.classList.add('showComplete');
    showComplete.textContent = 'complete';

    toggle.appendChild(showAll);
    toggle.appendChild(separator1);
    toggle.appendChild(showActive);
    toggle.appendChild(separator2);
    toggle.appendChild(showComplete);

    toggle.childNodes.forEach(child => {

        child.addEventListener('click', (event) => {

            let clickedChild;
            child.classList.add('currentShowSelection');
            clickedChild = event.target;

            if (child.classList.contains('showAll')) {

                projectInterface.setToggle('All');
                projectContent.filterCards();

            } else if (child.classList.contains('showActive')) {

                projectInterface.setToggle('Active');
                projectContent.filterCards();

            } else if (child.classList.contains('showComplete')) {
                
                projectInterface.setToggle('Complete');
                projectContent.filterCards();

            } 

            toggle.childNodes.forEach(child => {
                if (child != clickedChild) {
                    child.classList.remove('currentShowSelection');
                }
            });
        });
    });


    headerRight.appendChild(toggle);
    headerRight.appendChild(headerButton1);   

    header.appendChild(headerLeft);
    header.appendChild(headerRight);

    const main = document.createElement('div');
    main.classList.add('main');

    const left = document.createElement('div');
    left.classList.add('left');

    const right = document.createElement('div');
    right.classList.add('right');


    main.appendChild(left);
    main.appendChild(right);

    const footer = document.createElement('div');
    footer.classList.add('footer');
    const footerSpan = document.createElement('span');
    footerSpan.innerHTML = 'Copyright © 2021 <a href="https://github.com/keithching" target="_blank">keithching</a>';
    footer.appendChild(footerSpan);


    // append childs to content
    content.appendChild(header);
    content.appendChild(main);
    content.appendChild(footer);

};

export {loadCommonTemplate};