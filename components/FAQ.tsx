
import React from 'react';
import AccordionItem from './ui/Accordion';

const faqs = [
  {
    question: "Is there a job guarantee?",
    answer: "No job is guaranteed, but the opportunity is. We guarantee access to up to 25 interview drives per quarter for eligible students. If you do the work, you will get the shots."
  },
  {
    question: "What does it cost?",
    answer: "We offer custom models for colleges and institutes. For students, our 90-day sprint has a program fee. Contact us for the latest pricing."
  },
  {
    question: "How do you vet candidates?",
    answer: "We use a combination of automated skill assessments, portfolio reviews, and mock interviews to ensure every candidate we send to a corporate partner is ready for Day 1."
  }
];

const FAQ: React.FC = () => {
  return (
    <section className="py-32 px-6 bg-white border-t border-gray-100">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-serif text-4xl text-slate-900 text-center mb-16">Questions?</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question}>
              <p className="text-lg text-gray-500 font-light leading-relaxed">{faq.answer}</p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
