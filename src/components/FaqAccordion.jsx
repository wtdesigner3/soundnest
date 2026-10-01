'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FaqAccordion.module.css';

export default function FaqAccordion({ faqs = [] }) {
  // First item active by default (matching WordPress Woodmart behavior)
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  if (!faqs.length) return null;

  return (
    <div className={styles.faqWrapper}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${faq.id || index}`;
        const headerId = `faq-header-${faq.id || index}`;

        return (
          <div
            key={faq.id || index}
            className={`${styles.faqItem} ${isOpen ? styles.active : ''}`}
          >
            <button
              id={headerId}
              type="button"
              className={styles.faqTrigger}
              onClick={() => toggleFaq(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className={styles.faqQuestion}>{faq.question}</span>
              <ChevronDown
                className={`${styles.chevronIcon} ${isOpen ? styles.chevronActive : ''}`}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={`${styles.faqBody} ${isOpen ? styles.faqBodyOpen : ''}`}
            >
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
