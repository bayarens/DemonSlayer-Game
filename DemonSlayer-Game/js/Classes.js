const output = document.getElementById('output');
const imageLoader = document.querySelectorAll("#imageLoader img");
const imageLoaderZ = document.querySelectorAll("#imageLoaderZ img")
const imageLoaderI = document.querySelectorAll("#imageLoaderI img")
const demonImageLoader = document.querySelectorAll("#demonImageLoader img");
const miniBossImageLoader = document.querySelectorAll("#miniBossImageLoader img");
const muzanImageLoader = document.querySelectorAll("#muzanImageLoader img");
const slayerHealthbar = document.querySelector("#slayerHealthBar");
const demonHealthbar = document.querySelector("#demonHealthBar");
const infoBox = document.querySelector("#infoDisplay");
const money = document.querySelector("#moneyCounter");
const tanjiroAttackOptions = {
    outputQuestion: "Which attack will you use?",
    buttons: ["Water Wheel", "Twisting Whirlpool", "Striking Tide", "Constant Flux"],
    responseFunc: null
};
const zenitsuAttackOptions = {
    outputQuestion: "Which attack will you use?",
    buttons: ["Thunder Clap", "Rice Spirit", "Heat Lightning", "God Speed"],
    responseFunc: null
};
const inosukeAttackOptions = {
    outputQuestion: "Which attack will you use?",
    buttons: ["Rip and Tear", "Pierce", "Crazy Cutting", "Whirling Fangs"],
    responseFunc: null
};

let playerAttackInfo = "";
const zenitsuAttackInfo = "Thunder Clap: \n Damage: 40 \n Miss Chance: 10% \n Bleed: 5dmg \n\n Rice Spirit: \n Damage: 15 \n Miss Chance: \n 8% Healing: 35hp \n\n Heat Lightning: \n Damage: 10 \n Miss Chance: 5% \n Crit Chance: 75% \n\n God Speed: \n Damage: 280 \n Miss Chance: 75%";
const inousukeAttackInfo = "Rip and Tear: \n Damage: 20 \n Miss Chance: 15% \n Bleed: 20dmg \n\n Pierce: \n Damage: 35 Miss Chance 5% \n Healing: 10hp \n\n Crazy Cutting: \n Damage: 15 \n Miss Chance 10% \n Crit Chance: 60% \n\n Whirling Fangs: Damage: 150 \n Miss Chance 50%";
const tanjiroAttackInfo = "Water Wheel: \n Damage: 35 \n Miss Chance: 20% \n Bleed: 10dmg \n\n Twisting Whirlpool: \n Damage: 20 \n Miss chance: 10% \n Healing: 20hp \n\n Striking Tide: \n Damage: 10 Miss chance: 2% \n Crit Chance: 35% \n\nConstant Flux: \n Damage: 200 \n Miss chance: 66%";

const opener = {
    question({ outputQuestion, buttons, responseFunc }) {
        output.innerText = outputQuestion;
        this.responseFunc = responseFunc;
        this.buttons = buttons;
        for (let i = 0; i < buttons.length; i++) {
            allButtons[i].innerText = buttons[i]
        }
    },
    submitQuestion(e) {
        opener.responseFunc(e.target.innerText.toLowerCase())
    },
}

class MenuOption {
    constructor(outputQuestion, buttons, responseFunc) {
        this.outputQuestion = outputQuestion;
        this.buttons = buttons;
        this.responseFunc = responseFunc;
    }
}

