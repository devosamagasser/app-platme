import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t } = useTranslation();

  const faqs = [
    { qKey: "faq.q1", aKey: "faq.a1" },
    { qKey: "faq.q2", aKey: "faq.a2" },
    { qKey: "faq.q3", aKey: "faq.a3" },
    { qKey: "faq.q4", aKey: "faq.a4" },
    { qKey: "faq.q5", aKey: "faq.a5" },
    { qKey: "faq.q6", aKey: "faq.a6" },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 relative">
      <div className="relative container mx-auto px-4 md:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-architect text-foreground">
            {t("faq.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-primary/10 bg-card/30 backdrop-blur-sm px-5 data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                  {t(faq.qKey)}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {t(faq.aKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
