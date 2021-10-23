const loadTODOTemplate = () => {

    const right = document.querySelector('.right');

    const top = document.createElement('div');
    top.classList.add('top');

    const topLeft = document.createElement('div');
    topLeft.classList.add('topLeft');

    const topRight = document.createElement('div');
    topRight.classList.add('topRight');

    const topRightTop = document.createElement('div');
    topRightTop.classList.add('topRightTop');

    const topRightBottom = document.createElement('div');
    topRightBottom.classList.add('topRightBottom');

    topRight.appendChild(topRightTop);
    topRight.appendChild(topRightBottom);

    top.appendChild(topLeft);
    top.appendChild(topRight);

    const bottom = document.createElement('div');
    bottom.classList.add('bottom');

    // append childs to main
    right.appendChild(top);
    right.appendChild(bottom);

};

export {loadTODOTemplate};