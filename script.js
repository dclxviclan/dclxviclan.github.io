window.addEventListener('load', function(){
	const canvas = document.getElementById('canvas1');
	const ctx= canvas.getContext('2d');
	canvas.width = 700;
	canvas.height = 500;
	
	class InputHandler {
		constructor(game){
			this.game =  game;
			//window.addEventListener("touchstart",  e => {
				
		//	});
		}
	}
	
	class InputPandler {
		constructor(game){
			this.keys = [ ];
			this.love = false;
			this.touchY = ' ';
			this.touchX = ' ';
			this.touchTreshold = 30;
			window.addEventListener('keydown', e => {
				if ((		e.key === 'ArrowDown' ||
							e.key === 'ArrowUp' ||
							e.key === 'ArrowLeft' ||
							e.key === 'ArrowRight')
							&& this.keys.indexOf(e.key) === -1){
					this.keys.push(e.key);
				}
			});
			window.addEventListener('keyup', e => {
				if (		e.key === 'ArrowDown' ||
							e.key === 'ArrowUp' ||
							e.key === 'ArrowLeft' ||
							e.key === 'ArrowRight'){
					this.keys.splice(this.keys.indexOf(e.key), 1);
				}
			});
			document.addEventListener('touchstart', e => {
				this.touchY = e.changedTouches[0].pageY
				this.touchX = e.changedTouches[0].pageX
				this.love = true;
				
			});
			document.addEventListener('touchmove', e => {
				const swipeDistance = e.changedTouches[0].pageY - this.touchY;
				const swipeDistances = e.changedTouches[0].pageX - this.touchX;
				this.love = true;
				if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
				else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
					this.keys.push('swipe down');
					if (gameOver) restartGame();
				}
				if (swipeDistances < -this.touchTreshold && this.keys.indexOf('swipe right') === -1) this.keys.push('swipe right');
				else if (swipeDistances > this.touchTreshold && this.keys.indexOf('swipe left') === -1) {
					this.keys.push('swipe left');
					//if (gameOver) restartGame();
				}
			});
			document.addEventListener('touchend', e => {
				this.keys.splice(this.keys.indexOf('swipe up'), 1);
				this.keys.splice(this.keys.indexOf('swipe down'), 1);
				this.love = false;
			});
		}
	}
	
const input = new InputPandler();
	class Projectile {
		constructor(game, x, y){
			this.game = game;
			this.x = x;
			this.y = y;
			this.width = 10;
			this.height = 3;
			this.speed = 3;
			this.markedForDeletion = false;
			this.image = document.getElementById('projectile');
		}
		update(){
			this.x += this.speed;
			if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
		}
	}
	class Particle {
		constructor(game, x, y){
			this.game = game;
			this.x = x;
			this.y = y;
			this.image = document.getElementById('gears');
			this.frameX = Math.floor(Math.random() * 3);
			this.frameY = Math.floor(Math.random() * 3);
			this.spriteSize = 50;
			this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
			this.size = this.spriteSize * this.sizeModifier;
			this.speedX = Math.random() * 6 - 3;
			this.speedY = Math.random() * -15;
			this.gravity = 0.5;
			this.markedForDeletion = false;
			this.angle = 0;
			this.va = Math.random() * 0.2 - 0.1;
			this.bounced = 0;
			this.bottomBounceBoundary = Math.random() * 100 + 60;
		}
		update(){
			this.angle += this.va;
			this.speedY += this.gravity;
			this.x -= this.speedX + this.game.speed;
			this.y += this.speedY;
			if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;
			if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 8){
				this.bounced++;
				this.speedY *= -0.77;
			} 
		}
		draw(context){
			context.save();
			context.translate(this.x, this.y);
			context.rotate(this.angle);
			context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
			context.restore();
		}
	}
	class Player {
		constructor(game){
			this.game = game;
			this.width = 120;
			this.height = 190;
			this.x = 20;
			this.y = 100;
			this.frameX = 0;
			this.frameY = 0;
			this.maxFrame = 37;
			this.speedY = 0;
			this.speedX = 0;
			this.maxSpeed = 3;
			this.projectiles = [];
			this.image = document.getElementById('player');
			this.powerUp = false;
			this.powerUpTimer = 0;
			this.powerUpLimit = 10000;
		}
		update(deltaTime){
			if (input.love === true){
				if (input.keys.indexOf('swipe down') > -1) this.speedY = -this.maxSpeed;
				if (input.keys.indexOf('swipe up') > -1) this.speedY = this.maxSpeed;
				if (input.keys.indexOf('swipe left') > -1) this.game.player.shootTop();
				if (input.keys.indexOf('swipe right') > -1){
					this.game.debug = !this.game.debug;
					if (this.game.debug){
						this.frameY = Math.floor(Math.random() * 2);
					} else {
						this.frameY = 0;
					}
					
				} 
			} else {
				this.speedY = 0;
				this.speedX = 0;
			}
			if (this.frameX < this.maxFrame){
				this.frameX++;
			} else {
				this.frameX = 0;
			}
			if (this.powerUp){
				if (this.powerUpTimer > this.powerUpLimit){
					this.powerUpTimer = 0;
					this.powerUp = false;
					this.frameY = 0;
				} else {
					this.powerUpTimer += deltaTime;
					this.frameY = 1;
					this.game.ammo += 0.1;
				}
			}
		//	if (input.keys.indexOf('swipe down') > -1) this.speedY = -this.maxSpeed;
		//	if (input.keys.indexOf('swipe up') > -1) this.speedY = this.maxSpeed;
			
			//document.addEventListener("touchstart", touchHandler);
    	//	document.addEventListener("touchmove", touchHandler);
   		   // function touchHandler(e) {
      	       // if(e.touches) {
                 //  this.speedX = e.touches[0].this.x - canvas.offsetLeft - this.width / 2;
                //   this.speedY = e.touches[0].this.y - canvas.offsetTop - this.height / 2;
          //  output.innerHTML = "Touch:  <br />"+ " x: " + this.speedX + ", y: " + this.speedY;
        //    e.preventDefault();
       // }
    //}
			this.y += this.speedY;
			if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
			else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
			this.x += this.speedX;
			this.projectiles.forEach (projectile => {
				projectile.update();
			});
			this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
		//	this.x += this.speedX;
		}
		draw(context){
		//	context.fillStyle = 'grey';
			if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
			this.projectiles.forEach (projectile => {
				projectile.draw(context);
			});
			context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}
		shootTop(){
			if (this.game.ammo > 0){
				this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
				this.game.ammo--;
			}
			if (this.powerUp) this.shootBottom();
		}
		shootBottom(){
			if (this.game.ammo > 0){
				this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
			}
		}
		enterPowerUp(){
			this.powerUpTimer = 0;
			this.powerUp = true;
			this.game.ammo = this.game.maxAmmo;
		}
	}
	class Enemy {
		constructor(game){
			this.game = game;
			this.x = this.game.width;
			this.speedX = Math.random() * -2.5 - 0.5;
			this.markedForDeletion = false;
			
			this.frameX = 0;
			this.frameY = 0;
			this.maxFrame = 37;
			//this.y = this.game.height;
		}
		update(){
			this.x += this.speedX - this.game.speed;
			if (this.x + this.width < 0) this.markedForDeletion = true;
			if (this.frameX < this.maxFrame){
				this.frameX++;
			} else {
				this.frameX = 0;
			}
		}
		draw(context){
			//context.fillStyle = 'purple';
			if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
			context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		//	context.font = '20px Helvetica';
		//	context.fillText(this.lives, this.x, this.y);
		}
	}
	class Angler1 extends Enemy {
		constructor(game){
			super(game);
			this.width = 228;
			this.height = 169;
			this.y = Math.random() * (this.game.height * 0.9 - this.height);
			this.image = document.getElementById('angler1');
			this.frameY = Math.floor(Math.random() * 3);
			this.lives = 7;
			this.score = this.lives;
			this.type = 'lky';
		}
	}
	class Angler2 extends Enemy {
		constructor(game){
			super(game);
			this.width = 213;
			this.height = 165;
			this.y = Math.random() * (this.game.height * 0.9 - this.height);
			this.image = document.getElementById('angler2');
			this.frameY = Math.floor(Math.random() * 2);
			this.lives = 12;
			this.score = this.lives;
			this.type = 'luy';
		}
	}
	class LuckyFish extends Enemy {
		constructor(game){
			super(game);
			this.width = 99;
			this.height = 95;
			this.y = Math.random() * (this.game.height * 0.9 - this.height);
			this.image = document.getElementById('lucky');
			this.frameY = Math.floor(Math.random() * 2);
			this.lives = 22;
			this.score = 15;
			this.type = 'lucky';
		}
	}
	class Layer {
		constructor(game, image, speedModifier){
			this.game = game;
			this.image = image;
			this.speedModifier = speedModifier;
			this.width = 1768;
			this.height = 500;
			this.x = 0;
			this.y = 0;
		}
		update(){
			if (this.x <= -this.width) this.x = 0;
			this.x -= this.game.speed * this.speedModifier;
		}
		draw(context){
			context.drawImage(this.image, this.x, this.y);
			context.drawImage(this.image, this.x + this.width, this.y);
		}
	}
	class Background {
		constructor(game){
			this.game = game;
			this.image1 = document.getElementById('layer1');
			this.image2 = document.getElementById('layer2');
			this.image3 = document.getElementById('layer3');
			this.image4 = document.getElementById('layer4');
			this.image5 = document.getElementById('layer5');
			this.layer1 = new Layer(this.game, this.image1, 0.2);
			this.layer2 = new Layer(this.game, this.image2, 0.4);
			this.layer3 = new Layer(this.game, this.image3, 1);
			this.layer4 = new Layer(this.game, this.image4, 1.5);
			this.layer5 = new Layer(this.game, this.image5, 0.5);
			this.layers = [this.layer1, this.layer2, this.layer3];
			
		}
		update(){
			this.layers.forEach(layer => layer.update());
		}
		draw(context){
			this.layers.forEach(layer => layer.draw(context));
		}
	}
	class UI {
		constructor(game){
			this.game = game;
			this.fontSize = 55;
			this.fontFamily = 'Bangers';
			this.color = 'pink';
		}
		draw(context){
			context.save();
			context.fillStyle = this.color;
			context.shadowOffsetX = 2;
			context.shadowOffsetY = 2;
			context.shadowColor = 'black';
			context.shadowBlur = 1;
			context.font = this.fontSize + 'px ' + this.fontFamily;
			context.fillText('Score ' + this.game.score, 20, 40);
			const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
			context.fillText('Timer:  ' + formattedTime, 20, 120);
			if (this.game.gameOver){
				context.textAlign = 'center';
				let message1;
				let message2;
				if (this.game.score > this.game.winningScore){
					message1 = 'U 👽🌍!🍔i';
					maessage2 = '₩£/_/_ 🎰dö|\|€';
				} else {
					message1 = 'U 🤬🤬\|i';
					message2 = '/_☠👾dö|\👾👽€';
				}
				context.font = '50px ' + this.fontFamily;
				context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
				context.font = '25px ' + this.fontFamily;
				context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
			}
			if (this.game.player.powerUp) context.fillStyle = 'purple';
			for (let i = 0; i < this.game.ammo; i++){
				context.fillRect(20 + 5 * i, 50, 3, 20);
			}
			context.restore();
		}
		update(){
			
		}
	}
	class Game {
		constructor(width, height){
			this.width = width;
			this.height = height;
			this.background = new Background(this);
			this.player = new Player(this);
			this.input = new InputPandler(this);
			this.ui = new UI(this);
			this.enemies = [];
			this.particles = [];
			this.enemyTimer = 0;
			this.enemyInterval = 2000;
			this.ammo = 20;
			this.maxAmmo = 50;
			this.ammoTimer = 0;
			this.ammoInterval = 500;
			this.gameOver = false;
			this.score = 0;
			this.winningScore = 500;
			this.gameTime = 0;
			this.timeLimit = 500000;
			this.speed = 1;
			this.debug = false;
		}
		update(deltaTime){
			if (!this.gameOver) this.gameTime += deltaTime;
			if (this.gameTime > this.timeLimit) this.gameOver = true;
			this.background.update();
			this.background.layer4.update();
			this.player.update(deltaTime);
			if (this.ammoTimer > this.ammoInterval){
				if (this.ammo < this.maxAmmo) this.ammo++;
				this.ammoTimer = 0;
			} else {
				this.ammoTimer += deltaTime;
			}
			this.particles.forEach(particle => particle.update());
			this.particles = this.particles.filter(particle => !particle.markedForDeletion);
			this.enemies.forEach(enemy => {
				enemy.update();
				if (this.checkCollision(this.player, enemy)){
					enemy.markedForDeletion = true;
					for (let i = 0; i < 10; i++){
						this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
					}
					if (enemy.type === 'lucky') this.player.enterPowerUp();
					else this.score--;
				}
				this.player.projectiles.forEach(projectile => {
					if (this.checkCollision(projectile, enemy)){
						enemy.lives--;
						projectile.markedForDeletion = true;
						this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
						if (enemy.lives <= 0){
							enemy.markedForDeletion = true;
							for (let i = 0; i < 10; i++){
								this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
							}
							if(!this.gameOver) this.score += enemy.score;
							if (this.score > this.winningScore) this.gameOver = true;
						}
					}
				})
			})
			this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
			if (this.enemyTimer > this.enemyInterval && !this.gameOver){
				this.addEnemy();
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}
		}
		draw(context){
			this.background.layer5.draw(context);
			this.background.draw(context);
			this.player.draw(context);
			this.ui.draw(context);
			this.particles.forEach(particle => particle.draw(context));
			this.enemies.forEach(enemy => {
				enemy.draw(context);
			})
			this.background.layer4.draw(context);
		}
		addEnemy(){
			const randomize = Math.random();
			if (randomize < 0.3) this.enemies.push(new Angler1(this));
			else if (randomize < 0.6) this.enemies.push(new LuckyFish(this));
			else this.enemies.push(new Angler2(this));
		}
		checkCollision(rect1, rect2){
			return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y  + rect2.height && rect1.height + rect1.y > rect2.y)
		}
	}
	
	const game = new Game(canvas.width, canvas.height);
	let lastTime = 0;
	//animation loop
	function animate(timeStamp){
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		requestAnimationFrame(animate);
	}
	animate(0);
	
});