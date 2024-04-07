import { Math as PhaserMath, Scene } from "phaser";

class OnePlusTwo extends Scene {
  constructor(props) {
    super(props);
    this.sumsArray = [];
    this.score = 0;
    this.isGameOver = false;
    this.numbersArray = [-3, -2, -1, 1, 2, 3];
  }

  preload() {
    this.load.image("timebar", require("./assets/timebar.png").default);
    this.load.image("buttonmask", require("./assets/buttonmask.png").default);
    
    this.load.spritesheet("buttons", "./assets/buttons.png", {
      frameWidth: 400,
      frameHeight: 50,
    });
  }

  update() {}

  create() {
    this.topScore =
      localStorage.getItem("topScore") == null
        ? 0
        : localStorage.getItem("topScore");
    this.cameras.main.setBackgroundColor("#cccccc");
    for (let i = 1; i < 5; i++) {
      this.sumsArray[i] = [[], [], []];
      for (let j = 1; j <= 3; j++) {
        this.buildThrees(j, 1, i, j);
      }
    }
    this.questionText = this.add.text(250, 160, "-", {
      font: "bold 72px Arial",
    });
    this.questionText.setOrigin(0.5, 0.5);

    this.scoreText = this.add.text(10, 10, "-", {
      font: "bold 24px Arial",
    });
    this.add.image(0, 0, "buttons");
    // for (let i = 0; i < 3; i++) {
    //   var numberButton = this.add
    //     .sprite(50, 250 + i * 75, "buttons", i)
    //     .setInteractive()
    //     .on("pointerdown", this.checkAnswer, this);
    // }
    // this.numberTimer = this.add.sprite(50, 250, "timebar");
    // this.nextNumber();
  }

  gameOver(gameOverString) {
    this.stage.backgroundColor = "#ff0000";
    this.questionText.text = this.questionText.text + " = " + gameOverString;
    this.isGameOver = true;
    localStorage.setItem("topScore", Math.max(this.score, this.topScore));
  }

  checkAnswer(button) {
    if (!this.isGameOver) {
      if (button.frame === this.randomSum) {
        this.score += Math.floor((this.buttonMask.x() + 350) / 4);
        this.nextNumber();
      } else {
        if (this.score > 0) {
          this.timeTween.stop();
        }
        this.gameOver(button.frame + 1);
      }
    }
  }

  nextNumber() {
    this.scoreText.text =
      "Score: " +
      this.score.toString() +
      "\nBest Score: " +
      this.topScore.toString();
    if (this.buttonMask) {
      this.buttonMask.destroy();
      this.tweens.removeAll();
    }
    this.buttonMask = this.add.graphics(50, 250);
    this.buttonMask.fillStyle = 0xffffff;
    this.buttonMask.fillRect(0, 0, 400, 200);

    this.numberTimer.mask = this.buttonMask;
    if (this.score > 0) {
      this.timeTween = this.add.tween(this.buttonMask);
      this.timeTween.to(
        {
          x: -350,
        },
        3000,
        "Linear",
        true
      );
      this.timeTween.onComplete.addOnce(function () {
        this.gameOver("?");
      }, this);
    }
    this.randomSum = PhaserMath.Between(0, 2);
    this.questionText.text =
      this.sumsArray[Math.min(Math.round((this.score - 100) / 400) + 1, 4)][
        this.randomSum
      ][
        PhaserMath.Between(
          0,
          this.sumsArray[Math.min(Math.round((this.score - 100) / 400) + 1, 4)][
            this.randomSum
          ].length - 1
        )
      ];
  }
  buildThrees(initialNummber, currentIndex, limit, currentString) {
    for (var i = 0; i < this.numbersArray.length; i++) {
      var sum = initialNummber + this.numbersArray[i];
      var outputString =
        currentString +
        (this.numbersArray[i] < 0 ? "" : "+") +
        this.numbersArray[i];
      if (sum > 0 && sum < 4 && currentIndex === limit) {
        this.sumsArray[limit][sum - 1].push(outputString);
      }
      if (currentIndex < limit) {
        this.buildThrees(sum, currentIndex + 1, limit, outputString);
      }
    }
  }
}

export default OnePlusTwo;
