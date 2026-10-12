import { Reveal } from "@/components/scroll-reveal";

const reviews = [
  { quote: "Swati has a way of putting into words the things I have only ever felt. Her stories feel like a letter from an old friend.", initials: "AM", name: "Ananya M.", detail: "Story lover · Mumbai" },
  { quote: "I came for the book reviews and stayed for the poems. This little corner of the internet is my Sunday morning ritual.", initials: "RS", name: "Rohan S.", detail: "Avid reader · Bengaluru" },
  { quote: "Honest, gentle, and beautifully observant. Her reflections always remind me to slow down and notice a little more.", initials: "MK", name: "Meera K.", detail: "Newsletter reader · Delhi" },
];

export function ReviewsSection() {
  return (
    <section className="reviews-section content-width" id="reviews" aria-labelledby="reviews-title">
      <Reveal as="header" className="section-heading"><p className="eyebrow">Words that found a home</p><h2 id="reviews-title">What Readers Are Saying</h2></Reveal>
      <div className="review-grid">
        {reviews.map((review) => (
          <Reveal as="figure" className="review-card" key={review.initials}>
            <span className="quote-mark" aria-hidden="true">“</span>
            <blockquote>{review.quote}</blockquote>
            <figcaption className="review-author"><span className="avatar" aria-hidden="true">{review.initials}</span><span><strong>{review.name}</strong><small>{review.detail}</small></span></figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}