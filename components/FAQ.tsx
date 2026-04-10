import React from 'react';
import AccordionItem from './ui/Accordion';
import ScrollReveal from './ui/ScrollReveal';

const faqs = [
  {
    question: "Is there a job guarantee?",
    answer: "No job is guaranteed, but the opportunity is. We guarantee access to up to 25 interview drives per quarter for eligible students. If you do the work, you will get the shots."
  },
  {
    question: "What does it cost?",
    answer: "We offer custom models for colleges and institutes. For students, the Opportunity Guarantee Program may have a program fee based on the current model. Please check the latest official pricing."
  },
  {
    question: "How do you vet candidates?",
    answer: "We use a combination of automated skill assessments, portfolio reviews, and mock interviews to ensure every candidate we send to a corporate partner is ready for Day 1."
  }
];

const FAQ: React.FC = () => {
  return (
    <section className="py-32 px-6 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800">
      <div className="container mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="font-sans font-bold tracking-tight text-4xl text-slate-900 dark:text-white text-center mb-16">Questions?</h2>
        </ScrollReveal>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.1} animation="fade-up">
              <AccordionItem title={faq.question}>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{faq.answer}</p>
              </AccordionItem>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;