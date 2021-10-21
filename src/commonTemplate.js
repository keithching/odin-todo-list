const loadCommonTemplate = () => {

    const content = document.querySelector('div#content');

    const header = document.createElement('div');
    header.classList.add('header');
    const headerText = document.createElement('p');
    headerText.textContent = 'TODO';

    const headerButton1 = document.createElement('button');
    headerButton1.classList.add('BtnAddProject');
    headerButton1.textContent = '+ Project';

    header.appendChild(headerText);
    header.appendChild(headerButton1);   

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