var scores,
    roundScore,
    activePlayer,
    chance,
    teller,
    gameActive,
    gameScore,
    chancePrev,
    chanceCount,
    p1Chance,
    p2Chance,
    prevDice;
teller = 0;
chanceCount = 0;
init();
var prevDice;

document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gameActive) {
        //Random Number
        var dice = Math.floor(Math.random() * 6 + 1);

        //Display the result and change src-img
        var diceDOM = document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';

        //If user has pushed "take a chance button"
        if (chance) {
            if (teller !== 2) {
                roundScore += dice;
                document.querySelector(
                    '#current-' + activePlayer
                ).textContent = roundScore;
                teller += 1;
            } else {
                roundScore += dice;
                document.querySelector(
                    '#current-' + activePlayer
                ).textContent = roundScore;
                if (roundScore < 10) {
                    roundScore = 0;
                }
                activePlayer === 0
                    ? (scores[activePlayer + 1] += roundScore)
                    : (scores[activePlayer - 1] += roundScore);

                if (activePlayer === 1) {
                    document.querySelector(
                        '#score-' + (activePlayer - 1)
                    ).textContent = scores[activePlayer - 1];
                    document.querySelector('.chance').style.display = 'none';
                    setTimeout(function () {
                        document.querySelector('.dice').style.display = 'none';
                    }, 1000);

                    if (scores[activePlayer - 1] > gameScore) {
                        buttonView();
                        youWin(activePlayer - 1);
                    } else {
                        buttonView();
                        roundScore = 0;
                    }
                } else {
                    document.querySelector(
                        '#score-' + (activePlayer + 1)
                    ).textContent = scores[activePlayer + 1];
                    document.querySelector('.chance').style.display = 'none';
                    setTimeout(function () {
                        document.querySelector('.dice').style.display = 'none';
                    }, 1000);

                    if (scores[activePlayer + 1] > gameScore) {
                        buttonView();
                        youWin(activePlayer + 1);
                    } else {
                        buttonView();
                        roundScore = 0;
                    }
                }
                document.querySelector('.btn-chance').disabled = false;
                if (chanceCount > 1) {
                    document.querySelector('.btn-chance').disabled = true;
                    document.querySelector('.btn-chance').style.opacity = '50%';
                }

                setTimeout(function () {
                    document.querySelector(
                        '#current-' + activePlayer
                    ).textContent = 0;
                }, 1000);

                teller = 0;
                chance = false;
            }
        }
        //ELSE normal run
        else {
            if (prevDice === dice && dice === 6) {
                document.querySelector('.chance').style.display = 'block';
                document.querySelector('.chance').textContent =
                    'To seksere på rad. Du mister alle poeng og må shotte med en annen.';

                scores[activePlayer] = 0;
                document.querySelector('#score-' + activePlayer).textContent =
                    scores[activePlayer];
                document.querySelector('.dice').style.display = 'none';
                gameActive = false;
                setTimeout(function () {
                    gameActive = true;
                    nextPlayer();
                }, 3500);
            } else if (dice !== 1) {
                roundScore += dice;
                document.querySelector(
                    '#current-' + activePlayer
                ).textContent = roundScore;
            } else {
                document.querySelector('.chance').style.display = 'block';
                document.querySelector('.chance').textContent =
                    'Du trillet en ener. Automatisk chugg';

                gameActive = false;
                buttonHide(true, true, true, true);
                setTimeout(function () {
                    buttonView();
                    gameActive = true;
                    document.querySelector('.chance').style.display = 'none';
                    nextPlayer();
                }, 3500);
            }
            prevDice = dice;
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gameActive) {
        if (!chance) {
            scores[activePlayer] += roundScore;

            document.querySelector('#score-' + activePlayer).textContent =
                scores[activePlayer];

            if (scores[activePlayer] > gameScore) {
                youWin(activePlayer);
            } else {
                nextPlayer();
            }
        }
    }
});

function nextPlayer() {
    prevDice = 0;
    activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
    roundScore = 0;
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    document.querySelector('.dice').style.display = 'none';

    if (activePlayer === 0 && p1Chance) {
        document.querySelector('.btn-chance').style.opacity = '50%';
        document.querySelector('.btn-chance').disabled = true;
    } else if (activePlayer === 1 && p2Chance) {
        document.querySelector('.btn-chance').disabled = true;
        document.querySelector('.btn-chance').style.opacity = '50%';
    } else {
        document.querySelector('.btn-chance').style.opacity = '100%';
        document.querySelector('.btn-chance').disabled = false;
    }
    if (chancePrev) {
        chanceCount++;

        document.querySelector('.btn-chance').style.opacity = '50%';
        document.querySelector('.btn-chance').disabled = true;
    }

    chancePrev = false;
}

