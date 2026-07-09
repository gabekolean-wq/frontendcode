import Aquarium from "./components/Aquarium";
import BubbleTrail from "./components/BubbleTrail";
import PanicButton from "./components/PanicButton";
import GravityToggle from "./components/GravityToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Interests", href: "#interests" },
  { label: "Contact", href: "#contact" },
];

const interests = [
  "The Perin Health Patch",
  "Being a fulltime full-stack developer",
  "Asking agents to solve my problems",
  ";askjas;jdkasjkldjasjdl",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3f3ef] text-zinc-700">
      <header className="border-b border-zinc-300 bg-[#f7f7f4]/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5 sm:px-8 lg:px-0">
          <a href="#home" className="text-lg font-semibold tracking-[0.2em] text-zinc-900 uppercase">
            Gabe
          </a>
          <nav className="flex gap-4 text-sm text-zinc-600">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="transition hover:text-zinc-900">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section id="home" className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-0">
        <div className="rounded-2xl border border-zinc-300 bg-[#fcfcfa] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">Personal site</p>
          <h1 className="mt-3 text-4xl font-semibold text-zinc-900 sm:text-5xl">
            Hi, I’m Gabe.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            Vibe coding is an AI-assisted programming approach where developers describe what they want in natural language, and a large language model (LLM) generates the code, allowing the programmer to focus on guiding, testing, and refining rather than writing every line manually.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#about" className="rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700">
              About me
            </a>
            <a href="#contact" className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
              Say hello if I know you
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-4xl px-6 py-6 sm:px-8 lg:px-0">
        <div className="rounded-2xl border border-zinc-300 bg-[#fcfcfa] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">About me</h2>
          <p className="mt-4 text-base leading-8 text-zinc-600">
            RIght now im editing this sort of template website and I'm enjoying doing so
          </p>
        </div>
      </section>

      <section id="interests" className="mx-auto max-w-4xl px-6 py-6 sm:px-8 lg:px-0">
        <div className="rounded-2xl border border-zinc-300 bg-[#fcfcfa] p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-900">A few things I like</h2>
          <ul className="mt-5 space-y-3 text-zinc-600">
            {interests.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-zinc-900">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-4xl px-6 py-10 sm:px-8 lg:px-0">
        <div className="rounded-2xl border border-zinc-300 bg-zinc-900 p-8 text-zinc-100 shadow-sm">
          <h2 className="text-2xl font-semibold">Get in touch</h2>
          <p className="mt-3 max-w-xl text-base leading-8 text-zinc-300">
            These are my contact details.
          </p>
          <div className="mt-6 space-y-2 text-sm text-zinc-300">
            <div>Email: gabekolean@gmail.com</div>
            <div>Location: idk</div>
          </div>
        </div>
      </section>

      <Aquarium />
      <BubbleTrail />
      <PanicButton />
      <GravityToggle />

      <footer className="border-t border-zinc-300 bg-[#f7f7f4]/80">
        <div className="mx-auto max-w-4xl px-6 py-6 text-sm text-zinc-500 sm:px-8 lg:px-0">
          made for myself.
        </div>
      </footer>
    </main>
  );
}
