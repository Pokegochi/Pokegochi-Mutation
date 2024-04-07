import { Scene } from "phaser";
// import logo from '../assets/load/8.png';
import { isMobile } from "../../../utils/utils";
var width = isMobile() ? window.innerWidth : 500;
var height = window.innerHeight;

var description = `Once upon a time there was a land where only the best cheese was found...\n\nFor a long time the local "VirtualPets" lived in harmony with the people who travelled across the seas to share in their cheese...`;
class Loading extends Scene {
  preload() {
    this.load.image(
      "machine1",
      require("../assets/sprites/Background_/Machine_/Machine_1.png").default
    );
    this.load.image(
      "machine2",
      require("../assets/sprites/Background_/Machine_/Machine_2.png").default
    );
    this.load.image(
      "machine3",
      require("../assets/sprites/Background_/Machine_/Machine_3.png").default
    );
    this.load.image(
      "machine4",
      require("../assets/sprites/Background_/Machine_/Machine_4.png").default
    );
    this.load.image(
      "machine5",
      require("../assets/sprites/Background_/Machine_/Machine_5.png").default
    );

    this.load.image("egg1", require("../assets/sprites/Egg/Egg_1.png").default);
    this.load.image("egg2", require("../assets/sprites/Egg/Egg_2.png").default);
    this.load.image("egg3", require("../assets/sprites/Egg/Egg_3.png").default);
    this.load.image("egg4", require("../assets/sprites/Egg/Egg_4.png").default);
    this.load.image("egg5", require("../assets/sprites/Egg/Egg_5.png").default);
    this.load.image("egg6", require("../assets/sprites/Egg/Egg_6.png").default);
    this.load.image("egg7", require("../assets/sprites/Egg/Egg_7.png").default);
    this.load.image("egg8", require("../assets/sprites/Egg/Egg_8.png").default);
    this.load.image("egg9", require("../assets/sprites/Egg/Egg_9.png").default);
    this.load.image(
      "egg10",
      require("../assets/sprites/Egg/Egg_10.png").default
    );
    // this.load.image('poweredBy', require('../assets/sprites/poweredBy.bmp').default)
    // this.load.image('amazon', require('../assets/sprites/amazon.jpg').default)
  }
  async create() {
    this.anims.create({
      key: "machineImage",
      frames: [
        { key: "machine1" },
        { key: "machine2" },
        { key: "machine3" },
        { key: "machine4" },
        { key: "machine5" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "eggImage",
      frames: [
        { key: "egg1" },
        { key: "egg2" },
        { key: "egg3" },
        { key: "egg4" },
        { key: "egg5" },
        { key: "egg6" },
        { key: "egg7" },
        { key: "egg8" },
        { key: "egg9" },
        { key: "egg10" },
      ],
      frameRate: 5,
      repeat: -1,
    });

    this.add
      .sprite(width / 2, height / 2, "machine")
      .setScale(0.5, 0.5)
      .play("machineImage");
    this.add
      .sprite(width / 2, height / 2, "egg")
      .setScale(0.5, 0.5)
      .play("eggImage");
    this.dialogs = this.add.container(0, height - 150);

    this.txt = this.add
      .text(10, 10, "", {
        color: "#ffffff",
      })
      .setOrigin(0, 0);

    this.skipTxt = this.add
      .text(width / 2, -25, "Click here to skip...", {
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    this.skipTxt.setInteractive();
    this.skipTxt.on("pointerup", () => {
      clearInterval(this.interv);
      this.scene.start("battle");
    });

    this.bar = this.add.rectangle(0, 0, width, 150, "0xd3854f").setOrigin(0, 0);
    this.insideBar = this.add
      .rectangle(6, 6, width - 12, 150 - 12, "0x000000")
      .setOrigin(0, 0);

    this.dialogs
      .add([this.bar, this.insideBar, this.txt, this.skipTxt])
      .setAlpha(0);
    this.txt.setWordWrapWidth(width - 20);

    // await this.createFadeInAnimation(this.powered, 3000, 0);
    // await this.createFadeOutAnimation(this.powered, 3000, 0);
    // await this.createFadeInAnimation(this.aws, 3000, 0);
    // await this.createFadeOutAnimation(this.aws, 3000, 0);
    await this.createFadeInAnimation(this.story, 3000, 0);
    await this.createFadeInAnimation(this.dialogs, 500, 0);
    await this.startDialog();
    this.scene.start("battle");
  }
  update() {
    //
  }
  async startDialog() {
    let skipText = this.add.text();
    return new Promise((resolve) => {
      let len = description.length;
      let index = 0;
      this.interv = setInterval(() => {
        this.txt.setText(description.slice(0, index++));
        if (index > len) {
          clearInterval(this.interv);
          resolve(true);
        }
      }, 100);
    });
  }
  async createFadeInAnimation(obj, duration, delay) {
    return new Promise((resolve) => {
      this.add.tween({
        targets: obj,
        alpha: 1,
        duration: duration,
        delay: delay,
        onComplete: () => {
          resolve(true);
        },
      });
    });
  }
  async createFadeOutAnimation(obj, duration, delay) {
    return new Promise((resolve) => {
      this.add.tween({
        targets: obj,
        alpha: 0,
        duration: duration,
        delay: delay,
        onComplete: () => {
          resolve(true);
        },
      });
    });
  }
}
export default Loading;
