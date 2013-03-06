var InvadersGame = (function() {

  function GameState(gameStateData){
    var that = this;

    if (!gameStateData) {
      // that.stars = [];
      that.players = [];
      that.missiles = [];
      that.enemies = [];
      that.score = 0;
      that.dead = false;
      // that.planets = [];
      that.hiscore = 0;
      that.p2Input = [];
      // that.starCounter = 0;
    } else {
      that.players = _.map(gameStateData.players, function(playerData) {
        return new Ship(playerData);
      });
      that.missiles = _.map(gameStateData.missiles, function(missileData) {
        return new Missile(missileData);
      });
      that.enemies = _.map(gameStateData.enemies, function(enemyData) {
        return new Enemy(enemyData);
      });
      // that.planets = _.map(gameStateData.planets, function(planetData) {
      //   return new Enemy(planetData);
      // });
      that.score = gameStateData.score;
      that.dead = gameStateData.dead;
      that.hiscore = gameStateData.hiscore;
      // that.starCounter = gameStateData.starCounter;

    }

  }

  // function GameStateConst(gameStateData) {
  //   _.each(gameStateData.planets, function(){

  //   })
  // }

  function Game(ctx, gameState) {
    var that = this;
    that.gameState = gameState;

    that.makePlayers = function(){
      that.gameState.playerOne = new Ship();
      that.gameState.players.push(that.gameState.playerOne);
      that.gameState.playerTwo = new Ship();
      that.gameState.players.push(that.gameState.playerTwo);
    }

    // that.makeStars = function(){
    //   _.times(Math.floor(Math.random()*1) + 10, function(){
    //     var star = new Star;
    //     that.gameState.stars.push(star);
    //   })
    // };

    that.update = function() {
      // $('.score').html("SCORE " + that.score);
      // $('.hi-score').html("HI-SCORE " + that.hiscore);
      _.each(that.gameState.players, function(player) {
        player.move();
        player.decDirection();
      })

      // _.each(that.gameState.stars, function(star){
      //   star.update();
      //   if (star.y > 900) {
      //     that.gameState.stars = _.without(that.gameState.stars, star);
      //   }
      // });

      _.each(that.gameState.missiles, function(missile) {
        missile.update();
      });

      _.each(that.gameState.enemies, function(enemy) {
        enemy.update(ctx);
        if (enemy.y > 900) {
          that.gameState.enemies = _.without(that.gameState.enemies, enemy);
        }
        that.checkMissileCollision(enemy);

        if (enemy.killedHero(that.gameState.playerOne)) {
          that.gameState.playerOne.dead = true
          that.gameState.players = _.without(that.gameState.players, that.gameState.playerOne);
        }
        if (enemy.killedHero(that.gameState.playerTwo)) {
          that.gameState.playerTwo.dead = true
          that.gameState.players = _.without(that.gameState.players, that.gameState.playerTwo);
        }
      });

      // _.each(that.gameState.planets, function(planet) {
      //   planet.update();
      // })

      if (Math.floor(Math.random()*30) == 0) {
        var enemy = new Enemy
        that.gameState.enemies.push(enemy)
      }

      // if (Math.floor(Math.random()*1000) == 0) {
      //   var planet = new Planet;
      //   that.gameState.planets.push(planet)
      // }

      // if (Math.floor(Math.random()*200) == 0) {
      //   that.gameState.starCounter = (Math.random()*100);
      // }
      // if (that.gameState.starCounter <= 0) {
      //   that.makeStars();
      // }

      // that.gameState.starCounter --;
    };

    that.checkMissileCollision = function(enemy){
      _.each(that.gameState.missiles, function(missile) {
        if (Math.sqrt(((enemy.x - missile.x) * (enemy.x - missile.x)) + ((enemy.y - missile.y)
                     * (enemy.y - missile.y))) < 25) {
          that.gameState.enemies = _.without(that.gameState.enemies, enemy);
          that.gameState.score += 100;
        }
      })
    }

    that.draw = function(){
      ctx.clearRect(0, 0, 800, 900);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 800, 900);
      $('.score').html("SCORE " + that.score);
      $('.hi-score').html("HI-SCORE " + that.hiscore);
      // _.each(that.gameState.planets, function(planet) {
      //   Planet.draw(ctx, planet);
      //   planet.draw(ctx);
      // })
      _.each(that.gameState.players, function(player) {
        player.draw(ctx);
      })
      // _.each(that.gameState.stars, function(star) {
      //   star.draw(ctx);
      // });
      _.each(that.gameState.missiles, function(missile) {
        missile.draw(ctx);
      });
      _.each(that.gameState.enemies, function(enemy) {
        enemy.draw(ctx);
      });
    };

    that.fireMissile = function(player) {
      if (!player.dead) {
        var missile = new Missile(player);
        that.gameState.missiles.push(missile);
      }
    }

    that.stop = function() {
      $('.death-summary').show().html("YOU'RE REAL DEAD.");
      $('.reset-button').show();
      clearInterval(intervalTimer);
      // gameMasterSocket.send(JSON.stringify(gameState));
    };

    that.start = function(gameMasterSocket) {
      $('.death-summary').hide();
      $('.reset-button').hide();
      // that.makeStars();
      that.makePlayers();

      var playerOneBulletCounter = 9;
      var playerTwoBulletCounter = 9;

      intervalTimer = setInterval(function() {
        if(key.isPressed('left')) {
          that.gameState.playerOne.direction = -1;
          that.gameState.playerOne.velocity = 15;
        }
        if(key.isPressed('right')) {
          that.gameState.playerOne.direction = 1;
          that.gameState.playerOne.velocity = 15;
        }
        if(key.isPressed('up')) {
          that.gameState.playerOne.moveUp();
        }
        if(key.isPressed('down')) {
          that.gameState.playerOne.moveDown();
        }
        if(key.isPressed('space')) {
          if (playerOneBulletCounter <= 0) {
            that.fireMissile(that.gameState.playerOne);
            playerOneBulletCounter = 9;
          }
        }

        // Player 2 (off-site player) controls
        if(_.contains(that.p2Input, 'left')) {
          that.gameState.playerTwo.direction = -1;
          that.gameState.playerTwo.velocity = 15;
        }
        if(_.contains(that.p2Input, 'right')) {
          that.gameState.playerTwo.direction = 1;
          that.gameState.playerTwo.velocity = 15;
        }
        if(_.contains(that.p2Input, 'up')) {
          that.gameState.playerTwo.moveUp();
        }
        if(_.contains(that.p2Input, 'down')) {
          that.gameState.playerTwo.moveDown();
        }
        if(_.contains(that.p2Input, 'space')) {
          if (playerTwoBulletCounter <= 0) {
            that.fireMissile(that.gameState.playerTwo);
            playerTwoBulletCounter = 9;
          }
        }

        if (that.gameState.players.length == 0) {
          that.stop();
          if (that.gameState.score > that.gameState.hiscore) {
            that.gameState.hiscore = that.gameState.score;
          }
        }
        playerOneBulletCounter--;
        playerTwoBulletCounter--;
        that.update();
        that.draw();
        gameMasterSocket.send(JSON.stringify(gameState));
        that.p2Input = [];
      }, 1000/40);
    };
  };


  function Planet(){
    var that = this;
    that.x = Math.floor(Math.random()*800);
    that.y = -200
    that.size = Math.floor(Math.random()*50) + 80;
    that.velocity = 0.5;
    that.color = "rgba(" + (Math.floor(Math.random() * 150) + 50) + "," +
                       (Math.floor(Math.random() * 150) + 50) + "," +
                       (Math.floor(Math.random() * 150) + 50) + ",0.4)"


    that.draw = function(ctx) {
      ctx.beginPath();
      var linearGradient1 = ctx.createLinearGradient(that.x, that.y, that.x+that.size ,that.y+that.size);
      linearGradient1.addColorStop(0, that.color);
      linearGradient1.addColorStop(1, 'rgb(  0, 0, 0)');
      ctx.fillStyle = linearGradient1;
      ctx.arc(that.x, that.y, that.size, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    }

    this.update = function(ctx) {
      this.y += that.velocity
    }
  }

  function Star() {
    var that = this;
    that.x = Math.random()*800;
    that.y = -10
    that.size = Math.random()*4;
    that.velocity = that.size + 2;
    that.colorCode = Math.floor(Math.random() * 150) + (Math.floor(that.size) * 5);
    that.color = "rgb(" + that.colorCode + "," +  that.colorCode + "," + that.colorCode + ")"


    that.draw = function(ctx) {
      ctx.fillStyle = that.color;
      ctx.beginPath();
      ctx.arc(that.x, that.y, that.size, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    }

    this.update = function(ctx) {
      this.y += that.velocity
    }
  }

  function Ship(shipData) {
    var that = this;
    if (!shipData) {
      that.position = "maxDown";
      that.x = 300;
      that.y = 850;
      that.velocity = 15;
      that.verticalVelocity = 15;
      that.direction = 0;
      that.dead = false;
    } else {
      that.position = shipData.position;
      that.x = shipData.x;
      that.y = shipData.y;
      that.velocity = shipData.velocity;
      that.verticalVelocity = shipData.verticalVelocity;
      that.direction = shipData.direction;
      that.dead = shipData.dead;
    }
    var image = new Image();
    image.src = "heavyfreighter.png";

    that.decDirection = function() {
      if (that.velocity > 0) {
        that.velocity -= 1.5;
      }
      if (that.verticalVelocity > 0) {
        that.verticalVelocity -= 1.5;
      }
    }

    that.move = function() {
      if (that.y <= 800) {
        that.position = "maxUp";
      } else if (that.y >= 850) {
        that.position = "maxDown";
      }

      if (that.x > 850) {
        that.x = 50
      }
      if (that.x < 50) {
        that.x = 810
      }
      that.x += that.velocity * that.direction;
    }

    that.moveUp = function() {
      if (!(that.position == "maxUp")) {
        that.verticalVelocity = 15;
        that.y += that.verticalVelocity * -1;
      }
    }

    that.moveDown = function() {
      if (!(that.position == "maxDown")) {
        that.verticalVelocity = 15;
        that.y += that.verticalVelocity * 1;
      }
    }


    that.draw = function(ctx) {
      ctx.drawImage(image, that.x - 30, that.y - 30);
    }
  }

  function Missile(ship, missileData) {
    var that = this;
    if (!missileData) {
      that.x = ship.x
      that.y = ship.y
      that.size = 2
      that.velocity = 30
    } else {
      that.x = missileData.x;
      that.y = missileData.y;
      that.size = missileData.size;
      that.velocity = missileData.velocity;
    }

    that.draw = function(ctx) {
      ctx.fillStyle = "red";
      ctx.fillRect(that.x, that.y, that.size, 20);
      ctx.fillStyle = "yellow";
      ctx.fillRect(that.x, that.y, that.size, 15);
    }

    that.update = function(ctx) {
      that.y -= that.velocity
    }
  }

  function Enemy(enemyData){
    var that = this;
    if (!enemyData) {
      that.x = Math.floor(Math.random()*800);
      that.y = -40
      that.velocity = Math.random()*5 + 1;
      that.xVelocity = (Math.random()*-5) + (Math.random()*5 + 1);
      that.missileOffset = Math.floor(Math.random()*2) + 1
      that.mobMissiles = []
    } else {
      that.x = enemyData.x;
      that.y = enemyData.y;
      that.velocity = enemyData.velocity;
      that.xVelocity = enemyData.xVelocity;
      that.missileOffset = enemyData.missileOffset;
      that.mobMissiles = _.map(enemyData.mobMissiles, function(missileData) {
        return new MobMissile(missileData)
      });
    }
    var image = new Image();
    image.src = "bgspeedship.png";

    that.draw = function(ctx) {
      ctx.drawImage(image, that.x - 30, that.y)
      _.each(that.mobMissiles, function(missile) {
         missile.draw(ctx);
      });
    };

    that.killedHero = function(hero) {
      var killed = false;
      _.each(that.mobMissiles, function(missile) {
        if (Math.sqrt(((hero.x - missile.x) * (hero.x - missile.x)) + ((hero.y - missile.y)
                     * (hero.y - missile.y))) < 30) {
          killed = true;
        }
      })
      return killed;
    }

    that.update = function(ctx) {
      that.y += that.velocity
      that.x += that.xVelocity
      if (Math.floor(Math.random()*20) == 0) {
        that.shoot();
      }
      _.each(that.mobMissiles, function(missile) {
        if (missile.y > 900) {
          that.mobMissiles = _.without(that.mobMissiles, missile);
        }
        missile.update();
      })
    }

    that.shoot = function() {
      var mobMissileA = new MobMissile(that);
      mobMissileA.offset = that.missileOffset
      var mobMissileB = new MobMissile(that);
      mobMissileB.offset = that.missileOffset * -1
      that.mobMissiles.push(mobMissileA);
      that.mobMissiles.push(mobMissileB);
    }
  }

  function MobMissile(enemy, missileData) {
    var that = this;
    if (!missileData) {
      that.x = enemy.x;
      that.y = enemy.y;
      that.offset = 0
      that.velocity = -15;
    } else {
      that.x = missileData.x;
      that.y = missileData.y;
      that.offset = missileData.offset;
      that.velocity = missileData.velocity;
    }

    that.draw = function(ctx) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(that.x, that.y, 2, 15);
    };

    that.update = function() {
      that.y -= that.velocity
      that.x += that.offset
    }
  }

  return {
    Game: Game,
    GameState: GameState
  };

})();
