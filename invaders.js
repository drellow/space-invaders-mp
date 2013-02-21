var InvadersGame = (function() {

  function Game(ctx) {
    var that = this;
    that.stars = [];
    that.ship = new Ship();
    that.missiles = [];
    that.enemies = [];
    that.score = 0;
    that.dead = false;
    that.planets = []
    that.hiscore = 0;

    that.makeStars = function(){
      _.times(Math.floor(Math.random()*1) + 10, function(){
        var star = new Star;
        that.stars.push(star);
      })
    };

    that.update = function() {
      $('.score').html("SCORE " + that.score);
      $('.hi-score').html("HI-SCORE " + that.hiscore);

      _.each(that.stars, function(star){
        star.update();
        if (star.y > 900) {
          that.stars = _.without(that.stars, star);
        }
      });

      _.each(that.missiles, function(missile) {
        missile.update();
      });

      _.each(that.enemies, function(enemy) {
        enemy.update(ctx);
        if (enemy.y > 900) {
          that.enemies = _.without(that.enemies, enemy);
        }
        that.checkMissileCollision(enemy);

        if (enemy.killedHero(that.ship)) {
          that.dead = true;
        }
      });

      _.each(that.planets, function(planet) {
        planet.update();
      })

      if (Math.floor(Math.random()*30) == 0) {
        var enemy = new Enemy
        that.enemies.push(enemy)
      }

      if (Math.floor(Math.random()*1000) == 0) {
        var planet = new Planet;
        that.planets.push(planet)
      }

      that.ship.move();
      that.makeStars();
      that.ship.decDirection();
    };

    that.checkMissileCollision = function(enemy){
      _.each(that.missiles, function(missile) {
        if (Math.sqrt(((enemy.x - missile.x) * (enemy.x - missile.x)) + ((enemy.y - missile.y)
                     * (enemy.y - missile.y))) < 25) {
          that.enemies = _.without(that.enemies, enemy);
          that.score += 100;
        }
      })
    }

    that.draw = function(){
      ctx.clearRect(0, 0, 800, 900);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 800, 900);
      _.each(that.planets, function(planet) {
        planet.draw(ctx);
      })
      _.each(that.stars, function(star) {
        star.draw(ctx);
      });
      _.each(that.missiles, function(missile) {
        missile.draw(ctx);
      });
      _.each(that.enemies, function(enemy) {
        enemy.draw(ctx);
      });
      that.ship.draw(ctx);
    };

    that.bindKeys = function() {
      key('left', function() {
        that.ship.direction = -1;
        that.ship.velocity = 15;
      });
      key('right', function() {
        that.ship.direction = 1;
        that.ship.velocity = 15;
      });
      key('space', function() {
        that.fireMissile();
      })
    };

    that.fireMissile = function() {
      var missile = new Missile(that.ship);
      that.missiles.push(missile);
    }

    that.stop = function() {
      $('.death-summary').show().html("YOU'RE REAL DEAD.");
      $('.reset-button').show();
      clearInterval(intervalTimer);
    };

    that.start = function() {
      $('.death-summary').hide();
      $('.reset-button').hide();
      that.makeStars();
      that.bindKeys();
      intervalTimer = setInterval(function() {
        if (that.dead == true) {
          that.stop();
          if (that.score > that.hiscore) {
            that.hiscore = that.score;
          }
        }
        that.update();
        that.draw();
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
                       (Math.floor(Math.random() * 150) + 50) + ",0.9)"

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

  function Star() {
    var that = this;
    that.x = Math.random()*800;
    that.y = -10
    that.size = Math.random()*4;
    that.velocity = that.size + 2;


    that.draw = function(ctx) {
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(that.x, that.y, that.size, 0, 360, true);
      ctx.closePath();
      ctx.fill();
    }

    this.update = function(ctx) {
      this.y += that.velocity
    }
  }

  function Ship() {
    var that = this;
    that.x = 300;
    that.y = 850;
    that.velocity = 15;
    that.direction = 0;
    var image = new Image();
    image.src = "heavyfreighter.png";

    that.decDirection = function() {
      if (that.velocity > 0) {
        that.velocity -= 1.5
      }
    }

    that.move = function() {
      if (that.x > 850) {
        that.x = 50
      }
      if (that.x < 50) {
        that.x = 810
      }
      that.x += that.velocity * that.direction;
    }

    that.draw = function(ctx) {
      ctx.drawImage(image, that.x - 30, that.y - 30);

    }
  }

  function Missile(ship) {
    var that = this;
    that.x = ship.x
    that.y = ship.y
    that.size = 2
    that.velocity = 30

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

  function Enemy(){
    var that = this;
    that.x = Math.floor(Math.random()*800);
    that.y = -40
    that.velocity = Math.random()*5 + 1;
    that.xVelocity = (Math.random()*-5) + (Math.random()*5 + 1);
    that.mobMissiles = [];
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
      var mobMissile = new MobMissile(that);
      that.mobMissiles.push(mobMissile);
    }
  }

  function MobMissile(enemy) {
    var that = this;
    that.x = enemy.x;
    that.y = enemy.y;
    that.velocity = -30;

    that.draw = function(ctx) {
      ctx.fillStyle = "yellow";
      ctx.fillRect(that.x, that.y, 2, 15);
    };

    that.update = function() {
      that.y -= that.velocity
    }
  }

  return {
    Game: Game
  };

})();

$(function draw() {
  var canvas = document.getElementById('invaders');
  var ctx = canvas.getContext('2d');
  var game = new InvadersGame.Game(ctx);
  $('.reset-button').click(function() {
    var hiscore = game.hiscore;
    game.stop();
    game = new InvadersGame.Game(ctx);
    game.hiscore = hiscore
    game.start();
  })
  game.start();
})