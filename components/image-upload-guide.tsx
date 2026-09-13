"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Camera,
  Info,
  User,
  PersonStanding,
  UserIcon as UserStanding,
  Sun,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  FrontPose,
  FullBodyPose,
  HalfBodyPose,
} from "@/components/dating/PoseGuides";

export interface ImageUploadGuideProps {
  className?: string;
}

export default function ImageUploadGuide({ className }: ImageUploadGuideProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={`w-full overflow-x-hidden ${className ?? ""}`}>
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full mb-6">
          <TabsList className="mb-3 flex justify-center flex-wrap gap-2 bg-transparent h-auto items-center rounded-md p-1 w-full">
            <TabsTrigger
              value="overview"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <Info className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="front"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <User className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              1. Front Portrait
            </TabsTrigger>
            <TabsTrigger
              value="full-body"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <PersonStanding className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              2. Full-Body
            </TabsTrigger>
            <TabsTrigger
              value="half-body"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <UserStanding className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              3. Half-Body
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Exactly 3 Photos Required</CardTitle>
                <CardDescription>
                  Our AI likeness engine specifically requires 3 precise angles to capture your facial features and body proportions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] mb-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center p-3 border border-zinc-200 dark:border-zinc-700">
                      <FrontPose className="w-12 h-16 text-zinc-700 dark:text-zinc-300" />
                      <Badge className="absolute top-1.5 left-1.5 bg-blue-600 text-[10px] px-1.5 py-0">1</Badge>
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Front Portrait</span>
                    <span className="text-[10px] text-zinc-500 text-center">Head &amp; shoulders</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] mb-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center p-3 border border-zinc-200 dark:border-zinc-700">
                      <FullBodyPose className="w-12 h-16 text-zinc-700 dark:text-zinc-300" />
                      <Badge className="absolute top-1.5 left-1.5 bg-blue-600 text-[10px] px-1.5 py-0">2</Badge>
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Full-Body</span>
                    <span className="text-[10px] text-zinc-500 text-center">Head to toe</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] mb-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center p-3 border border-zinc-200 dark:border-zinc-700">
                      <HalfBodyPose className="w-12 h-16 text-zinc-700 dark:text-zinc-300" />
                      <Badge className="absolute top-1.5 left-1.5 bg-blue-600 text-[10px] px-1.5 py-0">3</Badge>
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Half-Body</span>
                    <span className="text-[10px] text-zinc-500 text-center">Waist up</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>1 Front Shot:</strong> Straight to camera close-up with both eyes clearly visible.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>1 Full-Body Shot:</strong> Standing head to feet to capture your posture and physique.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>1 Half-Body Shot:</strong> Waist-up shot showing shoulders, chest, and arms.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Quality Checklist</CardTitle>
                <CardDescription>Strictly follow these rules for realistic dating photos</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-start">
                    <Sun className="h-4 w-4 text-amber-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Good Natural Lighting:</strong> Daylight or a bright indoor room. Avoid dark spaces or harsh face shadows.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ShieldAlert className="h-4 w-4 text-rose-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>No Accessories on Face:</strong> Avoid sunglasses, masks, and hats or beanies covering your forehead.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <User className="h-4 w-4 text-blue-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Solo Photos Only:</strong> No group pictures or pets. You must be the only person in frame.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="h-4 w-4 text-indigo-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Natural &amp; Unedited:</strong> Skip beauty filters, heavy retouching, and camera watermark stamps.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Camera className="h-4 w-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Current Appearance:</strong> Taken within the last 2 years matching your current hair and facial hair.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 1. FRONT PORTRAIT */}
        <TabsContent value="front" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Photo 1: Front Portrait</CardTitle>
              <CardDescription>
                Close-up head-and-shoulders portrait looking straight into the camera
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full max-w-xs aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 border border-zinc-200 dark:border-zinc-700">
                  <FrontPose className="w-24 h-32 text-zinc-700 dark:text-zinc-300" />
                  <Badge className="mt-3 bg-blue-600">Front Shot</Badge>
                </div>

                <div className="max-w-lg space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">Guidelines for Front Portrait</h3>
                  <ul className="space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Face directly centered towards the lens with both eyes clearly visible.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Head and shoulders in frame, relaxed natural expression or gentle smile.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Even lighting across the face without dark side shadows or bright lens flare.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>No hats, beanies, or glasses tinting the eyes.</span>
                    </li>
                  </ul>

                  <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Why This Matters:</strong> The front portrait anchors your facial identity, jawline, eye structure, and skin tone across all generated photoshoot scenes.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. FULL-BODY */}
        <TabsContent value="full-body" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Photo 2: Full-Body Shot</CardTitle>
              <CardDescription>
                Standing head-to-toe photo showing your full physique and body build
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full max-w-xs aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 border border-zinc-200 dark:border-zinc-700">
                  <FullBodyPose className="w-24 h-32 text-zinc-700 dark:text-zinc-300" />
                  <Badge className="mt-3 bg-blue-600">Full-Body Shot</Badge>
                </div>

                <div className="max-w-lg space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">Guidelines for Full-Body Shot</h3>
                  <ul className="space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Standing upright naturally with space around you.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Entire body visible from head to shoes without cropping at the knees or ankles.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Wear well-fitting everyday clothes (e.g. jeans and t-shirt or casual shirt).</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Avoid extreme slouching or awkward angles.</span>
                    </li>
                  </ul>

                  <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Why This Matters:</strong> Full-body shots teach the AI your height, build, and posture, allowing it to generate convincing full-length lifestyle scenes like coffee walks and outdoor dates.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. HALF-BODY */}
        <TabsContent value="half-body" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Photo 3: Half-Body Shot</CardTitle>
              <CardDescription>
                Waist-up portrait showing your chest, shoulders, and arms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full max-w-xs aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 border border-zinc-200 dark:border-zinc-700">
                  <HalfBodyPose className="w-24 h-32 text-zinc-700 dark:text-zinc-300" />
                  <Badge className="mt-3 bg-blue-600">Half-Body Shot</Badge>
                </div>

                <div className="max-w-lg space-y-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">Guidelines for Half-Body Shot</h3>
                  <ul className="space-y-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Captured from waist up, showing both shoulders, chest, and arms.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Natural standing or relaxed sitting posture.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Clear, uncluttered background with good light on your upper body.</span>
                    </li>
                  </ul>

                  <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>
                        <strong>Why This Matters:</strong> Half-body framing is the primary shot type used on dating profiles (cafe dates, bar candids, restaurant tables). It bridges the gap between facial close-ups and full-body scenes.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 font-oxanium">
          Ready to Train Your Model?
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Having exactly these 3 photos (1 Front, 1 Full-Body, and 1 Half-Body) ensures your 100-photo dating suite retains your exact facial likeness, physique, and natural expressions in every scene.
        </p>
      </div>
    </div>
  );
}

