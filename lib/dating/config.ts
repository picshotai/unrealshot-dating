import { z } from "zod";
import {
  FRAMES_PER_SHOOT,
  SAMPLE_SHOOTS,
  SHOOTS_PER_DELIVERY,
  TOTAL_PHOTOS,
} from "./product-settings";

const testModeSchema = z.enum(["mock", "sample", "off"]);

function integerEnv(name: string, fallback: number, minimum: number, maximum: number) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return value;
}

export type DatingProductConfig = {
  shootsPerDelivery: number;
  framesPerShoot: 4;
  photosPerDelivery: number;
  testMode: z.infer<typeof testModeSchema>;
  sampleShoots: number;
  geminiConcurrency: number;
  promptAttemptsPerIdea: number;
};

export function getDatingProductConfig(): DatingProductConfig {
  return {
    shootsPerDelivery: SHOOTS_PER_DELIVERY,
    framesPerShoot: FRAMES_PER_SHOOT,
    photosPerDelivery: TOTAL_PHOTOS,
    testMode: testModeSchema.parse(
      (process.env.DATING_TEST_MODE ?? "off").toLowerCase()
    ),
    sampleShoots: SAMPLE_SHOOTS,
    geminiConcurrency: integerEnv("DATING_GEMINI_CONCURRENCY", 4, 1, 20),
    promptAttemptsPerIdea: integerEnv("DATING_PROMPT_ATTEMPTS_PER_IDEA", 3, 1, 10),
  };
}
