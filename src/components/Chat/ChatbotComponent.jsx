import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./ChatbotStyles.css";
import "./FlashScreen.css";

import config from "../../config/chatbotConfig";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

const ChatbotComponent = () => {
  const [showFlashScreen, setShowFlashScreen] = useState(true);

  const handleDismissFlashScreen = () => {
    setShowFlashScreen(false);
  };

  return (
    <div className="chatbot-container">
      {showFlashScreen ? (
        <FlashScreen onDismiss={handleDismissFlashScreen} />
      ) : (
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      )}
    </div>
  );
};

export default ChatbotComponent;
