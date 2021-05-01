const startScreen = document.querySelector("#startScreen");
const startButton = document.querySelector("#startGame");
const charScreen = document.querySelector("#charSelect");
const gameOverScreen = document.querySelector("#gameOver");
const tanjiroBut = document.querySelector("#Tanjiro");
const zenitsuBut = document.querySelector("#Zenitsu");
const inoskueBut = document.querySelector("#Inosuke");
const replayButtons = document.querySelectorAll("#replay");
const ranAwayScreen = document.querySelector("#ranAway");
const youWinScreen = document.querySelector("#youWin");
const gameScreen = document.querySelector("#gameWrapper");
const zenInfoBox = document.querySelector("#zInfoBox");
const tanInfoBox = document.querySelector("#tInfoBox");
const inInfoBox = document.querySelector("#iInfoBox");
zenInfoBox.innerText = `${zenitsu.health}HP \n${zenitsuAttackInfo}`;
tanInfoBox.innerText = `${tanjiro.health}HP \n${tanjiroAttackInfo}`;
inInfoBox.innerText = `${inosuke.health}HP \n${inousukeAttackInfo}`;

startButton.addEventListener("click", () => {
    startScreen.classList.toggle("hide")
    charScreen.classList.toggle("hide")
});

function gameOver() {
    gameScreen.classList.toggle("hide");
    gameOverScreen.classList.toggle("hide");
}

function ranAway() {
    gameScreen.classList.toggle("hide");
    ranAwayScreen.classList.toggle("hide");
}

function youWin() {
    gameScreen.classList.toggle("hide");
    youWinScreen.classList.toggle("hide")
}

function restartGame() {
    window.location.reload()
}

replayButtons.forEach(cur => cur.addEventListener("click", restartGame))

let chosenChar;
function pickCharcter(picked) {
    chosenChar = picked;
    playerAttackOptions = new MenuOption("Which attack will you use?", chosenChar.buttons, myInput => { })
    startGame();
};

tanjiroBut.addEventListener("click", () => {
    pickCharcter(tanjiro);
    charScreen.classList.toggle("hide");
    gameScreen.classList.toggle("hide");
});

zenitsuBut.addEventListener("click", () => {
    pickCharcter(zenitsu);
    charScreen.classList.toggle("hide");
    gameScreen.classList.toggle("hide");
});

inoskueBut.addEventListener("click", () => {
    pickCharcter(inosuke);
    charScreen.classList.toggle("hide");
    gameScreen.classList.toggle("hide");
});


function populateInfoBox(text) {
    infoBox.innerText = text
}

const playerDiedOptions = new MenuOption("You feel the darkness closing in will you fight it?", ["yes", "no", "...", "..."], myInput => {
    if (myInput == "yes") {
        restartGame()
    }
    if (myInput == "no") {
        gameOver()
    }
})

const openingQ = document.getElementById('openingQuestion')
const allButtons = document.querySelectorAll(".submit")

for (i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", opener.submitQuestion)
}


function startGame() {
    populateInfoBox((`Oh no, ${chosenChar.name} has encountered a blood starved Demon! Prepare yourself!`))
    console.log(tanjiro)
    chosenChar.startAnimation(`${chosenChar.name} idle`)
    opener.question(startGameOptions)
    slayerHealthbar.innerText = chosenChar.health + "HP";
    money.innerText = `$${chosenChar.money}`
    demonHealthbar.innerText = demonGuy.health + "HP";
    winterForrest.render.push(chosenChar)
    winterForrest.draw()

}

function runOption() {
    const run = (Math.random())
    if (run > .5) {
        populateInfoBox("You got away! Death before dishonor, get back in there")
        opener.question(runOptions)
    } else if ((run) < 50) {
        populateInfoBox("You failed to get away")
        setTimeout(demonAttack, 1500)
    }
}

function defendOption() {
    populateInfoBox(`${chosenChar.name} defended the attack`)
    chosenChar.defending = true
    setTimeout(demonAttack, 1500)
    chosenChar.defennding = false
}

