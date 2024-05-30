import React from "react";
import css from "./FAQBlock.module.css";
import { useTranslation } from "react-i18next";
import TitleWithBgLine from "../../../shared/ui/TitleWithBgLine/TitleWithBgLine";
import Container from "../../../shared/ui/Container/Container";

export const FAQBlock = () => {
  const [t] = useTranslation(["translation"]);

  return (
    <div className={css.container}>
      <TitleWithBgLine value={t("mainpage.faq-block.title")} />
      <Container className={css.description}>
        {t("mainpage.faq-block.description")}
      </Container>
    </div>
  );
};
