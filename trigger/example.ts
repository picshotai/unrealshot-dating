import { task } from "@trigger.dev/sdk";

/** Smoke-test task — remove after trigger.dev is verified. */
export const helloWorldTask = task({
  id: "hello-world",
  run: async (payload: { message?: string }) => {
    console.log(payload.message ?? "Hello from Trigger.dev");
    return { ok: true };
  },
});
