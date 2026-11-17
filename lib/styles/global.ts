import { css } from "./css"
import { bp, color, font, layout } from "./theme"

export const globalCss = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  * {
    margin: 0;
    padding: 0;
  }
  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    scroll-behavior: smooth;
    scroll-padding-top: 24px;
    color-scheme: light;
  }
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
  body {
    background: ${color.ivory};
    color: ${color.text};
    font-family: ${font.sans};
    font-size: 16px;
    line-height: 1.8;
    letter-spacing: 0.02em;
    font-feature-settings: "palt" 0;
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  @media ${bp.md} {
    body {
      font-size: 17px;
    }
  }
  img,
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }
  ul[class],
  ol[class] {
    list-style: none;
  }
  a {
    color: ${color.link};
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
  }
  a:hover {
    color: ${color.goldDeep};
  }
  :focus-visible {
    outline: 2px solid ${color.gold};
    outline-offset: 2px;
    border-radius: 2px;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: ${font.serif};
    font-weight: 600;
    line-height: 1.45;
    color: ${color.navy};
    letter-spacing: 0.03em;
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  ::selection {
    background: ${color.goldPale};
  }

  .t-container {
    width: 100%;
    max-width: ${layout.maxWidth};
    margin: 0 auto;
    padding: 0 ${layout.gutter};
  }
  .t-main {
    flex: 1;
    padding: 24px 0 64px;
  }
  @media ${bp.md} {
    .t-main {
      padding: 40px 0 96px;
    }
  }
  .t-visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .t-skip {
    position: absolute;
    left: -9999px;
    top: 8px;
    background: ${color.navy};
    color: #fff;
    padding: 8px 16px;
    z-index: 10;
  }
  .t-skip:focus {
    left: 8px;
    color: #fff;
  }

  .t-page-header {
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${color.border};
  }
  .t-page-header__eyebrow {
    font-family: ${font.latin};
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${color.goldDeep};
    font-size: 0.8rem;
  }
  .t-page-header__title {
    font-size: 1.7rem;
    margin-top: 4px;
  }
  @media ${bp.md} {
    .t-page-header__title {
      font-size: 2.2rem;
    }
  }
  .t-page-header__desc {
    color: ${color.muted};
    margin-top: 10px;
    max-width: ${layout.measure};
  }

  .t-section {
    margin-top: 48px;
  }
  .t-section:first-child {
    margin-top: 0;
  }
  .t-section__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid ${color.navy};
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  .t-section__title {
    font-size: 1.25rem;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .t-section__title small {
    font-family: ${font.latin};
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${color.goldDeep};
    font-weight: 400;
  }
  .t-section__more {
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .t-prose {
    max-width: ${layout.measure};
  }
  .t-prose p + p {
    margin-top: 1em;
  }
  .t-prose h2 {
    font-size: 1.35rem;
    margin: 2em 0 0.8em;
  }
  .t-prose h3 {
    font-size: 1.1rem;
    margin: 1.6em 0 0.6em;
  }
  .t-prose ul,
  .t-prose ol {
    padding-left: 1.5em;
    margin: 1em 0;
  }
  .t-prose li + li {
    margin-top: 0.3em;
  }

  .t-two-col {
    display: grid;
    gap: 40px;
  }
  @media ${bp.lg} {
    .t-two-col {
      grid-template-columns: minmax(0, 1fr) 300px;
      gap: 56px;
    }
  }

  .t-meta {
    font-size: 0.85rem;
    color: ${color.muted};
  }
  .t-empty {
    color: ${color.muted};
    padding: 24px;
    border: 1px dashed ${color.border};
    text-align: center;
  }
`
