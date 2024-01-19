import levels, { rarities } from "./levels.js";

console.log(rarities);

const field = document.querySelector('.field');
const coverUp = document.querySelector('.up');
const coverDown = document.querySelector('.down');
const scoreCounter = document.querySelector('.score');
const errorCounter = document.querySelector('.error');
const levelBar = document.querySelector('.levelbar');
const currentScoreBar = document.querySelector('.currentscorebar');
const recordBar = document.querySelector('.recordbar');
const roundEndingWindow = document.querySelector('.roundending');
const quitButton = document.querySelector('.quit');
const continueButton = document.querySelector('.con');
const endScreen = document.querySelector('.endscreen');
const numberOfRounds = levels.length;
let scoreCount = 0;
let roundFine = 1;
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

continueButton.addEventListener('click', () => {
    const nextRoundDelay = 500;
    roundEndingWindow.style.display = 'none';
    setTimeout(startNextRound, nextRoundDelay);
})

function animateOpenScreen() {
    coverUp.classList.add('moveup');
    coverDown.classList.add('movedown');
    const moveUpStyle = getComputedStyle(coverUp);
    const animationTime = (moveUpStyle.animationDuration?.slice(0, -1) ?? 0) * 1000;
    setTimeout(() => {
        coverUp.remove();
        coverDown.remove();
        startNextRound();
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
    applyRarity(circle);
    const observer = new MutationObserver(function (mutations_list) {
        mutations_list.forEach(function (mutation) {
            mutation.removedNodes.forEach(function (removedNode) {
                if (removedNode === circle && currentScore === scoreCount) {
                    // increaseError();
                    increaseScore(-roundFine);
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
    const endOfGameDelay = 5000;
    removeFieldListener();
    let currentLevel = localStorage.getItem("level");
    if (currentLevel == numberOfRounds) {
        endScreen.style.display = 'flex';
        localStorage.setItem("score", 0);
        localStorage.setItem("level", 1);
        localStorage.setItem("latestScore", scoreCount);
        const recordScore = Number(localStorage.getItem("recordScore")) ?? 0;
        endScreen.children[1].textContent = `Your score: ${scoreCount}`;
        endScreen.children[2].textContent = `Record score: ${recordScore}`;
        if (scoreCount > recordScore) {
            localStorage.setItem("recordScore", scoreCount);
        }
        setTimeout(() => {
            endScreen.style.display = 'none';
            location.reload();
        }, endOfGameDelay);
    } else {
        currentLevel++;
        roundEndingWindow.style.display = 'block';
        localStorage.setItem("score", scoreCount);
        localStorage.setItem("level", currentLevel);
    }
}

function increaseScore(n = 1) {
    scoreCount += n;
    // scoreCounter.textContent = scoreCount;
    currentScoreBar.textContent = `Total Score: ${scoreCount}`;
}

// function increaseError(n = 1) {
//     errorCount += n;
//     errorCounter.textContent = errorCount;
// }

function deleteElement(element) {
    element.remove();
}

function startGame() {
    let currentLevel = localStorage?.getItem("level") ?? 1;
    let recordScore = localStorage?.getItem("recordScore") ?? 0;
    const { level, quantity, interval, longevity, fine } = levelInitialization(currentLevel);
    levelBar.textContent = `Level: ${level}`;
    recordBar.textContent = `Highest Score: ${recordScore}`;
    circleLongevity = longevity;
    circleQuantity = quantity;
    circleCount = 0;
    roundFine = fine;
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
        increaseScore(countPointsWithRarity(e.target));
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

function startNextRound() {
    addFieldListener();
    startGame();
}

function applyRarity(circle) {
    const choice = getRandomInt(100);
    if (choice < 70) {
        circle.classList.add("common");
    }
    if (choice >= 70 && choice < 88) {
        circle.classList.add("uncommon");
    }
    if (choice >= 88 && choice < 96) {
        circle.classList.add("rare");
    }
    if (choice >= 96 && choice < 99) {
        circle.classList.add("veryrare");
    }
    if (choice === 99) {
        circle.classList.add("legendary");
    }
}

function countPointsWithRarity(circle) {
    switch (circle.classList[1]) {
        case "common":
            return 1;
        case "uncommon":
            return 2;
        case "rare":
            return 3;
        case "veryrare":
            return 4;
        case "legendary":
            return 7;
        default:
            console.log("Rarity error");
            return 0;
    }
}