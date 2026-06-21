import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";

function ChatPage() {
  const { isSignedIn, user } = useUser();

  const [messages, setMessages] = useState([
    {
      senderId: "AI",
      message:
        "👋 Welcome to Gym Genie AI! Ask me about workouts, nutrition, gym equipment, fitness tips, or weight loss.",
      createdAt: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      senderId: user?.id,
      message: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const question = input.toLowerCase();

    setInput("");

    setTimeout(() => {
      let reply = "";

      if (
        question.includes("hello") ||
        question.includes("hi") ||
        question.includes("hey")
      ) {
        reply =
          "👋 Hello! I'm Gym Genie AI. How can I help with your fitness journey today?";
      } else if (question.includes("protein")) {
        reply =
          "💪 Protein helps build and repair muscles. Aim for 1.6-2.2g per kg of body weight daily.";
      } else if (
        question.includes("weight loss") ||
        question.includes("lose weight")
      ) {
        reply =
          "🔥 For weight loss, maintain a calorie deficit, eat high-protein meals, and stay active.";
      } else if (
        question.includes("gain muscle") ||
        question.includes("muscle")
      ) {
        reply =
          "🏋️ To gain muscle, follow progressive overload, eat enough protein, and get proper sleep.";
      } else if (question.includes("bench press")) {
        reply =
          "🏋️ Bench press mainly targets your chest, shoulders, and triceps.";
      } else if (question.includes("squat")) {
        reply =
          "🦵 Squats work your quadriceps, glutes, hamstrings, and core muscles.";
      } else if (
        question.includes("cardio") ||
        question.includes("running")
      ) {
        reply =
          "🏃 Cardio improves heart health, burns calories, and increases endurance.";
      } else if (question.includes("creatine")) {
        reply =
          "⚡ Creatine is one of the most researched supplements and can improve strength and performance.";
      } else if (
        question.includes("equipment") ||
        question.includes("gym equipment")
      ) {
        reply =
          "🏋️ Popular gym equipment includes dumbbells, barbells, benches, squat racks, and treadmills.";
      } else if (
        question.includes("diet") ||
        question.includes("nutrition")
      ) {
        reply =
          "🥗 Focus on whole foods, adequate protein, healthy fats, fruits, vegetables, and hydration.";
      } else {
        reply =
          "🤖 I'm Gym Genie AI. I can help with workouts, fitness plans, nutrition, gym equipment, muscle gain, and weight loss.";
      }

      const aiMessage = {
        senderId: "AI",
        message: reply,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const isMyMessage = (msg) => {
    return msg.senderId === user?.id;
  };

  if (!isSignedIn) {
    return (
      <div className="py-8 sm:py-12 max-w-lg mx-auto">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            GYM GENIE AI
          </h1>

          <p className="text-dark-400 text-sm mb-6">
            Sign in to chat with Gym Genie AI.
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
    <div
      className="py-4 sm:py-6 max-w-5xl mx-auto"
      style={{ height: "calc(100vh - 88px)" }}
    >
      <div className="h-full bg-surface border border-border rounded-xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h1
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            🤖 Gym Genie AI Assistant
          </h1>

          <p className="text-xs text-dark-500 mt-1">
            Ask about workouts, nutrition, gym equipment, and fitness.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                isMyMessage(msg)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] sm:max-w-md px-4 py-3 text-sm ${
                  isMyMessage(msg)
                    ? "bg-accent text-white rounded-2xl rounded-br-md"
                    : "bg-dark-700 text-white border border-border rounded-2xl rounded-bl-md"
                }`}
              >
                <p>{msg.message}</p>

                <p
                  className={`text-[10px] mt-1 ${
                    isMyMessage(msg)
                      ? "text-white/60"
                      : "text-dark-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask Gym Genie AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              className="flex-1 bg-dark-800 border border-border rounded-lg px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-accent"
            />

            <button
              onClick={sendMessage}
              className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;