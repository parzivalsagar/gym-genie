import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

function ChatPage() {
  const { isSignedIn, user } = useUser();
  const [messages, setMessages] = useState([
    {
      senderId: "AI",
      message: "👋 Welcome to **Gym Genie AI**! I'm your personal fitness assistant. I can help you with:\n\n✅ **Diet Plans** - Weight loss, muscle gain, maintenance\n✅ **Equipment Recommendations** - Home gym, beginner, advanced\n✅ **Workout Routines** - For all fitness levels\n✅ **Nutrition Advice** - Macros, supplements, meal timing\n✅ **Fitness Tips** - Recovery, cardio, strength training\n\n**What can I help you with today?** 💪",
      createdAt: new Date(),
      type: "text"
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      senderId: user?.id,
      message: input,
      createdAt: new Date(),
      type: "text"
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      console.log("Sending message:", userInput);
      const res = await api.post("/ai/chat", { message: userInput });
      
      console.log("Response:", res.data);
      
      const aiMessage = res.data;
      
      if (!aiMessage || !aiMessage.message) {
        throw new Error('Invalid response from server');
      }
      
      // Check if response is JSON (diet plan or equipment)
      try {
        const parsed = JSON.parse(aiMessage.message);
        console.log("Parsed JSON response:", parsed);
        setMessages((prev) => [...prev, { ...aiMessage, type: parsed.type, parsedData: parsed.data }]);
      } catch (parseErr) {
        // Regular text response
        console.log("Regular text response");
        setMessages((prev) => [...prev, { ...aiMessage, type: "text" }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = {
        senderId: "AI",
        message: "❌ Sorry, I encountered an error. Please check your connection and try again!",
        createdAt: new Date(),
        type: "text"
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg) => {
    // Handle JSON responses (diet plans, equipment)
    if (msg.type === "diet_plan" && msg.parsedData) {
      const plan = msg.parsedData;
      return (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 space-y-3">
          <h3 className="text-accent font-bold text-lg">{plan.title}</h3>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-dark-400">Daily Calories:</span>
              <span className="text-white font-semibold ml-2">{plan.calories}</span>
            </div>
            <div className="text-sm">
              <span className="text-dark-400">Macros:</span>
              <span className="text-white font-semibold ml-2">{plan.macros}</span>
            </div>
          </div>

          <div>
            <p className="text-dark-300 text-sm font-semibold mb-2">📋 Sample Meals:</p>
            <ul className="space-y-1">
              {plan.meals.map((meal, idx) => (
                <li key={idx} className="text-dark-300 text-sm">• {meal}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-dark-300 text-sm font-semibold mb-2">💡 Tips:</p>
            <ul className="space-y-1">
              {plan.tips.map((tip, idx) => (
                <li key={idx} className="text-dark-300 text-sm">✓ {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (msg.type === "equipment" && msg.parsedData) {
      const eq = msg.parsedData;
      return (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
          <h3 className="text-blue-400 font-bold text-lg">{eq.title}</h3>
          
          <div>
            <p className="text-dark-300 text-sm font-semibold mb-2">🛠️ Equipment List:</p>
            <ul className="space-y-1">
              {eq.items.map((item, idx) => (
                <li key={idx} className="text-dark-300 text-sm">• {item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-dark-400">💰 Estimated Cost:</span>
              <span className="text-white font-semibold ml-2">{eq.cost}</span>
            </div>
            <div className="text-sm">
              <span className="text-dark-400">✨ Benefits:</span>
              <span className="text-white font-semibold ml-2 block mt-1">{eq.benefits}</span>
            </div>
          </div>
        </div>
      );
    }

    // Regular text with markdown support
    return (
      <div className="text-dark-200 text-sm whitespace-pre-wrap break-words">
        {msg.message.split('\n').map((line, idx) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-bold text-white">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (line.startsWith('✅') || line.startsWith('💡') || line.startsWith('•')) {
            return <p key={idx} className="text-dark-300">{line}</p>;
          }
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            GYM GENIE AI
          </h1>
          <p className="text-dark-400 text-sm mb-6">
            Sign in to chat with your personal fitness AI assistant.
          </p>
          <a
            href="/sign-in"
            className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 max-w-4xl mx-auto px-4" style={{ height: "calc(100vh - 88px)" }}>
      <div className="h-full bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border bg-dark-900">
          <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            🤖 <span>Gym Genie AI Assistant</span>
          </h1>
          <p className="text-dark-400 text-xs mt-1">Your personal fitness coach powered by AI</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-2xl px-4 py-3 rounded-xl ${
                  msg.senderId === user?.id
                    ? "bg-accent text-white rounded-br-none"
                    : "bg-dark-800 text-dark-200 rounded-bl-none border border-border"
                }`}
              >
                {renderMessage(msg)}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-dark-800 border border-border rounded-xl rounded-bl-none px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-dark-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-border bg-dark-900">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about diet plans, workouts, equipment..."
              disabled={loading}
              className="flex-1 bg-dark-800 border border-border rounded-lg px-4 py-2.5 text-white placeholder-dark-500 focus:outline-none focus:border-accent disabled:opacity-50 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
          <p className="text-dark-500 text-xs mt-2">💡 Try asking: "diet plan for weight loss" or "home gym equipment"</p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;