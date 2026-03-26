"use client";

import { useState } from "react";

interface Props {
  username: string;
}

export default function MessageForm({ username }: Props) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("sent");
      setContent("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-green-500/30">
          ✅
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
        <p className="text-white/60 mb-8">Your secret is safe with us.</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-pink-400 hover:text-pink-300 font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder={`Send @${username} an anonymous message...`}
          disabled={status === "sending"}
          className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none shadow-inner disabled:opacity-50"
        ></textarea>
        <div className="absolute bottom-4 right-4 text-xs text-white/30">
          anonymous & safe
        </div>
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm text-center">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-linear-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:scale-100"
      >
        {status === "sending" ? "Sending..." : "Send!"}
      </button>
    </form>
  );
}