function shop() {
    populateInfoBox("Potion: Heal 100HP \n Antidote: Remove Status Effect \n Super Potion: Heal 250HP \n Ether: Heal All HP")
    opener.question(shopOptions)
}

function demonSlayerAttack() {
    chosenChar.whichAttack((attack) => {
        let damageNum = chosenChar.attacks[attack].damage
        if (chosenChar.attacks[attack].missChance >= Math.random() * 100) {
            demonGuy.bleed = false;
            populateInfoBox("attack missed");
            opener.question(startGameOptions);
        } else {
            let crit = false;
            if (attack == "striking tide" && (Math.round(Math.random() * 100)) < chosenChar.attacks["striking tide"].critChance) {
                crit = true;
                damageNum *= 8;
            }
            if (attack == "crazy cutting" && (Math.round(Math.random() * 100)) < chosenChar.attacks["crazy cutting"].critChance) {
                crit = true;
                damageNum *= 8;
            }
            if (attack == "heat lightning" && (Math.round(Math.random() * 100)) < chosenChar.attacks["heat lightning"].critChance) {
                crit = true;
                damageNum *= 8;
            }
            demonGuy.changeHealth(damageNum)
            populateInfoBox(`${attack} has landed for ${damageNum} demon's health is now ${demonGuy.health} ${crit ? "Critical Strike!" : ""}`)
            opener.question(startGameOptions)
        }
        if (chosenChar.posion == true) {
            chosenChar.changeHealth(10);
            chosenChar.posionedRounds--;
            if (chosenChar.posionedRounds <= 0) {
                chosenChar.posion = false;
                winterForrest.removeFromRender(Poisoned)
            }
        }
        if (chosenChar.curse == true) {
            chosenChar.curseRounds--;
            if (chosenChar.curseRounds <= 0) {
                chosenChar.health = 0;
            }
        }
        if (demonGuy.health <= 0) {
            demonGuy.addMoney()
            opener.question(endFightOptions);
            if (demonGuy.name == "MUZAN") {
                populateInfoBox("")
                youWin()
            }
        }
        else setTimeout(demonAttack, 1500)
    })
}


function demonAttack() {
    let testdamge = demonGuy.dealDamage()
    if (chosenChar.defending === true) {
        testdamge = Math.round((testdamge * chosenChar.defense) / 100)
    }
    if (demonGuy.bleed == true) {
        demonGuy.changeHealth(demonGuy.bleedValue);
        demonGuy.bleedRounds--;
        if (demonGuy.bleedRounds == 0) {
            demonGuy.bleed = false;
            winterForrest.removeFromRender(Bleeding)
        }
    }
    if (demonGuy.extraAbility == "poison") {
        if (chosenChar.poison == false && Math.random() < .33) {
            chosenChar.poison = true;
            chosenChar.poisonedRounds = 3
            winterForrest.render.push(Poisoned);
        }
    }
    if (demonGuy.extraAbility == "curse") {
        if (chosenChar.curse == false && Math.random() < .15) {
            chosenChar.curse = true;
            chosenChar.curseRounds = 5
            winterForrest.render.push(Cursed)
        }
    }
    chosenChar.changeHealth(testdamge)
    populateInfoBox(`${demonGuy.name}'s dark claw has landed for ${testdamge} ${chosenChar.name}'s health is now, ${chosenChar.health} ${demonGuy.bleed ? `\n${demonGuy.name} has bled for ${chosenChar.bleedDmgNum}` : ""} ${chosenChar.poison ? ` \n${chosenChar.name} took 10dmg from the poison, will last for ${chosenChar.poisonedRounds--} rounds` : ""} ${chosenChar.curse ? `\n${chosenChar.name} is cursed, better fix that, if you don't ${chosenChar.name} will die in ${chosenChar.curseRounds--} rounds` : ""}`)
    opener.question(startGameOptions)
    if (chosenChar.health <= 0) {
        populateInfoBox("")
        opener.question(playerDiedOptions)
    }
}