class Player {
    constructor(name, health, bleedDmgNum) {
        this.name = name;
        this.health = health;
        this.maxHealth = health
        this.minHealth = 0;
        this.money = 0;
        this.bleedDmgNum = bleedDmgNum;
        this.defending = false;
        this.poison = false;
        this.curse = false;
        this.poisonedRounds = 0;
        this.curseRounds = 0;
        this.height = 212;
        this.width = 156;
        if (name == "Tanjiro") {
            this.attacks = {
                "water wheel": { damage: 35, missChance: 0, bleedValue: 10 },
                "twisting whirlpool": { damage: 20, missChance: 10, healValue: 20 },
                "striking tide": { damage: 10, missChance: 2, critChance: 65 },
                "constant flux": { damage: 200, missChance: 66 },
            }
            this.attackOptions = tanjiroAttackOptions;
            this.playerAttackInfo = tanjiroAttackInfo;
        }
        if (name == "Zenitsu") {
            this.attacks = {
                "thunder clap": { damage: 40, missChance: 0, bleedValue: 5 },
                "rice spirit": { damage: 15, missChance: 8, healValue: 35 },
                "heat lightning": { damage: 10, missChance: .05, critChance: 75 },
                "god speed": { damage: 280, missChance: 75 },
            }
            this.attackOptions = zenitsuAttackOptions;
            this.playerAttackInfo = zenitsuAttackInfo;
        }
        if (name == "Inousuke") {
            this.attacks = {
                "rip and tear": { damage: 20, missChance: 0, bleedValue: 20 },
                "pierce": { damage: 35, missChance: 5, healValue: 10 },
                "crazy cutting": { damage: 15, missChance: 10, critChance: 60 },
                "whirling fangs": { damage: 150, missChance: 50 },
            }
            this.attackOptions = inosukeAttackOptions;
            this.playerAttackInfo = inousukeAttackInfo;
        }
    }
    whichAttack = function (f) {
        tanjiroAttackOptions.responseFunc = attack => {
            if (attack == "water wheel") {
                demonGuy.bleed = true;
                demonGuy.bleedRounds = 4;
                demonGuy.bleedValue = chosenChar.attacks[attack].bleedValue;
                winterForrest.render.push(Bleeding)
            }
            if (attack == "twisting whirlpool") {
                chosenChar.changeHealth(-20);
            }
            f(attack)
        }
        zenitsuAttackOptions.responseFunc = attack => {
            if (attack == "thunder clap") {
                demonGuy.bleed = true;
                demonGuy.bleedRounds = 4;
                demonGuy.bleedValue = chosenChar.attacks[attack].bleedValue;
                winterForrest.render.push(Bleeding)
            }
            if (attack == "rice spirit") {
                chosenChar.changeHealth(-35)
            }
            f(attack)
        }
        inosukeAttackOptions.responseFunc = attack => {
            if (attack == "rip and tear") {
                demonGuy.bleed = true;
                demonGuy.bleedRounds = 4;
                demonGuy.bleedValue = chosenChar.attacks[attack].bleedValue;
                winterForrest.render.push(Bleeding)
            }
            if (attack == "pierce") {
                chosenChar.changeHealth(-10)
            }
            f(attack)
        }
        opener.question(this.attackOptions)
        populateInfoBox(this.playerAttackInfo)
    }
    x = 25
    y = 335
    draw() {
        this.currentImg = (this.currentImg + 1) % this.imgQueue.length
        this.img = this.imgQueue[this.currentImg]
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    imgQueue = []
    currentImg = 0

    startAnimation(animation) {
        this.currentImg = 0
        if (animation == "Tanjiro idle") {
            this.imgQueue = imageLoader
        }
        if (animation == "Zenitsu idle") {
            this.imgQueue = imageLoaderZ
        }
        if (animation == "Inousuke idle") {
            this.imgQueue = imageLoaderI
        }
    }
    changeHealth(num) {
        this.health -= num
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth
        }
        if (this.health < this.minHealth) {
            this.health = this.minHealth
        }
        slayerHealthbar.innerText = this.health + "HP";
        let width = this.health / this.maxHealth * 400;
        slayerHealthbar.style.width = width + "px";
    }
    subtractMoney(cost) {
        chosenChar.money -= cost
        money.innerText = `$${chosenChar.money}`
    }
}

const tanjiro = new Player("Tanjiro", 500, 10)
const zenitsu = new Player("Zenitsu", 350, 5)
const inosuke = new Player("Inousuke", 650, 20)



