import { css } from "./css"
import { bp, color, font, layout, radius, shadow } from "./theme"

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
    *,
    *::before,
    *::after {
      transition: none !important;
      animation: none !important;
    }
  }
  body {
    background-color: ${color.cream};
    background-image: radial-gradient(${color.border} 1.2px, transparent 1.4px);
    background-size: 22px 22px;
    color: ${color.text};
    font-family: ${font.sans};
    font-size: 16px;
    line-height: 1.8;
    letter-spacing: 0.02em;
    font-feature-settings: "palt" 0;
    font-weight: 500;
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
    text-underline-offset: 0.22em;
    text-decoration-thickness: 2px;
    text-decoration-color: ${color.violetPale};
  }
  a:hover {
    color: ${color.accentDeep};
  }
  :focus-visible {
    outline: 3px solid ${color.sky};
    outline-offset: 2px;
    border-radius: 4px;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: ${font.display};
    font-weight: 700;
    line-height: 1.45;
    color: ${color.ink};
    letter-spacing: 0.04em;
  }
  button,
  input {
    font: inherit;
    color: inherit;
  }
  ::selection {
    background: ${color.yellow};
    color: ${color.ink};
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
    background: ${color.ink};
    color: #fff;
    padding: 8px 16px;
    border-radius: 999px;
    z-index: 10;
  }
  .t-skip:focus {
    left: 8px;
    color: #fff;
  }

  .t-page-header {
    position: relative;
    margin-bottom: 36px;
    padding: 24px 22px 22px;
    background: ${color.paper};
    border: 2.5px solid ${color.ink};
    border-radius: ${radius.lg};
    box-shadow: ${shadow.md};
    overflow: hidden;
  }
  .t-page-header::after {
    content: "";
    position: absolute;
    right: -28px;
    top: -28px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: radial-gradient(${color.yellow} 2px, transparent 2.5px) 0 0 /
      12px 12px;
    opacity: 0.9;
    pointer-events: none;
  }
  @media ${bp.md} {
    .t-page-header {
      padding: 32px 36px 30px;
    }
  }
  .t-page-header__eyebrow {
    display: inline-block;
    font-family: ${font.pop};
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #fff;
    background: ${color.accent};
    border: 2px solid ${color.ink};
    border-radius: 999px;
    padding: 2px 12px;
    font-size: 0.75rem;
    transform: rotate(-2deg);
  }
  .t-page-header__title {
    position: relative;
    font-size: 1.7rem;
    margin-top: 10px;
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
    flex-wrap: wrap;
    padding-bottom: 10px;
    margin-bottom: 22px;
    border-bottom: 3px dotted ${color.ink};
  }
  .t-section__title {
    font-size: 1.3rem;
  }
  .t-section__title::before {
    content: "";
    display: inline-block;
    vertical-align: 0.05em;
    margin-right: 12px;
    width: 14px;
    height: 14px;
    background: ${color.accent};
    border: 2px solid ${color.ink};
    border-radius: 4px;
    transform: rotate(45deg);
  }
  .t-section__title small {
    font-family: ${font.pop};
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${color.ink};
    background: ${color.yellow};
    border-radius: 999px;
    padding: 1px 10px;
    font-weight: 600;
    display: inline-block;
    vertical-align: 0.25em;
    margin-left: 10px;
    white-space: nowrap;
  }
  .t-section__more {
    font-family: ${font.pop};
    font-weight: 600;
    font-size: 0.85rem;
    white-space: nowrap;
    color: ${color.ink};
    text-decoration: none;
    background: ${color.paper};
    border: 2px solid ${color.ink};
    border-radius: 999px;
    padding: 3px 14px;
    box-shadow: ${shadow.sm};
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }
  .t-section__more:hover {
    color: ${color.ink};
    background: ${color.yellow};
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 ${color.ink};
  }

  .t-prose {
    max-width: ${layout.measure};
  }
  .t-prose p + p {
    margin-top: 1em;
  }
  .t-prose h2 {
    font-size: 1.35rem;
    padding-left: 12px;
    border-left: 6px solid ${color.accent};
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
    background: ${color.paper};
    border: 2px dashed ${color.ink};
    border-radius: ${radius.md};
    text-align: center;
  }
`
