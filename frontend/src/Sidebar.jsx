import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");

      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }

      const res = await response.json();

      const filteredData = Array.isArray(res)
        ? res.map((thread) => ({
            threadId: thread.threadId,
            title: thread.title || "New Chat",
          }))
        : [];

      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    const newId = uuidv1();

    setNewChat(true);
    setPrompt("");
    setReply(null);
    setPrevChats([]);
    setCurrThreadId(newId);
  };

  const changeThread = async (newThreadId) => {
    try {
      setCurrThreadId(newThreadId);

      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load thread");
      }

      const res = await response.json();

      setPrevChats(Array.isArray(res) ? res : []);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="d-flex flex-column text-light vh-100 position-relative"
      style={{
        width: collapsed ? "95px" : "300px",
        minWidth: collapsed ? "95px" : "300px",
        background:
          "linear-gradient(180deg,#0f172a 0%,#111827 55%,#1e293b 100%)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        boxShadow: "0 0 25px rgba(0,0,0,0.35)",
      }}
    >
      {/* HEADER */}
      <div
        className={`d-flex align-items-center p-3 ${
          collapsed ? "justify-content-center" : "justify-content-between"
        }`}
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          minHeight: "78px",
          transition: "all 0.3s ease",
        }}
      >
        {!collapsed && (
          <div
            style={{
              opacity: collapsed ? 0 : 1,
              transition: "opacity 0.25s ease",
            }}
          >
            <h5
              className="m-0 fw-bold"
              style={{
                background: "linear-gradient(90deg,#60a5fa,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JNCtGPT
            </h5>

            <small style={{ color: "#94a3b8" }}>
              {" "}
              AI Assistant Ask Anything !
            </small>
          </div>
        )}

        <button
          className="btn text-light d-flex align-items-center justify-content-center"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            transition: "all 0.3s ease",
            flexShrink: 0,
          }}
        >
          <i
            className={`fa-solid ${collapsed ? "fa-bars" : "fa-angle-left"}`}
          ></i>
        </button>
      </div>

      {/* NEW CHAT */}
      <div className="p-3">
        <button
          type="button"
          onClick={createNewChat}
          className={`btn text-light d-flex align-items-center ${
            collapsed
              ? "justify-content-center"
              : "justify-content-center gap-2"
          }`}
          style={{
            width: "100%",
            height: "54px",
            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            border: "none",
            borderRadius: "16px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 25px rgba(59,130,246,0.35)",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <i className="fa-solid fa-plus"></i>

          {!collapsed && (
            <span
              style={{
                transition: "opacity 0.2s ease",
              }}
            >
              New Chat
            </span>
          )}
        </button>
      </div>

      {/* THREADS */}
      <div
        className="flex-grow-1 overflow-auto px-2 py-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {allThreads?.map((thread) => {
          const active = thread.threadId === currThreadId;

          return (
            <div
              key={thread.threadId}
              onClick={() => changeThread(thread.threadId)}
              className={`d-flex align-items-center mb-2 ${
                collapsed ? "justify-content-center" : "justify-content-between"
              }`}
              style={{
                cursor: "pointer",
                borderRadius: "16px",
                padding: collapsed ? "14px 0px" : "14px 16px",
                background: active
                  ? "linear-gradient(135deg,rgba(59,130,246,0.22),rgba(168,85,247,0.18))"
                  : "transparent",
                border: active
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid transparent",
                transition:
                  "background 0.25s ease, transform 0.2s ease, border 0.25s ease",
                transform: active ? "scale(1.01)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {/* LEFT SIDE */}
              <div
                className={`d-flex align-items-center ${
                  collapsed ? "" : "gap-3"
                }`}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    minWidth: "42px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 6px 15px rgba(59,130,246,0.35)",
                  }}
                >
                  <i className="fa-regular fa-message text-white"></i>
                </div>

                {!collapsed && (
                  <span
                    className="text-truncate"
                    style={{
                      maxWidth: "150px",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#f8fafc",
                    }}
                  >
                    {thread.title}
                  </span>
                )}
              </div>

              {!collapsed && (
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div
        className="p-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div
          className={`d-flex align-items-center ${
            collapsed ? "justify-content-center" : "gap-3"
          }`}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              borderRadius: "14px",
              background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fa-solid fa-code text-white"></i>
          </div>

          {!collapsed && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#f8fafc",
                }}
              >
                Built with M³
              </div>

              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
