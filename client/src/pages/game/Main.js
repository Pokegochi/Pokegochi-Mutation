import Phaser from "phaser";
import { useEffect } from "react";

import Loading from "./scenes/Loading";

import { Link } from "react-router-dom";
import { isMobile } from "../../utils/utils";
import OnePlusTwo from "./scenes/mini-games/OnePlusTwo/OnePlusTwo";
const Main = () => {
  useEffect(() => {
    const loading = new Loading({ key: "loading" });

    // mini games
    const onePlusTwo = new OnePlusTwo({ key: "oneplustwo" });
    const config = {
      type: Phaser.AUTO,
      parent: "game",
      physics: {
        default: "arcade",
        arcade: {
          //debug: true,
          gravityY: 0,
        },
      },
      scale: {
        mode: isMobile() ? Phaser.Scale.NONE : Phaser.Scale.NONE,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: isMobile() ? window.innerWidth : 500,
        height: window.innerHeight,
      },
      background: "green",
      scene: [loading, onePlusTwo],
    };

    var game = new Phaser.Game(config);
    // game.scene.start("loading");
    game.scene.start("oneplustwo");

    return () => {
      game = null;
    };
  }, []);

  return (
    <>
      {/* <Link to="/withdraw" id="navTowith" /> */}
      <div className="h-screen flex items-center justify-center">
        <div id="game"></div>
      </div>
      <Link to="/withdraw" id="navTowith" />
    </>
  );
};

export default Main;
