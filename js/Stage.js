const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
class Stage {
    render = []
    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i= 0; i < this.render.length; i++){
            this.render[i].draw();
        }
        setTimeout(() => this.draw(), 200)
    }
    removeFromRender(sprite){
        let index = this.render.indexOf(sprite)
        if (sprite && index != -1) {
            this.render.splice(index, 1);
        }
    }
}

class Snowflake {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * 100;
        this.height = Math.random() * 5 + 1;
        this.width = Math.random() *  5 + 1;
        this.dy = Math.random() * 5 + 1;
        this.dx = 0;
        this.color = "white"
        winterForrest.render.push(this);
    }
    draw(){
        this.move()
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill()
        ctx.closePath();
    }
    move(){
        this.x += this.dx;
        this.y += this.dy;
        if(this.y > canvas.height){
            winterForrest.removeFromRender(this)
        }
    }
}
setInterval(()=> new Snowflake(), 800)
const winterForrest = new Stage() 



const bleedImg = document.querySelector("#bleedEffect");
const poisonImg = document.querySelector("#poisonEffect");
const curseImg = document.querySelector("#curseEffect");

class Status{
    constructor(sprite, player=true){
        this.sprite = sprite
        if(player){
            this.x= 50
            this.y= 300
        } else{
            this.x = canvas.width -150
            this.y = 250
        }
        this.width = 50;
        this.height = 50;
    }
    draw(){
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

const Bleeding = new Status(bleedImg, false)
const Poisoned = new Status(poisonImg)
const Cursed = new Status(curseImg)