class Enemy {
    constructor(name, health, damageMin, damageMax, extraAbility = null, moneyDropped) {
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.minHealth = 0;
        this.damageMin = damageMin;
        this.damageMax = damageMax;
        this.extraAbility = extraAbility;
        this.moneyDropped = moneyDropped;
        this.bleed = false;
        this.bleedRounds = 0;
        this.height = 212;
        this.width = 156;
    }
    dealDamage() {
        return Math.round(Math.random() * (this.damageMax - this.damageMin) + this.damageMin);
    }
    changeHealth(num) {
        this.health -= num
        if (this.health < this.minHealth) {
            this.health = this.minHealth
        }
        demonHealthbar.innerText = this.health + "HP";
        let width = this.health / this.maxHealth * 400
        demonHealthbar.style.width = width + "px";
    }
    addMoney() {
        if (demonGuy.health <= 0) {
            chosenChar.money += demonGuy.moneyDropped
            money.innerText = `$${chosenChar.money}`
        }
    }
    x = canvas.width - 200;
    y = 335
    draw() {
        this.currentImg = (this.currentImg + 1) % this.imgQueue.length
        this.img = this.imgQueue[this.currentImg]
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
    imgQueue = []
    currentImg = 0

    startAnimation(animation) {
        this.currentImg = 0
        if (animation == "Lackey idle") {
            this.imgQueue = demonImageLoader
        }
        if (animation == "MiniBoss idle") {
            this.imgQueue = miniBossImageLoader
        }
        if (animation == "MUZAN idle") {
            this.imgQueue = muzanImageLoader
        }
    }
    renderStatusEffects(){
        if(this.bleed == true){
            render
        }
    }
}

let demonGuy;
const demonLackey = new Enemy("Lackey", 100, 20, 40, null, 50);
const demonMiniB = new Enemy("MiniBoss", 300, 40, 70, "poison", 125);
const demonBoss = new Enemy("MUZAN", 500, 60, 150, "curse", 200);
demonBoss.width *= 2;
demonBoss.height *= 2;
demonBoss.x = canvas.width - 300;
demonBoss.y = 200;
const demons = [demonLackey, demonMiniB, demonBoss]
nextEnemy()

function nextEnemy() {
    if (demonGuy) {
        winterForrest.render.splice(winterForrest.render.indexOf(demonGuy), 1)
    }
    demonGuy = demons.shift()
    demonGuy.startAnimation(`${demonGuy.name} idle`)
    winterForrest.render.push(demonGuy)
    winterForrest.removeFromRender(Bleeding)
}


class Item {
    constructor(name, effect, cost) {
        this.name = name
        this.effect = effect
        this.cost = cost;
    }
}

const potion = new Item("Potion", "heal100HP", 10)
const superPotion = new Item("SuperPotion", "heal250HP", 25)
const antidote = new Item("Antidote", "rmvStatusEffect", 15)
const ether = new Item("Ether", "healAllHP", 50)

const shopCost = {
    "potion $10": 10,
    "antidote $15": 15,
    "super potion $25": 25,
    "ether $50": 50
}

const startGameOptions = new MenuOption("What will you do slayer?", ["Attack", "Defend", "Run", "Shop"], myInput => {
    demonHealthbar.innerText = demonGuy.health + "HP";
    if (myInput == "attack") {
        demonSlayerAttack()
    } else if (myInput == "defend") {
        defendOption()
    } else if (myInput == "run") {
        runOption()
    } else if (myInput == "shop") {
        shop()
    }
})

const endFightOptions = new MenuOption("Congratulations! Will you continue on?", ["Yes", "No", "...", "..."], myInput => {
    if (myInput == "yes") {
        nextEnemy()
        demonGuy.changeHealth(0)
        populateInfoBox(`${chosenChar.name} is now facing ${demonGuy.name}`)
        opener.question(startGameOptions)
    }
    if (myInput == "no"){
        ranAway()
    }
})

const shopOptions = new MenuOption("Whata ya buying?", ["Potion $10", "Antidote $15", "Super Potion $25", "Ether $50"], myInput => {
    if (chosenChar.money < shopCost[myInput]) {
        populateInfoBox("you don't have enough money for this")
        opener.question(startGameOptions)
    } else {
        if (myInput == "potion $10") {
            chosenChar.changeHealth(-100)
            chosenChar.subtractMoney(potion.cost)
            populateInfoBox(`${chosenChar.name} Healed for 100HP`)
        }
        if (myInput == "antidote $15") {
            chosenChar.subtractMoney(antidote.cost)
            chosenChar.poison = false;
            chosenChar.poisonedRounds = null;
            chosenChar.curse = false;
            chosenChar.curseRounds = null;
            winterForrest.removeFromRender(Poisoned)
            winterForrest.removeFromRender(Cursed)
            populateInfoBox(`${chosenChar.name} Removed Status Effect`)
        }
        if (myInput == "super potion $25") {
            chosenChar.changeHealth(-250)
            chosenChar.subtractMoney(superPotion.cost)
            populateInfoBox(`${chosenChar.name} Healed for 250HP`)
        }
        if (myInput == "ether $50") {
            chosenChar.subtractMoney(ether.cost)
            chosenChar.changeHealth(-(chosenChar.maxHealth - chosenChar.health))
            chosenChar.poison = false;
            chosenChar.poisonedRounds = null;
            chosenChar.curse = false;
            chosenChar.curseRounds = null;
            winterForrest.removeFromRender(Poisoned)
            winterForrest.removeFromRender(Cursed)
            populateInfoBox(`${chosenChar.name}  Healed all HP & removed status effect`)
        }
    }
    setTimeout(demonAttack, 1500)
})

const runOptions = new MenuOption("will you pick up the sword again?", ["yes", "no", "...", "..."], myInput => {
    const run = (Math.floor(Math.random() * 100))
    if (run >= 50) {
    } else if ((run) < 50) {
        setTimeout(demonAttack, 1500)
    }
    if (myInput == "yes") {
        opener.question(startGameOptions)
        populateInfoBox("")
    }
    if (myInput == "no"){
        ranAway()
    }
})




