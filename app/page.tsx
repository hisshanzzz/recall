import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      <nav className="sticky top-0 z-[100] bg-warm-white/80 backdrop-blur-md h-16 px-[60px] flex items-center justify-between border-b border-coffee/5 shadow-sm">
        <Link href="/" className="text-[22px] font-[800] text-coffee tracking-[-0.03em]">
          Recall
        </Link>

        <div className="flex items-center gap-8">
          <a href="#about" className="text-[13px] font-medium text-leather hover:text-peach transition-colors duration-200">
            About
          </a>
          <a href="#how-it-works" className="text-[13px] font-medium text-leather hover:text-peach transition-colors duration-200">
            How it works
          </a>
          <a href="#technology" className="text-[13px] font-medium text-leather hover:text-peach transition-colors duration-200">
            Technology
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/caregiver/login"
            className="px-5 py-2 rounded-full border-[1.5px] border-leather text-leather text-[13px] font-medium hover:border-peach hover:text-peach transition-colors duration-200"
          >
            Caregiver login
          </Link>
          <Link
            href="/patient/login"
            className="btn-shimmer px-5 py-2 rounded-full bg-gradient-to-r from-peach to-maroon text-creme text-[13px] font-medium shadow-lg shadow-peach/20 hover:scale-[1.03] transition-transform duration-200"
          >
            Patient login
          </Link>
        </div>
      </nav>

      <section id="about" className="relative bg-warm-white py-20 px-[60px] overflow-hidden">
        {/* Decorative background orbs */}
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full bg-peach/[0.07] blur-[120px] animate-orb pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-80px] w-[400px] h-[400px] rounded-full bg-clay/[0.08] blur-[100px] animate-orb-2 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-[60px] items-center">
          <div className="scroll-reveal">
            <h1 className="text-[52px] font-[800] leading-[1.05] tracking-[-0.04em] text-coffee mb-6">
              A companion who never <span className="text-peach">forgets</span>
            </h1>

            <p className="text-[17px] font-normal text-leather leading-[1.7] max-w-[480px] mb-8">
              Recall connects dementia patients with Ama — a Sinhala-speaking AI avatar who knows their life story. For families who can&apos;t always be there.
            </p>

            <div className="flex items-center gap-4 mb-10">
              <Link
                href="/patient/login"
                className="btn-shimmer px-6 py-3 rounded-full bg-gradient-to-r from-peach to-maroon text-creme text-[14px] font-semibold shadow-lg shadow-peach/25 hover:shadow-xl hover:shadow-peach/30 transition-shadow duration-200"
              >
                I am a patient
              </Link>
              <Link
                href="/caregiver/login"
                className="px-6 py-3 rounded-full border-[1.5px] border-leather text-leather text-[14px] font-medium hover:border-peach hover:text-peach transition-colors duration-200"
              >
                I am a caregiver
              </Link>
            </div>

            <div className="flex items-center gap-10">
              <div className="scroll-reveal scroll-reveal-delay-2">
                <div className="text-[24px] font-bold text-coffee">55M+</div>
                <div className="text-[11px] font-medium text-clay">Dementia patients worldwide</div>
              </div>
              <div className="scroll-reveal scroll-reveal-delay-3">
                <div className="text-[24px] font-bold text-coffee">80K+</div>
                <div className="text-[11px] font-medium text-clay">In Sri Lanka alone</div>
              </div>
              <div className="scroll-reveal scroll-reveal-delay-4">
                <div className="text-[24px] font-bold text-coffee">24/7</div>
                <div className="text-[11px] font-medium text-clay">Ama is always available</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 scroll-reveal scroll-reveal-delay-1">
            <div className="bg-coffee rounded-[20px] shadow-2xl overflow-hidden animate-float">
              <div className="bg-creme/[0.06] px-4 py-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-creme/10 text-[11px] text-creme/50">
                    recall.app/patient/call
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-clay to-leather flex items-center justify-center flex-shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-creme">
                    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.9" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" opacity="0.7" />
                  </svg>
                </div>

                <div className="flex-1">
                  <div className="bg-creme/[0.08] border border-creme/[0.15] rounded-[12px] rounded-bl-[3px] p-4">
                    <p className="text-[13px] font-medium text-creme leading-relaxed mb-2">
                      ආයුබෝවන් තාත්තා! නෙගොඹෝ ගඟේ යන්න ආස නේද?
                    </p>
                    <p className="text-[10px] text-creme/35 italic">
                      Ayubowan Thatha! Don&apos;t you love fishing at Negombo?
                    </p>
                  </div>

                  <div className="flex items-end gap-1 mt-3">
                    <div className="w-1 bg-peach rounded-full animate-wave-1" style={{ height: "12px" }} />
                    <div className="w-1 bg-peach rounded-full animate-wave-2" style={{ height: "18px" }} />
                    <div className="w-1 bg-peach rounded-full animate-wave-3" style={{ height: "10px" }} />
                    <div className="w-1 bg-peach rounded-full animate-wave-4" style={{ height: "20px" }} />
                    <div className="w-1 bg-peach rounded-full animate-wave-5" style={{ height: "14px" }} />
                    <span className="text-[10px] text-clay/40 ml-2">Ama is speaking</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#075E54] rounded-[14px] p-[14px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-[14px]">
                  💬
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-white">Recall — Pradeep Perera</div>
                  <div className="text-[9px] text-white/40">WhatsApp · Just now</div>
                </div>
              </div>
              <div className="h-px bg-white/10 mb-3" />
              <div className="bg-[#128C7E] rounded-[0px_9px_9px_9px] px-[11px] py-[9px]">
                <p className="text-[11px] text-white leading-[1.6]">
                  Thatha was in great spirits today! He talked about fishing at Negombo and asked about you. Overall a lovely session. 💙
                </p>
              </div>
              <div className="text-right mt-2">
                <span className="text-[9px] text-white/30">✓✓ Delivered to Melbourne</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-creme py-20 px-[60px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="scroll-reveal">
            <div className="text-[11px] font-semibold text-clay uppercase tracking-[0.1em] mb-4">The problem</div>
            <h2 className="text-[36px] font-[800] text-coffee tracking-[-0.03em] mb-4">Dementia is a loneliness crisis</h2>
            <p className="text-[16px] text-leather leading-[1.6] max-w-[700px] mx-auto mb-12">
              Patients lose their memories. Families feel helpless from a distance. No existing solution speaks Sinhala, knows the patient&apos;s story, or was built for Sri Lanka.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {[
              { stat: "60%", text: "of dementia patients experience severe loneliness and social isolation", delay: "scroll-reveal-delay-1" },
              { stat: "3s",  text: "A new dementia diagnosis happens somewhere in the world every 3 seconds", delay: "scroll-reveal-delay-2" },
              { stat: "0",   text: "Existing solutions that speak Sinhala or understand Sri Lankan culture",   delay: "scroll-reveal-delay-3" },
            ].map((item) => (
              <div key={item.stat} className={`scroll-reveal ${item.delay} bg-warm-white rounded-[16px] p-6 border border-coffee/[0.08] hover:-translate-y-1.5 hover:shadow-md transition-all duration-300`}>
                <div className="text-[36px] font-[800] text-peach mb-2">{item.stat}</div>
                <p className="text-[13px] text-leather leading-[1.5]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="get-started" className="bg-warm-white py-20 px-[60px]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <div className="text-[11px] font-semibold text-clay uppercase tracking-[0.1em] mb-4">Get started</div>
            <h2 className="text-[36px] font-[800] text-coffee tracking-[-0.03em] mb-4">Who are you?</h2>
            <p className="text-[16px] text-leather leading-[1.6]">
              Recall works for both patients and their families. Choose your role to get started.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="scroll-reveal scroll-reveal-delay-1 relative bg-warm-white rounded-[20px] p-7 border border-coffee/[0.08] overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:border-peach/20 transition-all duration-300">
              <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-peach/[0.06]" />
              <div className="flex items-start gap-4 mb-5 relative">
                <div className="w-11 h-11 rounded-xl bg-peach/[0.12] flex items-center justify-center text-[20px]">🧓</div>
                <div>
                  <div className="text-[11px] font-semibold text-peach uppercase tracking-wide">Patient</div>
                  <div className="text-[16px] font-bold text-coffee">I have dementia</div>
                  <div className="text-[12px] text-clay">or a family member is setting this up for me</div>
                </div>
              </div>
              <p className="text-[14px] text-leather leading-[1.6] mb-5 relative">
                Talk to Ama — your Sinhala-speaking companion who knows your name, your memories, and your life story. Always available, always patient, never frustrated.
              </p>
              <ul className="space-y-2.5 mb-6 relative">
                {[
                  "Ama greets you in Sinhala by name",
                  "Talks about your memories — fishing, music, family",
                  "One big button — nothing complicated",
                  "Always calm, always available, never judges",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-[13px] text-leather">
                    <div className="w-5 h-5 rounded-full bg-peach/10 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="#A85530" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/patient/login"
                className="btn-shimmer block w-full text-center px-6 py-3.5 rounded-full bg-gradient-to-r from-peach to-maroon text-creme text-[14px] font-semibold hover:shadow-lg hover:shadow-peach/20 transition-shadow duration-200"
              >
                Enter as patient →
              </Link>
            </div>

            <div className="scroll-reveal scroll-reveal-delay-2 relative bg-warm-white rounded-[20px] p-7 border border-coffee/[0.08] overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:border-guave/20 transition-all duration-300">
              <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-guave/[0.06]" />
              <div className="flex items-start gap-4 mb-5 relative">
                <div className="w-11 h-11 rounded-xl bg-guave/[0.12] flex items-center justify-center text-[20px]">👨‍👩‍👧</div>
                <div>
                  <div className="text-[11px] font-semibold text-guave uppercase tracking-wide">Caregiver</div>
                  <div className="text-[16px] font-bold text-coffee">I care for someone</div>
                  <div className="text-[12px] text-clay">family member, nurse, or support worker</div>
                </div>
              </div>
              <p className="text-[14px] text-leather leading-[1.6] mb-5 relative">
                Manage the memory book, start sessions, and get WhatsApp updates after every conversation.
              </p>
              <ul className="space-y-2.5 mb-6 relative">
                {[
                  "Add memories — Ama uses them every session",
                  "Start sessions remotely or in person",
                  "WhatsApp summary after every conversation",
                  "Mood trends and session history at a glance",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-[13px] text-leather">
                    <div className="w-5 h-5 rounded-full bg-guave/10 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="#8F7C3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/caregiver/login"
                className="block w-full text-center px-6 py-3.5 rounded-full bg-coffee text-creme text-[14px] font-semibold hover:bg-maroon transition-colors duration-200"
              >
                Enter as caregiver →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-warm-white py-20 px-[60px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold text-clay uppercase tracking-[0.1em] mb-4">How it works</div>
            <h2 className="text-[36px] font-[800] text-coffee tracking-[-0.03em]">Simple for patients. Powerful for families.</h2>
          </div>
          <div className="relative">
            <div className="absolute top-7 left-[14%] right-[14%] h-px bg-coffee/[0.12]" />
            <div className="grid grid-cols-4 gap-8">
              {[
                { num: "1", color: "peach",   delay: "scroll-reveal-delay-1", title: "Family adds memories",  desc: "Caregivers fill in the memory book — names, places, stories, favourite songs" },
                { num: "2", color: "leather", delay: "scroll-reveal-delay-2", title: "Ama learns the story",   desc: "Recall injects the memory book into Ama before every session via Beyond Presence" },
                { num: "3", color: "coffee",  delay: "scroll-reveal-delay-3", title: "Patient taps and talks", desc: "One big button. Ama greets them, already knowing who they are" },
                { num: "4", color: "guave",   delay: "scroll-reveal-delay-4", title: "Family gets updated",    desc: "WhatsApp summary lands automatically after every session ends" },
              ].map((step) => (
                <div key={step.num} className={`text-center relative scroll-reveal ${step.delay}`}>
                  <div
                    className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-[18px] font-bold hover:scale-105 transition-transform duration-200 ${
                      step.color === "peach"
                        ? "bg-peach/[0.12] text-peach"
                        : step.color === "leather"
                          ? "bg-leather/[0.12] text-leather"
                          : step.color === "coffee"
                            ? "bg-coffee/10 text-coffee"
                            : "bg-guave/[0.12] text-guave"
                    }`}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-[13px] font-semibold text-coffee mb-2">{step.title}</h3>
                  <p className="text-[12px] text-clay leading-[1.5]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className="bg-coffee py-20 px-[60px]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-[11px] font-semibold text-clay/50 uppercase tracking-[0.1em] mb-4">Technology</div>
            <h2 className="text-[36px] font-[800] text-creme tracking-[-0.03em] mb-4">Built with the best tools</h2>
            <p className="text-[16px] text-creme/50 leading-[1.6] max-w-[700px] mx-auto">
              Recall uses Beyond Presence as its core — with Gemini for fast LLM responses, LiveKit for real-time audio, and Claude for caregiver summaries.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Avatar + lip sync", name: "Beyond Presence",   desc: "Photorealistic digital human avatar with real-time lip sync and just-in-time memory context injection per session.", delay: "scroll-reveal-delay-1" },
              { label: "LLM",               name: "Gemini",            desc: "Google's Gemini 2.0 Flash powers Ama's real-time Sinhala responses via VertexAI with low latency.",          delay: "scroll-reveal-delay-2" },
              { label: "Real-time audio",   name: "LiveKit",           desc: "Low-latency audio/video transport connecting the patient's browser to the AI agent.",                                  delay: "scroll-reveal-delay-3" },
              { label: "WhatsApp",          name: "Twilio",            desc: "Sends the post-session summary directly to the caregiver's phone. No app install needed.",                             delay: "scroll-reveal-delay-1" },
              { label: "Frontend",          name: "Next.js + Tailwind",desc: "Six screens, Inter font, custom colour palette. Deployed to Netlify. Patient side optimised for tablet.",              delay: "scroll-reveal-delay-2" },
            ].map((tech) => (
              <div key={tech.name} className={`scroll-reveal ${tech.delay} bg-creme/[0.06] border border-creme/10 rounded-[14px] p-4 hover:-translate-y-1 hover:bg-creme/[0.10] hover:border-creme/20 transition-all duration-300`}>
                <div className="text-[10px] font-semibold text-clay/40 uppercase tracking-wide mb-1">{tech.label}</div>
                <div className="text-[15px] font-semibold text-creme mb-2">{tech.name}</div>
                <p className="text-[12px] text-creme/40 leading-[1.45]">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-coffee py-10 px-[60px] border-t border-creme/10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <div className="text-[20px] font-[800] text-creme mb-1">Recall</div>
            <div className="text-[12px] text-creme/40">A companion who never forgets · Built for Sri Lanka</div>
          </div>
          <div className="text-[12px] text-creme/30">Cursor Buildathon Sri Lanka 2025</div>
        </div>
      </footer>
    </div>
  )
}
