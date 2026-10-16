import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/scroll-reveal";
import { getWriterProfile } from "@/lib/cms/data";

export async function AboutSection() {
  const profile = await getWriterProfile();
  return (
    <section className="about-section content-width" id="about" aria-labelledby="about-title">
      <Reveal as="figure" className="about-art">
        <div className="about-photo-wrap">
          <div className="about-photo-float">
            <Image alt="Swati smiling in a blue dress on a garden bench" className="about-image" height={408} sizes="(max-width: 760px) 88vw, 34vw" src="/images/swati-about.png" width={480} />
          </div>
        </div>
        <figcaption>A little joy, caught between stories.</figcaption>
      </Reveal>
      <Reveal className="about-copy">
        <p className="eyebrow">A little about me</p>
        <h2 id="about-title">I’m {profile?.display_name || "Swati"} — a keeper of stories &amp; <span>explorer of books</span></h2>
        {profile?.biography ? <p>{profile.biography}</p> : <><p>In my books, I pour out my unexpressed feelings through words. A conversation overheard, a city in the rain, a feeling without a name — that’s where my stories begin.</p><p>When I’m not writing, you’ll find me fighting between my series and sleep, a cup of coffee and my never-ending TBR. This space is my collection of words, imagination, wonder, and books worth sharing.</p></>}
        <a className="text-link" href="#contact">More about my journey <ArrowUpRight aria-hidden="true" /></a>
      </Reveal>
    </section>
  );
}