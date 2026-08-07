import { Link } from "react-router-dom";
import Layout from "../../Component/Layout/Layout";
import PageSEO from "../../Component/SEO/PageSEO";
import useGsapReveal from "../../hooks/useGsapReveal";
import Style from "./About.module.css";

const features = [
  {
    icon: "fa-solid fa-note-sticky",
    title: "Smart Notes",
    desc: "Capture quick thoughts, ideas, and reminders instantly, organized exactly how you like them.",
  },
  {
    icon: "fa-solid fa-book-open",
    title: "Notebook",
    desc: "A distraction-free writing space for journaling, essays, or longer notes — always ready when you are.",
  },
  {
    icon: "fa-solid fa-thumbtack",
    title: "Sticky Notes",
    desc: "Colorful, tactile sticky notes for the things you want to see at a glance.",
  },
  {
    icon: "fa-solid fa-circle-half-stroke",
    title: "Dark & Light Mode",
    desc: "Switch between a bright, clean look or an easy-on-the-eyes dark theme, any time.",
  },
  {
    icon: "fa-solid fa-screwdriver-wrench",
    title: "Productivity Tools",
    desc: "A growing toolbox of everyday utilities, all in one place.",
  },
  {
    icon: "fa-solid fa-calculator",
    title: "Calculator Collection",
    desc: "From quick sums to scientific calculations and unit conversions — covered.",
  },
  {
    icon: "fa-solid fa-lock",
    title: "Local Storage",
    desc: "Everything you write stays on your own device — private by default.",
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Fast Performance",
    desc: "Pages load instantly and everything feels smooth, even on slower connections.",
  },
  {
    icon: "fa-solid fa-mobile-screen-button",
    title: "Responsive Design",
    desc: "Looks and works beautifully on your phone, tablet, or desktop.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Privacy Friendly",
    desc: "No accounts, no tracking, no unnecessary data collection.",
  },
  {
    icon: "fa-solid fa-mug-hot",
    title: "Buy Me A Coffee Support",
    desc: "Stiknex is free to use — if it helps you, you can support its growth with a coffee.",
  },
];

const whyChoose = [
  {
    icon: "fa-solid fa-face-smile",
    title: "Simple",
    desc: "No learning curve — open it and start using it right away.",
  },
  {
    icon: "fa-solid fa-bolt-lightning",
    title: "Fast",
    desc: "Built for speed, so nothing ever feels like it's holding you back.",
  },
  {
    icon: "fa-solid fa-wand-magic-sparkles",
    title: "Modern",
    desc: "A polished, contemporary look that feels good to use every day.",
  },
  {
    icon: "fa-solid fa-wifi",
    title: "Works Offline",
    desc: "Your notes are saved locally, so they're there even without a connection.",
  },
  {
    icon: "fa-solid fa-layer-group",
    title: "Clean UI",
    desc: "A tidy, clutter-free interface that keeps the focus on your content.",
  },
  {
    icon: "fa-solid fa-gift",
    title: "Free to Use",
    desc: "Every feature is available at no cost, with no hidden paywalls.",
  },
  {
    icon: "fa-solid fa-user-shield",
    title: "Privacy Friendly",
    desc: "Your data belongs to you, and stays with you.",
  },
  {
    icon: "fa-solid fa-heart",
    title: "Beautiful Experience",
    desc: "Thoughtful little details and smooth animations throughout.",
  },
];

const About = () => {
  const heroRef = useGsapReveal();
  const introRef = useGsapReveal();
  const featuresGridRef = useGsapReveal();
  const whyChooseGridRef = useGsapReveal();

  return (
    <Layout hideSidebar>
      {(darkMode) => (
        <div className={Style.wrapper}>
          <PageSEO
            title="About Stiknex — Free Notes, Notebook & Productivity Tools"
            description="Stiknex is a free, fast, and privacy-friendly space for sticky notes, notebook writing, and everyday productivity tools — no sign-up required."
            path="/about"
          />

          <section className={Style.hero} ref={heroRef}>
            <div
              className={`${Style.heroIcon} ${
                darkMode ? Style.darkHeroIcon : ""
              }`}
            >
              <i className="fa-solid fa-note-sticky"></i>
            </div>

            <h1
              className={`${Style.heroTitle} ${Style.aboutHeroTitle} bg-linear-to-r from-[#8B2CF5] via-[#4F5CFF] to-[#2EB8FF] bg-clip-text text-transparent`}
            >
              About Stiknex
            </h1>

            <p className={Style.heroDesc}>
              A free, focused space for your notes, your writing, and the
              little tools that keep your day moving.
            </p>

            <div className={Style.heroCtas}>
              <Link to="/" className="greenButton">
                <i className="fa-solid fa-note-sticky"></i> Start Writing
              </Link>
              <Link to="/tools" className="whiteButton">
                <i className="fa-solid fa-screwdriver-wrench"></i> Explore
                Tools
              </Link>
            </div>
          </section>

          <section className={Style.section} ref={introRef}>
            <h2 className={Style.sectionTitle}>What is Stiknex?</h2>
            <p className={Style.sectionText}>
              Stiknex is a home for your thoughts — sticky notes for quick
              ideas, a notebook for longer writing, and a set of everyday
              tools, all in one clean, distraction-free place. It was
              created out of a simple frustration: most note apps are
              either too heavy, too complicated, or lock your notes
              behind an account you never wanted to make.
            </p>
            <p className={Style.sectionText}>
              Stiknex strips all of that away. Open it, start typing, and
              your work is saved instantly — right on your own device.
              No sign-ups, no sync delays, no clutter. Just a calm,
              tactile space that helps you capture and organize what
              matters, styled in a way that's genuinely pleasant to look
              at every day.
            </p>
          </section>

          <section className={Style.section}>
            <h2 className={Style.sectionTitle}>Features</h2>

            <div className={Style.grid} ref={featuresGridRef}>
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`${Style.featureCard} ${
                    darkMode ? Style.darkFeatureCard : ""
                  }`}
                >
                  <div className={Style.featureIcon}>
                    <i className={f.icon}></i>
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={Style.section}>
            <h2 className={Style.sectionTitle}>Why Choose Stiknex</h2>

            <div className={Style.grid} ref={whyChooseGridRef}>
              {whyChoose.map((w) => (
                <div
                  key={w.title}
                  className={`${Style.featureCard} ${
                    darkMode ? Style.darkFeatureCard : ""
                  }`}
                >
                  <div className={Style.featureIcon}>
                    <i className={w.icon}></i>
                  </div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default About;