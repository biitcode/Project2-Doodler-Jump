document.addEventListener('DOMContentLoaded', () => {

  //            MODEL

  // We're storing data globaly to be able to change them later
  let isGameOver = false;
  let doodlerLeftSpace = 50;
  let startPoint = 150
  let doodlerBottomSpace = startPoint; 
  let platformCount = 7;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;
  
  // Platform blueprint
  class Platform {
    constructor(newPlatBottom) {
      this.left = Math.random() * 315;
      this.bottom = newPlatBottom;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.append(visual);
    }
  }

  // Platforms moving functionality
  function movePlatforms() {
    // we only move the platform when the doodler is in the certain position
    if (doodlerBottomSpace > 200) {
      platforms.forEach(platform => {
        platform.bottom -= 5;
        // To make sure that each of the platforms moves by four each time
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        //remove first platform from the bottom
        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          console.log(platforms);
          score++;
          // add new platform from the bottom
          let newPlatform = new Platform(600)
          platforms.push(newPlatform)
        }
      })
    }
  }

  // Jumping functionality
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    // this upTimerId is something that can stop it from jumping
    upTimerId = setInterval(() =>{
      doodlerBottomSpace += 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace > (startPoint + 200)) {
        fall()
      }
    }, 20)
  }

  // Falling functionality
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach(platform => {
        if (
          (doodlerBottomSpace >= platform.bottom) &&
          (doodlerBottomSpace <= (platform.bottom + 15)) &&
          ((doodlerLeftSpace + 60) >= platform.left) &&
          (doodlerLeftSpace <= (platform.left + 85)) &&
          !isJumping
        ) {
          console.log('landed')
          startPoint = doodlerBottomSpace;
          jump();
        }
      })
    }, 25)
  }

  // Moving left functionality
  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else {
        moveRight()
      }
    }, 25);
  }

  // Moving right functionality
  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 340) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else {
        moveLeft();
      }
    }, 25);
  }
  
  // Moving straight functionality
  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  // Reload button functionality
  function reload() {
    location.reload();
    return false;
  }
  
  // Leave button functionality
  // We don' use it in this game
  function leave() {
    var myWindow = window.open("", "_self");
    myWindow.document.write("");
    setTimeout (() => myWindow.close(), 1000);
  }





  //               CONTROLLER
  function control(e) {
    doodler.style.bottom = doodlerBottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      moveStraight()
    }
  }
  
  function gameOver() {
    console.log('The game is over');
    isGameOver = true;
    while(grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML =  score;

    const playButton = document.createElement('button');
    playButton.classList.add('button');
    playButton.innerText = 'Play Again';
    playButton.addEventListener('click', reload);
    grid.append(playButton);

    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }


  //              VIEW
  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div');

  function createDoodler() {
    grid.append(doodler);
    doodler.classList.add('doodler');
    // set to appear the doodler not anywhere but start off with the first platform on the page randomly
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }

  function createPlatforms() {
    // We need to create five platforms so we use for loop for five times
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;

      // Adding spacing to all our platforms
      let newPlatBottom = 100 + i * platGap;

      // Make new platfrom
      let newPlatform = new Platform (newPlatBottom);

      // Put them in an array
      platforms.push(newPlatform);
      console.log(platforms);
    }
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
    }
  }
  // you can attach this start() function to a button to click it to start the game, not by refreshing the browser
  start()

});