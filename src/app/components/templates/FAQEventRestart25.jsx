"use client";
import SectionTitleRestart25 from "@/app/components/titles/SectionTitleRestart25";
import FAQItemRestart25 from "@/app/components/items/FAQItemRestart25";

export default function FAQEventRestart25() {
  const FAQData = [
    {
      question: "What language will the conference be conducted in?",
      answer:
        "Most sessions will be conducted in Bahasa Indonesia, but some parts may also be delivered in English depending on the speaker.",
    },
    {
      question: "Who can attend RE:START Conference 2025?",
      answer:
        "The conference is open to professionals, business owners, students, and anyone passionate about innovation, leadership, and entrepreneurship.",
    },
    {
      question: "Will meals be provided during the conference?",
      answer:
        "Meals are not included in the ticket. However, there will be scheduled breaks, and attendees can visit nearby restaurants and cafés during those times.",
    },
    {
      question:
        "I’m traveling from another city. How do I get to RE:START Conference 2025?",
      answer:
        "You can reach Kuningan City Grand Ballroom via taxi, ride-hailing apps, LRT, or TransJakarta buses. It’s conveniently located in South Jakarta and easily accessible from most areas.",
    },
    {
      question: "Can I buy a ticket at the venue?",
      answer:
        "No, tickets are only available for purchase online. We encourage you to book your ticket early through our official website to secure your spot.",
    },
    {
      question: "Will the conference sessions be recorded?",
      answer:
        "Yes, selected sessions will be recorded. Attendees will be notified if recordings are made available after the event.",
    },
    {
      question: "How can I stay updated with conference announcements?",
      answer:
        "Follow us on our official social media channels or subscribe to our newsletter for the latest updates and information.",
    },
    {
      question: "Can I refund or transfer my ticket if I can’t attend?",
      answer:
        "Tickets are non-refundable, but you may transfer your ticket to another person. Please contact our support team at +62853-5353-3844 (Radha) for assistance.",
    },
    {
      question: "Is there a dress code for the event?",
      answer:
        "We recommend business casual attire. You might want to bring a light jacket as the ballroom can be chilly.",
    },
    {
      question: "Is there parking available at the venue?",
      answer:
        "Yes, Kuningan City Mall provides indoor paid parking facilities. Motorcycles can park at UG–L1 levels, while cars can park from P1 to P6 levels.",
    },
  ];

  return (
    <section id="faq">
      <div className="container-faq flex items-center justify-center px-8 pb-8 lg:pb-[60px]">
        <div className="faq-container flex flex-col gap-3 items-center lg:gap-5">
          <SectionTitleRestart25 sectionTitle="Frequently Asked Questions" />
          <div className="faq-items flex flex-col gap-3 items-center">
            {FAQData.map((post, index) => (
              <FAQItemRestart25
                key={index}
                questions={post.question}
                answer={post.answer}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