document.querySelector('.btn-new').addEventListener('click', init);

document.querySelector('.btn-chance').addEventListener('click', function () {
    buttonHide(false, true, true, true);

    if (activePlayer === 0) {
        if (!p1Chance) {
            if (gameActive) {
                chance_hjelp(1);
            }
        }
    } else {
        if (activePlayer === 1 && !p2Chance) {
            if (gameActive) {
                chance_hjelp(2);
            }
        }
    }
});

//////FUNKSJONER

function chance_hjelp(chanceNr) {
    activePlayer === 0 ? (p1Chance = true) : (p2Chance = true);
    document.querySelector('.chance').style.display = 'block';
    chance = true;
    chancePrev = true;
    document.querySelector('.chance-used' + chanceNr).style.display = 'block';
    document.querySelector('.chance').textContent =
        'You have taken a chance. Your opponent gets three tries, and if the sum is above 10, the points is yours.';

    if (activePlayer === 0 && p1Chance) {
        document.querySelector('.btn-chance').disabled = true;
    } else if (activePlayer === 1 && p2Chance) {
        document.querySelector('.btn-chance').disabled = true;
    } else if (p1Chance && p2Chance) {
        document.querySelector('.btn-chance').disabled = true;
        document.querySelector('.btn-chance').style.opacity = '50%';
    } else {
        document.querySelector('.btn-chance').disabled = false;
    }

    nextPlayer();
}

function youWin(activePlayers) {
    document.querySelector('.btn-new').value = scores[activePlayer];
    document.querySelector('#name-' + activePlayers).textContent = 'You win';

    document
        .querySelector('.player-' + activePlayers + '-panel')
        .classList.remove('active');
    document
        .querySelector('.player-' + activePlayers + '-panel')
        .classList.add('winner');

    document.querySelector('.dice').style.display = 'none';
    gameActive = false;
    buttonHide(true, true, false, true);
}

buttonStop();

document
    .querySelector('.btn-final-score')
    .addEventListener('click', function () {
        gameScore = document.querySelector('.final-score').value;

        if (gameScore != '') {
            buttonStart();
            document.querySelector('.h1').style.display = 'none';
            document.querySelector('.final-score-div').style.display = 'none';

            show();
        }
    });

function init() {
    newMeny();
    hidden();
    buttonView();
    p1Chance = false;
    p2Chance = false;
    scores = [0, 0];
    activePlayer = 0;
    roundScore = 0;
    gameActive = true;

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('#name-0').textContent = 'Player 0';
    document.querySelector('#name-1').textContent = 'Player 1';

    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.chance-used1').style.display = 'none';
    document.querySelector('.chance-used2').style.display = 'none';
}

function hidden() {
    gameActive = false;
    document.querySelector('.wrapper').style.opacity = 0.1;
}

function show() {
    document.querySelector('.wrapper').style.opacity = 1;
    document.getElementById('0').style.display = 'block';
    document.getElementById('1').style.display = 'block';
}

function newMeny() {
    document.querySelector('.h1').style.display = 'block';
    document.querySelector('.final-score-div').style.display = 'block';
}

function buttonHide(roll, chance, newG, hold) {
    if (roll) {
        document.querySelector('.btn-roll').style.opacity = '50%';
    }
    if (chance) {
        document.querySelector('.btn-chance').style.opacity = '50%';
    }
    if (newG) {
        document.querySelector('.btn-new').style.opacity = '50%';
    }
    if (hold) {
        document.querySelector('.btn-hold').style.opacity = '50%';
    }
}

function buttonView() {
    document.querySelector('.btn-roll').style.opacity = '100%';
    document.querySelector('.btn-chance').style.opacity = '100%';
    document.querySelector('.btn-new').style.opacity = '100%';
    document.querySelector('.btn-hold').style.opacity = '100%';
}

function buttonStop() {
    document.querySelector('.btn-roll').style.display = 'none';
    document.querySelector('.btn-chance').style.display = 'none';
    document.querySelector('.btn-new').style.display = 'none';
    document.querySelector('.btn-hold').style.display = 'none';
}

function buttonStart() {
    document.querySelector('.btn-roll').style.display = 'block';
    document.querySelector('.btn-chance').style.display = 'block';
    document.querySelector('.btn-new').style.display = 'block';
    document.querySelector('.btn-hold').style.display = 'block';
}
