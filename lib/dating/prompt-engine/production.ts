import {
  generateShootCandidate,
  type CreativeModelCall,
  type CustomerCreativeInput,
  type DatingShootIntent,
  type ShootWriterRetry,
} from "@/lib/dating/creative-director";

export type ProductionPromptInput = {
  brief: DatingShootIntent;
  input: CustomerCreativeInput;
  retry?: ShootWriterRetry;
  modelCall?: CreativeModelCall;
};

/** One accepted free-form life moment in, one four-frame shoot out. */
export function generateProductionPromptCandidate(input: ProductionPromptInput) {
  return generateShootCandidate(input);
}
