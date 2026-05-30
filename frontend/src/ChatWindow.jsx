import Chat from "./Chat.jsx";
import "./ChatWindow.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    const currentPrompt = prompt;

    setLoading(true);
    setNewChat(false);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentPrompt,
          threadId: currThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const res = await response.json();

      setReply(res?.reply || "");

      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: currentPrompt },
        {
          role: "assistant",
          content: res?.reply || "No response received",
        },
      ]);

      setPrompt("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!reply) return;
  }, [reply]);

  return (
    <div
      className="container-fluid vh-100 d-flex flex-column p-0 text-light"
      style={{
        background:
          "linear-gradient(180deg,#0f172a 0%,#111827 45%,#0f172a 100%)",
        overflow: "hidden",
      }}
    >
      {/* NAVBAR */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          background: "rgba(17,24,39,0.7)",
          zIndex: 100,
        }}
      >
        {/* LOGO */}
        <div>
          <h4
            className="mb-0 fw-bold"
            style={{
              background: "linear-gradient(90deg,#60a5fa,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            JNCtGPT
          </h4>

          <small style={{ color: "#94a3b8" }}>
            AI Assistant Ask Anything !
          </small>
        </div>

        {/* PROFILE */}
        <div className="position-relative" ref={dropdownRef}>
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              cursor: "pointer",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              boxShadow: "0 8px 20px rgba(59,130,246,0.35)",
              transition: "all 0.3s ease",
              userSelect: "none",
            }}
          >
            <i className="fa-solid fa-user text-white"></i>
          </div>

          {/* DROPDOWN */}
          <div
            style={{
              position: "absolute",
              top: "58px",
              right: "0",
              width: "220px",
              borderRadius: "18px",
              background: "rgba(17,24,39,0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(14px)",
              zIndex: 1000,
              boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
              overflow: "hidden",
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? "visible" : "hidden",
              transform: isOpen ? "translateY(0px)" : "translateY(-10px)",
              transition: "all 0.25s ease",
            }}
          >
            <div
              className="px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-gear me-2"></i>
              Settings
            </div>

            <div
              className="px-4 py-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-crown me-2"></i>
              Upgrade Plan
            </div>

            <div
              className="px-4 py-3 text-danger"
              style={{
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-right-from-bracket me-2"></i>
              Logout
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        className="flex-grow-1 overflow-auto px-3 py-4"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <Chat />
      </div>

      {/* LOADER */}
      {loading && (
        <div className="text-center py-2">
          <ScaleLoader color="#60a5fa" loading={loading} />
        </div>
      )}

      {/* INPUT AREA */}
      <div
        className="p-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(17,24,39,0.75)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          className="d-flex align-items-center gap-2 px-2 py-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            transition: "all 0.3s ease",
          }}
        >
          {/* INPUT */}
          <input
            type="text"
            className="form-control border-0 shadow-none text-light"
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                getReply();
              }
            }}
            disabled={loading}
            style={{
              background: "transparent",
              color: "#fff",
              padding: "10px 12px",
              fontSize: "14px",
              height: "42px",
            }}
          />

          {/* SEND BUTTON */}
          <button
            className="btn d-flex align-items-center justify-content-center"
            onClick={getReply}
            disabled={loading}
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              borderRadius: "14px",
              border: "none",
              background: loading
                ? "rgba(255,255,255,0.12)"
                : "linear-gradient(135deg,#2563eb,#7c3aed)",
              boxShadow: loading ? "none" : "0 8px 18px rgba(59,130,246,0.35)",
              transition: "all 0.3s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <i
              className="fa-solid fa-paper-plane text-white"
              style={{
                fontSize: "13px",
              }}
            ></i>
          </button>
        </div>

        {/* FOOT NOTE */}
        <small
          className="d-block text-center mt-3"
          style={{
            color: "#94a3b8",
            fontSize: "12px",
          }}
        >
          AI can make mistakes. Verify important info.
        </small>
      </div>
    </div>
  );
}

export default ChatWindow;
