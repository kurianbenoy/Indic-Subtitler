import Gallery from "@components/components/Gallery";

function About() {
  return (
    <main className="lg:mx-28 mx-2">
      <section className="mb-7 md:mt-14">
        <h1 className="text-3xl font-medium">Meet Our Team</h1>
        <p className="text-gray-400 md:w-[80ch] leading-7 mt-2">
          The Indic Subtitler team spearheads a movement aimed at facilitating
          the seamless generation of Indic subtitles. We value{" "}
          <span className="text-primary-900 font-medium">Open Source</span>,{" "}
          <span className="text-primary-900 font-medium">Learning</span>, and{" "}
          <span className="text-primary-900 font-medium">
            Open Communication
          </span>
        </p>
      </section>
      <Gallery />
    </main>
  );
}

export default About;
