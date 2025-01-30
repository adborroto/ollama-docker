import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);

    setLoading(true);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const botMessage = {
        role: "bot",
        content: data.response || "No response received.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: API is unavailable." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Chat</header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-bubble">
              {msg.role === "bot" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="message-bubble">...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          className="input-box"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={loading}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default App;
