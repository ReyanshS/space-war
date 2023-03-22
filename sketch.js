var bg
var background_image
var player_image
var bulletGroup
var bullet_image
var enemy_image
var enemyX
var cooldown = 0
var lifebar
var player_alive
var scoreText
var enemies_killed = 0
var reset_button
var onMenu = true
var play_button
function preload(){
  background_image = loadImage("assets/BG_img.jpg")
  player_image = loadImage("assets/player_img.png")
  bullet_image = loadImage("assets/bullet.png")
  enemy_image = loadImage("assets/Enemy_image.png")
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background_image.resize(canvas.width, canvas.height)
  bullet_image.resize(background_image.height/60, windowWidth/80)
  player_image.resize(background_image.height/5, windowWidth/10)
  enemy_image.resize(player_image.width/3, player_image.height/3)
  player = createSprite(windowWidth/2 - 10, windowHeight / 2, 10, 10)
  player.addImage(player_image)
  player.rotation = 270
  player.health = 100
  bulletGroup = Group()
  enemyGroup = Group()
  enemyX = [-100, windowWidth + 100, windowWidth/2]
  enemyY = [-100, windowHeight + 100, windowHeight/2]
  player_alive = true
  score = 0
  play_button = createImg("assets/playbutton_image.png")
  play_button.position(player.x - 100, player.y + 100)
  play_button.mousePressed(playButtonPressed)
}
function draw() {
  background(background_image)
  if(onMenu == true){
    push()
    textSize(100)
    fill("yellow")
    text("Welcome to space war!",player.x - 500, player.y - 200)
    pop()
  }
  if(onMenu == false){
    background(background_image)
    score = enemies_killed * 25
    textSize(32)
    fill("white")
    scoreText = text("score: " + score, 10, 30)
    player.pointTo(mouseX, mouseY)
    if (keyDown(UP_ARROW) || keyDown("w")){
      if(player.y > 0 + player.width/2){
        player.y -= 5
      }
    }
    if (keyDown(DOWN_ARROW) || keyDown("s")){
      if(player.y < windowHeight - player.width/2){
        player.y += 5
      }
    }
    if (keyDown(RIGHT_ARROW) || keyDown("d")){
      if(player.x < windowWidth - player.width/2){
        player.x += 5
      }
    }
    if (keyDown(LEFT_ARROW) || keyDown("a")){
      if(player.x > 0 + player.width/2){
        player.x -= 5
      }
    }
    if(player.health <= 0){
      player_alive = false
    }
    else{
      push()
      fill("red")
      lifebar = rect(player.x - player.width/2, player.y - player.height/2, player.width, player.height/10)
      fill("limeGreen")
      lifebar = rect(player.x - player.width/2, player.y - player.height/2, player.width * player.health / 100, player.height/10)
      pop()
      spawnEnemies()
    }
    enemyGroup.forEach(function (enemy){
      push()
      fill("red")
      var enemy_lifebar = rect(enemy.x - enemy.width/2, enemy.y - enemy.height, enemy.width, enemy.height/10)
      fill("limeGreen")
      var enemy_lifebar = rect(enemy.x - enemy.width/2, enemy.y - enemy.height, enemy.width * enemy.health / 100, enemy.height/10)
      pop()
      if(player.x >= enemy.x){
        enemy.velocityX = 2
      }
      else{
        enemy.velocityX = -2
      }
      if(player.y >= enemy.y){
        enemy.velocityY = 2
      }
      else{
        enemy.velocityY = -2
      }
      bulletGroup.forEach(function (bullet){
        if(enemy.collide(bullet)){
          enemy.health -= 100/3
          bullet.remove()
          bulletGroup.remove(bullet)
        }
        if(enemy.health <= 0){
          enemy.remove()
          enemyGroup.remove(enemy)
          enemies_killed += 1
        }
      });
      if(enemy.collide(player)){
        if(enemy.hitCooldown <= 0){
          player.health -= 5
          enemy.hitCooldown = 25
        }
      }
      enemyGroup.forEach(function(enemy2){
        if(enemy.collide(enemy2)){
        }
      });
      enemy.hitCooldown -= 1
    });  
    cooldown -= 1
    if(player_alive == false){
      background(background_image)
      player.remove()
      enemyGroup.removeSprites()
      textSize(75)
      scoreText = text("Final Score: " + score, windowWidth/2 - 300, windowHeight/2)
      reset_button = createImg("assets/Reset_image.jpg")
      reset_button.size(200, 200)
      reset_button.position(windowWidth/2 - 200, windowHeight/2 + 100)
      reset_button.mousePressed(resetGame)
    
  }
  
  }
  drawSprites()

}
function resetGame(){
  window.location.reload()
}
function playButtonPressed(){
  play_button.remove()
  onMenu = false
}
function shoot(){
  if(onMenu == false){
  var bullet = createSprite(player.x, player.y, 5, 5)
  bullet.addImage(bullet_image)
  bullet.pointTo(mouseX, mouseY)
  bullet.setSpeedAndDirection(10);
  bullet.lifetime = 125;
  bulletGroup.add(bullet)
  }
}
function mouseClicked(){
  if(cooldown <= 0 && player_alive == true){
    shoot()
    cooldown = 12
  }
}
function spawnEnemies(){
  if(frameCount % 60 - Math.round(score/1000) * 10 == 0){
    var enemy = createSprite(enemyX[Math.round(random(0,2))], enemyY[Math.round(random(0,2))], player.width/3, player.height/3)
    enemy.addImage(enemy_image)
    enemy.health = 100
    enemy.hitCooldown = 25
    enemyGroup.add(enemy)
  }
}