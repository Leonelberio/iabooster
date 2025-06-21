"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  lastActivity: Date;
  userId: string;
}

const STORAGE_KEY = "ia-booster-chat-session";
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const quickActions = [
  "Comment automatiser mes emails ?",
  "Qu'est-ce que le machine learning ?",
  "Quels outils IA pour mon secteur ?",
  "Comment mesurer le ROI de l'IA ?",
  "Expliquez-moi les réseaux de neurones",
  "Par où commencer avec l'IA ?",
  "Différence entre IA et ML ?",
  "Comment créer un chatbot ?",
];

// Generate or retrieve user ID
const getUserId = (): string => {
  if (typeof window === "undefined") return "temp-id";

  let userId = localStorage.getItem("ia-booster-user-id");
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("ia-booster-user-id", userId);
  }
  return userId;
};

// Load chat session from localStorage
const loadChatSession = (): ChatSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session: ChatSession = JSON.parse(stored);
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);

    // Check if session is expired
    if (now.getTime() - lastActivity.getTime() > SESSION_EXPIRY) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Convert timestamp strings back to Date objects
    session.messages = session.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));

    return session;
  } catch (error) {
    console.error("Error loading chat session:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

// Save chat session to localStorage
const saveChatSession = (session: ChatSession): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Error saving chat session:", error);
  }
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userId] = useState(getUserId);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing session when component mounts
  useEffect(() => {
    const existingSession = loadChatSession();
    if (existingSession && existingSession.messages.length > 0) {
      setMessages(existingSession.messages);
      setHasWelcomed(true);
    }
  }, []);

  // Save session whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      const session: ChatSession = {
        id: sessionId,
        messages,
        lastActivity: new Date(),
        userId,
      };
      saveChatSession(session);
    }
  }, [messages, sessionId, userId]);

  // Welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && !hasWelcomed) {
      setTimeout(() => {
        addBotMessage(
          "Bonjour ! Je suis votre assistant IA spécialisé dans l'intégration de l'intelligence artificielle dans les workflows d'entreprise. Je peux vous aider avec l'automatisation, les outils IA, et répondre à vos questions générales sur l'IA. Comment puis-je vous assister ?"
        );
        setHasWelcomed(true);
      }, 500);
    }
  }, [isOpen, messages.length, hasWelcomed]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: `bot-${Date.now()}`,
      text,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const getAIResponse = async (userMessage: Message): Promise<string> => {
    try {
      // Get conversation context (last 10 messages for context)
      const contextMessages = messages.slice(-10);
      const allMessages = [...contextMessages, userMessage];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: allMessages,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.response ||
        "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?"
      );
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "Désolé, il y a eu un problème technique. Veuillez réessayer dans un moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = addUserMessage(inputText);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await getAIResponse(userMessage);
      addBotMessage(response);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      addBotMessage("Désolé, il y a eu une erreur. Pouvez-vous réessayer ?");
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    const userMessage = addUserMessage(action);
    setIsTyping(true);

    try {
      const response = await getAIResponse(userMessage);
      addBotMessage(response);
    } catch (error) {
      console.error("Error in handleQuickAction:", error);
      addBotMessage("Désolé, il y a eu une erreur. Pouvez-vous réessayer ?");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setHasWelcomed(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-40"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Assistant IA</h3>
                    <p className="text-xs opacity-90">Expert IA & Workflows</p>
                  </div>
                </div>
                {messages.length > 1 && (
                  <button
                    onClick={clearChat}
                    className="text-white/70 hover:text-white text-xs"
                    title="Nouvelle conversation"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      message.isBot
                        ? "flex-row"
                        : "flex-row-reverse space-x-reverse"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isBot ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {message.isBot ? (
                        <Bot className="w-4 h-4 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        message.isBot
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">
                          L'IA réfléchit...
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              {messages.length <= 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-gray-500 text-center">
                    Questions populaires :
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-full hover:bg-blue-100 transition-colors"
                        disabled={isTyping}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question sur l'IA..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isTyping}
                  className="w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
