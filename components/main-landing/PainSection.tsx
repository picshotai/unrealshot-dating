"use client";

import React from "react";
import Link from "next/link";
import { UserX, CameraOff, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Caveat } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: "500",
});

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-2xl p-8 shadow-[0_12px_50px_-15px_rgba(0,0,0,0.1)] border border-gray-200/60 flex flex-col justify-between">
    <div>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

export function PainSection() {
  return (
    <section className="w-full relative bg-[#F7F5F3]">
      <div className="px-4 md:px-0 py-16 sm:py-24 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-center leading-tight">
            People aren&apos;t rejecting the version of you they&apos;d meet.
            <span className="block mt-2 text-[#ff6f00]">
              {" "}
              They&apos;re judging your photos first.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-center leading-relaxed">
            You can be funny, confident, interesting and look great in person. None
            of that matters if your profile is five bad selfies, an old group photo
            and the one picture of yourself you&apos;ve been recycling for three
            years.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<UserX className="text-red-500" size={24} />}
            title="You look better in person"
            description="Your profile doesn't show what people actually see when they meet you."
          />
          <FeatureCard
            icon={<CameraOff className="text-blue-500" size={24} />}
            title="Nobody takes good photos of you"
            description="So you keep choosing from the same weak camera roll."
          />
          <FeatureCard
            icon={<EyeOff className="text-purple-500" size={24} />}
            title="Your photos say nothing about your life"
            description="A face alone gives someone very little reason to become curious."
          />
        </div>

        {/* Bottom CTA & Psychological Bridge */}
        <div className="text-center relative">
          <div className="inline-block relative">
            <Link href="/dashboard">
              <Button className="group relative bg-[#ff6f00] hover:bg-[#ff6f00]/90 text-white rounded-md overflow-hidden cursor-pointer px-6 pr-16 py-6 font-semibold text-base shadow-[0_4px_20px_-5px_rgba(0,0,0,0.2)]">
                Fix My Dating Profile — $39
                <div className="bg-white rounded-sm p-3 absolute right-1 top-1/2 -translate-y-1/2">
                  <img
                    src="/arrow.svg"
                    alt="arrow-right"
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Button>
            </Link>

            {/* Whirl Arrow pointing to floating text */}
            <div className="hidden md:block absolute -right-12 top-8 mt-4 -translate-y-1/2 w-16 h-20 pointer-events-none">
              <svg
                viewBox="0 0 59 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-orange-500 opacity-70 transform -rotate-20"
              >
                <path
                  d="M7.66614 22.083C8.61245 23.967 9.50382 25.809 10.5502 27.8855C9.46822 27.9516 8.62906 27.273 8.11869 26.4189C6.58755 23.8566 5.08123 21.2357 3.75924 18.5229C2.99812 16.9739 3.65927 15.9282 5.04612 16.172C7.36079 16.5421 9.68076 17.0712 12.0256 17.5417C12.1602 17.5669 12.3348 17.5838 12.4048 17.6759C12.7097 17.9858 12.9498 18.3626 13.2298 18.7311C12.9958 18.9402 12.8221 19.3502 12.5678 19.35C11.6851 19.3744 10.8123 19.29 9.95444 19.2559C9.48565 19.2471 9.04169 19.1798 8.47894 19.5644C9.09834 20.0754 9.7328 20.6367 10.3522 21.1477C23.4279 31.1179 38.4176 30.6525 47.7967 20.0973C48.9958 18.7256 50.015 17.178 51.1441 15.7141C51.5421 15.2039 51.955 14.7439 52.353 14.2337C52.5027 14.3091 52.6277 14.4431 52.7774 14.5186C52.7934 14.9956 52.9342 15.6067 52.7454 15.9665C52.1844 17.2048 51.6234 18.443 50.8975 19.5556C43.7187 30.665 30.0661 33.8934 16.8279 27.4803C14.2971 26.248 11.87 24.5135 9.42336 22.9967C8.90409 22.6783 8.44951 22.2929 7.95505 21.9159C7.86023 21.8823 7.75566 21.9576 7.66614 22.083Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            <p
              className={`text-gray-600 ${caveat.className} text-xl font-semibold leading-none 
                          md:absolute md:transform md:rotate-6 md:-right-72 md:top-1/2 md:-translate-y-1/2 md:w-64
                          sm:static sm:mt-4 sm:transform-none sm:rotate-0 sm:text-center sm:w-auto`}
            >
              You don&apos;t need to become more attractive. You need better evidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
