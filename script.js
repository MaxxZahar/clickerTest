const field = document.querySelector('.field');
const coverUp = document.querySelector('.up');
const coverDown = document.querySelector('.down');
const scoreCounter = document.querySelector('.score');
const errorCounter = document.querySelector('.error');
let scoreCount = 0;
let errorCount = 0;
const intervalValue = 2000;

coverUp.addEventListener('click', () => {
    localStorage.setItem("level", 1);
    animateOpenScreen();
}, { once: true });

coverDown.addEventListener('click', () => {
    animateOpenScreen();
}, { once: true });

function animateOpenScreen() {
    coverUp.classList.add('moveup');
    coverDown.classList.add('movedown');
    const moveUpStyle = getComputedStyle(coverUp);
    const animationTime = (moveUpStyle.animationDuration?.slice(0, -1) ?? 0) * 1000;
    setTimeout(() => {
        coverUp.remove();
        coverDown.remove();
        addFieldListener();
        startGame();
    }, animationTime);
}

function getRandomInt(n) {
    return Math.floor(Math.random() * n);
}

function createCircle(container = field) {
    const currentScore = scoreCount;
    const circle = document.createElement('div');
    circle.classList.add('circle');
    container.appendChild(circle);
    circle.style.width = `${getRandomInt(7) + 1}vw`;
    circle.style.top = `${getRandomInt(70)}vh`;
    circle.style.left = `${getRandomInt(70)}vw`;
    const observer = new MutationObserver(function (mutations_list) {
        mutations_list.forEach(function (mutation) {
            mutation.removedNodes.forEach(function (removedNode) {
                if (removedNode === circle && currentScore === scoreCount) {
                    increaseError();
                    observer.disconnect();
                }
            });
        });
    });
    observer.observe(field, { subtree: false, childList: true });
    setTimeout(deleteElement, intervalValue, circle);
}

function increaseScore(n = 1) {
    scoreCount += n;
    scoreCounter.textContent = scoreCount;
}

function increaseError(n = 1) {
    errorCount += n;
    errorCounter.textContent = errorCount;
}

function deleteElement(element) {
    element.remove();
}

function startGame() {
    let currentLevel = localStorage.getItem("level") ?? 1;
    console.log(currentLevel);
    currentLevel++;
    localStorage.setItem("level", currentLevel);
    setInterval(createCircle, intervalValue);
}

function addFieldListener() {
    field.addEventListener('click', (e) => {
        if (e.target.classList.contains('circle')) {
            increaseScore();
            e.target.remove();
        } else {
            increaseError(2);
        }
    });
}



