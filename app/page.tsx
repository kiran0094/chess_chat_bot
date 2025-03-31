'use client';

import { useChat } from '@ai-sdk/react';
import { Message } from 'ai';
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { BeatLoader } from "react-spinners";
import Bubble from "@/components/ui_compounts/bubble";
import Prompt_suggestion from '@/components/ui_compounts/prompt_suggestion';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, append, isLoading } =
    useChat(); 
  const nomessages: boolean = messages.length === 0;

  const handlePrompt = (prompttext: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: prompttext,
      role: "user",
    };
    append(msg);
  };

  return (
    <div className="h-min-[100vh] w-full bg-black relative overflow-hidden text-white">
      {/* Background with stars */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
        <div className="stars absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full text-center pt-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 shadow-lg">
          Chess Bot
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
          Ask me anything about chess! I can help you with rules, strategies, and more.
        </p>
        <section
          className={`min-h-[71vh] flex flex-col justify-end w-full max-w-2xl mx-auto gap-5 p-6`}
        >
          {nomessages ? (
            <>
              <p className="text-md md:text-lg text-gray-400 max-w-2xl mx-auto px-4">
                Best place to know about chess is this. Have fun 😍
              </p>
              <Prompt_suggestion onpromptclick={handlePrompt} />
            </>
          ) : (
            <>
              {messages.map((message: Message, index) => (
                <Bubble key={`message-${index}`} message={message} />
              ))}
              {isLoading && (
                <BeatLoader speedMultiplier={2} loading={true} color="#FFFFFF" size={10} />
              )}
            </>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="border border-white rounded-2xl p-4 text-white w-full"
              onChange={handleInputChange}
              value={input}
              placeholder="Ask me anything"
            />
            <input
              type="submit"
              className="border border-white p-4 text-white rounded-2xl font-bold"
            />
          </form>
        </section>
      </div>

      {/* Multiple shooting star layers with different colors and speeds */}
      <ShootingStars
        starColor="#9E00FF"
        trailColor="#2EB9DF"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
      />
      <ShootingStars
        starColor="#FF0099"
        trailColor="#FFB800"
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={4000}
      />
      <ShootingStars
        starColor="#00FF9E"
        trailColor="#00B8FF"
        minSpeed={20}
        maxSpeed={40}
        minDelay={1500}
        maxDelay={3500}
      />

      <style jsx>{`
        .stars {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          opacity: 0.5;
        }

        @keyframes twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}




