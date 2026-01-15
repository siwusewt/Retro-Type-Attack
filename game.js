import {words} from "./words.js";

let score = 0;
let timeLeft = 60;
let currentWord = '';
let gameActive = false;
let timer = null;
let streak = 0;
let bestStreak = 0;
let wordsTyped = 0;

const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const streakEl = document.getElementById('streak');
const wordDisplayEl = document.getElementById('wordDisplay');
const inputField = document.getElementById('inputField');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const messageEl = document.getElementById('message');
const gameOverEl = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');
const wordsTypedEl = document.getElementById('wordsTyped');
const bestStreakEl = document.getElementById('bestStreak');

function formatNumber(num, digits) {
    return String(num).padStart(digits, '0');
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
    score = 0;
    timeLeft = 60;
    streak = 0;
    bestStreak = 0;
    wordsTyped = 0;
    gameActive = true;
    
    scoreEl.textContent = formatNumber(score, 5);
    timeEl.textContent = timeLeft;
    streakEl.textContent = formatNumber(streak, 2);
    messageEl.textContent = '';
    
    gameOverEl.classList.remove('show');
    inputField.disabled = false;
    inputField.value = '';
    inputField.className = '';
    startBtn.disabled = true;
    resetBtn.disabled = false;
    
    newWord();
    inputField.focus();
    
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function newWord() {
    currentWord = getRandomWord();
    wordDisplayEl.textContent = currentWord;
    inputField.value = '';
    inputField.className = '';
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    inputField.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = true;
    wordDisplayEl.textContent = 'GAME OVER';
    
    finalScoreEl.textContent = formatNumber(score, 5);
    wordsTypedEl.textContent = formatNumber(wordsTyped, 2);
    bestStreakEl.textContent = formatNumber(bestStreak, 2);
    gameOverEl.classList.add('show');
}

function resetGame() {
    gameActive = false;
    clearInterval(timer);
    
    score = 0;
    timeLeft = 60;
    streak = 0;
    wordsTyped = 0;
    
    scoreEl.textContent = formatNumber(score, 5);
    timeEl.textContent = timeLeft;
    streakEl.textContent = formatNumber(streak, 2);
    messageEl.textContent = '';
    
    wordDisplayEl.textContent = 'PRESS START';
    inputField.value = '';
    inputField.className = '';
    inputField.disabled = true;
    startBtn.disabled = false;
    resetBtn.disabled = true;
    gameOverEl.classList.remove('show');
}

inputField.addEventListener('input', (e) => {
    if (!gameActive) return;
    
    const typed = e.target.value.toUpperCase();
    const target = currentWord;
    
    if (typed === target) {
        const points = 10 + (streak * 2);
        score += points;
        streak++;
        wordsTyped++;
        
        if (streak > bestStreak) {
            bestStreak = streak;
        }
        
        scoreEl.textContent = formatNumber(score, 5);
        streakEl.textContent = formatNumber(streak, 2);
        
        messageEl.textContent = `+${points} POINTS!`;
        inputField.className = 'correct';
        
        setTimeout(() => {
            newWord();
            messageEl.textContent = '';
        }, 200);
    } else if (target.startsWith(typed)) {
        inputField.className = '';
    } else {
        inputField.className = 'incorrect';
        streak = 0;
        streakEl.textContent = formatNumber(streak, 2);
    }
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !gameActive) {
        startGame();
    }
});