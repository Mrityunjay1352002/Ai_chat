import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats = [], reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null || reply === undefined) {
      setLatestReply(null);
      return;
    }

    if (!prevChats?.length) return;

    const content = String(reply).split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;

      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [reply, prevChats]);

  return (
    <div
      className="container-fluid h-100 d-flex flex-column text-light"
      style={{
        background:
          "linear-gradient(180deg,#0f172a 0%,#111827 45%,#0f172a 100%)",
      }}
    >
      {/* EMPTY SCREEN */}
      {newChat && (
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1"
          style={{
            minHeight: "75vh",
          }}
        >
          <div
            className="mb-4 d-flex align-items-center justify-content-center"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "24px",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              boxShadow: "0 15px 35px rgba(59,130,246,0.35)",
            }}
          >
            <i
              className="fa-solid fa-robot text-white"
              style={{
                fontSize: "34px",
              }}
            ></i>
          </div>

          <h1
            className="fw-bold mb-3"
            style={{
              fontSize: "52px",
              background: "linear-gradient(90deg,#60a5fa,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Doubt Solver
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              maxWidth: "600px",
            }}
          >
            Ask coding, college, project, or technical doubts and get smart
            AI-powered answers instantly.
          </p>

          {/* QUICK ACTIONS */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            {[
              "Explain React Hooks",
              "Create Node.js API",
              "MongoDB Query Help",
              "Debug my code",
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "14px 20px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e2e8f0",
                  cursor: "pointer",
                  transition: "0.3s",
                  backdropFilter: "blur(10px)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES */}
      <div
        className="flex-grow-1 overflow-auto px-3 px-md-5 py-4"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            key={idx}
            className={`d-flex mb-4 ${
              chat.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className="d-flex gap-3 align-items-start"
              style={{
                maxWidth: "85%",
              }}
            >
              {/* AI AVATAR */}
              {chat.role !== "user" && (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    minWidth: "42px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 20px rgba(59,130,246,0.3)",
                  }}
                >
                  <i className="fa-solid fa-robot text-white"></i>
                </div>
              )}

              {/* MESSAGE */}
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius:
                    chat.role === "user"
                      ? "22px 22px 4px 22px"
                      : "22px 22px 22px 4px",
                  background:
                    chat.role === "user"
                      ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                      : "rgba(255,255,255,0.06)",
                  border:
                    chat.role === "assistant"
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                  color: "#f8fafc",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    chat.role === "user"
                      ? "0 12px 25px rgba(59,130,246,0.3)"
                      : "0 8px 20px rgba(0,0,0,0.2)",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                {chat.role === "user" ? (
                  <p
                    className="mb-0"
                    style={{
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.7",
                    }}
                  >
                    {chat.content}
                  </p>
                ) : (
                  <div
                    style={{
                      lineHeight: "1.8",
                      fontSize: "15px",
                    }}
                  >
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                      {chat.content || ""}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              {/* USER AVATAR */}
              {chat.role === "user" && (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    minWidth: "42px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 20px rgba(6,182,212,0.3)",
                  }}
                >
                  <i className="fa-solid fa-user text-white"></i>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* LIVE AI RESPONSE */}
        {prevChats.length > 0 && reply && (
          <div className="d-flex justify-content-start mb-4">
            <div
              className="d-flex gap-3 align-items-start"
              style={{
                maxWidth: "85%",
              }}
            >
              {/* AI ICON */}
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  minWidth: "42px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px rgba(59,130,246,0.3)",
                }}
              >
                <i className="fa-solid fa-robot text-white"></i>
              </div>

              {/* AI RESPONSE */}
              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: "22px 22px 22px 4px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f8fafc",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  lineHeight: "1.8",
                  fontSize: "15px",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply ||
                    prevChats[prevChats.length - 1]?.content ||
                    ""}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
