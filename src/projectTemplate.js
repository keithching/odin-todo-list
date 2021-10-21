const loadProjectTemplate = () => {

    const right = document.querySelector('.right');

    const container = document.createElement('div');
    container.classList.add('container');

    right.appendChild(container);

};

export {loadProjectTemplate};