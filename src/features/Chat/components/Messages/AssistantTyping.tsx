import { CSSProperties } from "react";

type DotAnimation = {
  animation: string;
  animationDelay: string;
};

export const AssistantTyping = () => {
  const containerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    padding: "8px 12px",
    maxWidth: "fit-content",
    backgroundColor: "transparent",
    borderRadius: "16px",
    margin: "16px 0",
  };

  const dotStyle: CSSProperties = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#666",
    display: "inline-block",
  };

  const dotAnimations: DotAnimation[] = [
    {
      animation: "dotJump 1.2s infinite ease-in-out",
      animationDelay: "0s",
    },
    {
      animation: "dotJump 1.2s infinite ease-in-out",
      animationDelay: "0.25s",
    },
    {
      animation: "dotJump 1.2s infinite ease-in-out",
      animationDelay: "0.40s",
    },
  ];

  return (
    <div style={containerStyle} aria-label="Assistant is typing">
      {dotAnimations.map((animStyle, index) => (
        <span
          key={index}
          style={{
            ...dotStyle,
            animation: animStyle.animation,
            animationDelay: animStyle.animationDelay,
          }}
        />
      ))}
      <style>
        {`
          @keyframes dotJump {
            0%, 80%, 100% { 
              transform: translateY(0);
            }
            40% { 
              transform: translateY(-7px);
            }
          }
        `}
      </style>
    </div>
  );
};
