import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "01",
    label: "ADD 4–6 SELFIES",
    title: "Give us a clear read on you.",
    copy: "A few ordinary photos are enough. Different angles, clear light, no professional shoot required.",
    color: "#45c4f9",
    light: false,
  },
  {
    number: "02",
    label: "ANSWER 3 THINGS",
    title: "Choose the lean, not every frame.",
    copy: "Pick the look to lead with, what you actually do, and anything you want left out. We plan the rest.",
    color: "#f7b733",
    light: false,
  },
  {
    number: "03",
    label: "GET THE PROFILE",
    title: "Fifteen shoots arrive ready to sort.",
    copy: "Browse by shoot or filter for your opener, full body, what you do, and the rest of the profile.",
    color: "#ec2578",
    light: true,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-8 border-y border-black/10 bg-white px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="font-serif text-2xl italic text-black">you do the human part</span>
            <h2 className="mt-2 max-w-4xl font-oxanium text-[clamp(2.7rem,6.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.07em] text-black">
              Three questions.<br />We direct the shoot.
            </h2>
          </div>
          <Link
            href="/login"
            className="group mb-2 flex h-12 items-center shadow-sm transition-transform hover:-translate-y-1 sm:h-14"
          >
            <span className="flex h-full items-center bg-black px-5 font-mono text-[10px] font-bold tracking-[0.13em] text-white sm:px-6 sm:text-[11px]">
              START FOR $39
            </span>
            <span className="grid h-full w-12 place-items-center border-l-2 border-dashed border-white bg-black text-white transition-colors group-hover:border-black group-hover:bg-[#45c4f9] group-hover:text-black sm:w-14">
              ↗
            </span>
          </Link>
        </div>

        <div className="mt-14 grid border-l border-t border-black/15 lg:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="relative min-h-[390px] border-b border-r border-black/15 p-6 sm:p-8 lg:p-9">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-2 font-mono text-[9px] font-bold tracking-[0.12em] ${step.light ? "text-white" : "text-black"}`} style={{ backgroundColor: step.color }}>
                  STEP {step.number}
                </span>
                <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-black/35">{step.label}</span>
              </div>
              <div className="mt-14">
                <span className="font-oxanium text-7xl font-bold tracking-[-0.08em]" style={{ color: step.color }}>
                  {step.number}
                </span>
                <h3 className="mt-3 max-w-sm font-oxanium text-3xl font-medium leading-[1.02] tracking-[-0.05em] text-black sm:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-sm text-sm leading-6 text-black/55 sm:text-[15px]">{step.copy}</p>
              </div>
              <span className="absolute bottom-4 right-4 h-3 w-3 border border-black" style={{ backgroundColor: step.color }} />
            </article>
          ))}
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative mx-auto h-[480px] w-full max-w-[480px] sm:h-[600px]">
            <div className="absolute left-0 top-8 w-[55%] -rotate-6 border border-black/10 bg-white p-2 pb-10 shadow-[0_18px_55px_rgba(0,0,0,0.15)] sm:p-3 sm:pb-12">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="/images/demo14.jpg" alt="Example reference selfie uploaded to UnrealShot" fill className="object-cover" sizes="270px" />
              </div>
              <span className="absolute bottom-2 left-0 w-full text-center font-serif text-lg italic text-black">one of your selfies</span>
            </div>
            <div className="absolute bottom-0 right-0 z-10 w-[63%] rotate-5 border border-black/10 bg-white p-2 pb-10 shadow-[0_20px_65px_rgba(0,0,0,0.18)] sm:p-3 sm:pb-12">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src="/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg" alt="Example UnrealShot result from the same person" fill className="object-cover" sizes="310px" />
                <span className="absolute right-2 top-2 bg-[#25a882] px-2 py-1 font-mono text-[8px] font-bold tracking-[0.1em] text-black">RESULT</span>
              </div>
              <span className="absolute bottom-2 left-0 w-full text-center font-serif text-lg italic text-black">one of fifteen shoots</span>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#ec2578]">THE INPUT / THE OUTPUT</span>
            <h3 className="mt-4 font-oxanium text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.96] tracking-[-0.06em] text-black">
              You are not supposed to arrive camera-ready.
            </h3>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-black/58 sm:text-[17px]">
              The whole point is to turn the selfies already on your phone into the photographs your profile is missing. No studio. No posing guide. No prompt engineering.
            </p>
            <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-2">
              {[
                ["4–6", "REFERENCE SELFIES"],
                ["22", "REAL INTERESTS TO PICK"],
                ["4", "THINGS YOU CAN EXCLUDE"],
                ["0", "PROMPTS TO WRITE"],
              ].map(([value, label]) => (
                <div key={label} className="bg-white p-5">
                  <strong className="font-oxanium text-4xl tracking-[-0.06em] text-black">{value}</strong>
                  <span className="ml-3 font-mono text-[9px] font-bold tracking-[0.11em] text-black/45">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
