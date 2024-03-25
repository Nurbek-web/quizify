import React, { useState } from "react";
import { Menu, Button } from "semantic-ui-react";

const Header = () => {
  const [promptEvent, setPromptEvent] = useState(null);
  const [appAccepted, setAppAccepted] = useState(false);

  let isAppInstalled = false;

  if (window.matchMedia("(display-mode: standalone)").matches || appAccepted) {
    isAppInstalled = true;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    setPromptEvent(e);
  });

  const installApp = () => {
    promptEvent.prompt();
    promptEvent.userChoice.then((result) => {
      if (result.outcome === "accepted") {
        setAppAccepted(true);
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
    });
  };

  return (
    <Menu stackable inverted>
      <Menu.Item header>
        <img
          src="logo.png"
          style={{ maxWidth: "350px", height: "auto" }}
          className="ui image responsive fluid"
          alt="Logo"
        />
      </Menu.Item>
    </Menu>
  );
};

export default Header;
