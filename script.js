import levels from "./levels.js";

console.log(levels);

const field = document.querySelector('.field');
const coverUp = document.querySelector('.up');
const coverDown = document.querySelector('.down');
const scoreCounter = document.querySelector('.score');
const errorCounter = document.querySelector('.error');
const levelBar = document.querySelector('.levelbar');
const currentScoreBar = document.querySelector('.currentscorebar');
const roundEndingWindow = document.querySelector('.roundending');
const quitButton = document.querySelector('.quit');
let scoreCount = 0;
// let errorCount = 0;
let circleCount = 0;
let circleLongevity = 1000;
let circleQuantity = 5;
const intervalValue = 2000;

coverUp.addEventListener('click', () => {
    localStorage.setItem("level", 1);
    localStorage.setItem("score", 0);
    animateOpenScreen();
}, { once: true });

coverDown.addEventListener('click', () => {
    animateOpenScreen();
    scoreCount = Number(localStorage.getItem("score"));
    levelBar.textContent = `Level: ${localStorage.getItem("level")}`;
    currentScoreBar.textContent = `Total Score: ${scoreCount}`;
}, { once: true });

quitButton.addEventListener('click', () => {
    location.reload();
});

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
    const delay = 1000;
    const currentScore = scoreCount;
    const circle = document.createElement('div');
    circleCount++;
    circle.classList.add('circle');
    container.appendChild(circle);
    circle.style.width = `${getRandomInt(7) + 1}vw`;
    circle.style.top = `${getRandomInt(70)}vh`;
    circle.style.left = `${getRandomInt(70)}vw`;
    circle.style.animationDuration = `${circleLongevity}ms`;
    const observer = new MutationObserver(function (mutations_list) {
        mutations_list.forEach(function (mutation) {
            mutation.removedNodes.forEach(function (removedNode) {
                if (removedNode === circle && currentScore === scoreCount) {
                    // increaseError();
                    increaseScore(-1);
                    observer.disconnect();
                }
            });
        });
    });
    observer.observe(field, { subtree: false, childList: true });
    setTimeout(deleteElement, circleLongevity, circle);
    if (circleCount === circleQuantity) {
        setTimeout(ending, circleLongevity + delay);
    }
}

function ending() {
    removeFieldListener();
    roundEndingWindow.style.display = 'block';
    localStorage.setItem("score", scoreCount);
}

function increaseScore(n = 1) {
    scoreCount += n;
    // scoreCounter.textContent = scoreCount;
    currentScoreBar.textContent = `Total Score: ${scoreCount}`;
}

function increaseError(n = 1) {
    errorCount += n;
    errorCounter.textContent = errorCount;
}

function deleteElement(element) {
    element.remove();
}

function startGame() {
    let currentLevel = localStorage?.getItem("level") ?? 1;
    const { level, quantity, interval, longevity } = levelInitialization(currentLevel);
    console.log(currentLevel);
    currentLevel++;
    localStorage.setItem("level", currentLevel);
    levelBar.textContent = `Level: ${level}`;
    circleLongevity = longevity;
    circleQuantity = quantity;
    circleCount = 0;
    setIntervalX(createCircle, interval, quantity);
}

function addFieldListener() {
    field.addEventListener('click', checkClick);
}

function removeFieldListener() {
    field.removeEventListener('click', checkClick);
}

function checkClick(e) {
    if (e.target.classList.contains('circle')) {
        increaseScore();
        e.target.remove();
    } else {
        // increaseError();
        increaseScore(-2);
    }
}

function levelInitialization(levelToInit) {
    return levels.filter(level => level.level == levelToInit)[0];
}

function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {

        callback();

        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay);
}

