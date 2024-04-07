import Phaser from "phaser";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";


import Gatcha from "./scenes/Gatcha";

import { Link } from "react-router-dom";
import { isMobile } from "../../utils/utils";

const boardConfig = require("./config.json");

const MainGatcha = (props) => {

  // const location = useLocation();

  useEffect(() => {
    const gatcha = new Gatcha({ key: 'gatcha' });
    // let player = location.state.player ? location.state.player : "Zephyr";

    const config = {
      type: Phaser.AUTO,
      parent: "game",
      ...boardConfig,
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravityY: 0

        },
      },
      scale: {
        mode: isMobile() ? Phaser.Scale.NONE : Phaser.Scale.NONE,
        parent: "game",
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },

      background: "green",
      // scene: [loading, battle, win],
      scene: [gatcha]

    };
    const game = new Phaser.Game(config);
    game.scene.start('loading');

    // return (() => {
    //   game = null;
    // })
  }, [])

  return <>

    {/* <Link to="/withdraw" id="navTowith" /> */}
    <div className="h-screen flex items-center justify-center">
      <div id="game"></div>
    </div>
    <Link to="/withdraw" id="navTowith" />
  </>;
};

export default MainGatcha;
