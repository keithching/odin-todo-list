const loadTODOTemplate = () => {

    const right = document.querySelector('.right');

    const top = document.createElement('div');
    top.classList.add('top');

    const bottom = document.createElement('div');
    bottom.classList.add('bottom');

    // append childs to main
    right.appendChild(top);
    right.appendChild(bottom);

};

export {loadTODOTemplate};