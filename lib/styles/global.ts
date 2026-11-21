import { css } from "./css"
import { bp, color, font, layout, pattern, radius, shadow } from "./theme"

const winButtons = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 14"><g fill="#fff" stroke="${color.accent}" stroke-width="1.5"><rect x="1" y="1" width="14" height="12" rx="2"/><rect x="20" y="1" width="14" height="12" rx="2"/><rect x="39" y="1" width="14" height="12" rx="2"/></g><g fill="none" stroke="${color.accent}" stroke-width="1.6" stroke-linecap="round"><path d="M5 10h6"/><rect x="24" y="4" width="6" height="6"/><path d="M43 4l6 6M49 4l-6 6"/></g></svg>`
)

const pulse = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 12"><path d="M0 6h22l3-5 4 10 3-8 2 3h26" fill="none" stroke="${color.accent}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`
)

/**
 * レトロOS風ウィンドウ。要素に data-title を付けるとタイトルバーに表示する。
 */
export const winCss = (sel: string) => css`
  ${sel} {
    position: relative;
    background: ${color.paper};
    border: 2px solid ${color.line};
    border-radius: ${radius.md};
    box-shadow: ${shadow.md};
    padding-top: 30px;
    overflow: hidden;
  }
  ${sel}::before {
    content: attr(data-title);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 28px;
    padding: 0 76px 0 12px;
    background: linear-gradient(180deg, #fbf3e4, ${color.accentPale});
    border-bottom: 2px solid ${color.line};
    font-family: ${font.pop};
    font-size: 0.78rem;
    line-height: 26px;
    letter-spacing: 0.04em;
    color: ${color.accentDeep};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ${sel}::after {
    content: "";
    position: absolute;
    top: 7px;
    right: 10px;
    width: 54px;
    height: 14px;
    background: url("data:image/svg+xml,${winButtons}") no-repeat center /
      contain;
  }
`

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
    background:
      ${pattern.grid()},
      linear-gradient(
        180deg,
        #fbf3e4 0%,
        ${color.mintPale} 38%,
        ${color.yellowPale} 72%,
        #f9e0c2 100%
      );
    background-attachment: fixed;
    color: ${color.text};
    font-family: ${font.sans};
    font-size: 16px;
    font-weight: 500;
    line-height: 1.85;
    letter-spacing: 0.03em;
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  @media ${bp.md} {
    body {
      font-size: 17px;
      padding: 0 14px;
    }
    /* 画面の外周を囲むストライプの枠 */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      border: 14px solid transparent;
      border-top-width: 0;
      border-image: ${pattern.stripe()} 14;
      pointer-events: none;
      z-index: 50;
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
    text-decoration-color: ${color.mint};
  }
  a:hover {
    color: ${color.accentDeep};
    text-decoration-color: ${color.accent};
  }
  :focus-visible {
    outline: 3px solid ${color.mint};
    outline-offset: 2px;
    border-radius: 4px;
  }
  h1,
  h2,
  h3,
  h4 {
    font-family: ${font.display};
    font-weight: 800;
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
    background: ${color.accentPale};
    color: ${color.accentDeep};
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

  ${winCss(".t-page-header")}
  .t-page-header {
    margin-bottom: 36px;
    padding: 50px 22px 24px;
    background:
      ${pattern.grid("rgba(124, 141, 103, 0.14)", 20)}, ${color.paper};
  }
  @media ${bp.md} {
    .t-page-header {
      padding: 56px 36px 30px;
    }
  }
  .t-page-header__eyebrow {
    font-family: ${font.pop};
    font-size: 1.35rem;
    line-height: 1.25;
    letter-spacing: 0.02em;
    color: ${color.accent};
    text-shadow:
      2px 2px 0 #fff,
      -2px 2px 0 #fff,
      2px -2px 0 #fff,
      -2px -2px 0 #fff,
      4px 4px 0 ${color.mintPale};
  }
  @media ${bp.md} {
    .t-page-header__eyebrow {
      font-size: 1.8rem;
    }
  }
  .t-page-header__title {
    position: relative;
    font-size: 1.5rem;
    margin-top: 6px;
    color: ${color.ink};
  }
  @media ${bp.md} {
    .t-page-header__title {
      font-size: 1.9rem;
    }
  }
  .t-page-header__desc {
    color: ${color.muted};
    margin-top: 10px;
    max-width: ${layout.measure};
  }

  .t-section {
    margin-top: 56px;
  }
  .t-section:first-child {
    margin-top: 0;
  }
  .t-section__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 22px;
  }
  .t-section__heading {
    display: flex;
    align-items: flex-end;
    gap: 10px;
  }
  .t-section__mascot {
    flex: none;
    width: auto;
    height: 64px;
    margin-bottom: -4px;
    transform-origin: 50% 100%;
    transition: transform 0.2s;
  }
  .t-section:hover .t-section__mascot {
    transform: rotate(-4deg) translateY(-2px);
  }
  @media ${bp.md} {
    .t-section__mascot {
      height: 84px;
    }
  }
  .t-section__en {
    font-family: ${font.pop};
    font-size: 2.2rem;
    line-height: 1.05;
    letter-spacing: 0.01em;
    color: ${color.accent};
    text-shadow:
      2.5px 2.5px 0 #fff,
      -2.5px 2.5px 0 #fff,
      2.5px -2.5px 0 #fff,
      -2.5px -2.5px 0 #fff,
      0 2.5px 0 #fff,
      0 -2.5px 0 #fff,
      5px 5px 0 ${color.glow};
  }
  @media ${bp.md} {
    .t-section__en {
      font-size: 2.8rem;
    }
  }
  .t-section__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    font-size: 0.95rem;
    font-weight: 800;
    color: ${color.mintDeep};
    letter-spacing: 0.08em;
  }
  .t-section__title::after {
    content: "";
    width: 46px;
    height: 10px;
    flex: none;
    background: url("data:image/svg+xml,${pulse}") no-repeat center / contain;
  }
  .t-section__title--solo {
    font-size: 1.35rem;
    color: ${color.ink};
  }
  .t-section__title--solo::after {
    display: none;
  }
  .t-section__more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    font-size: 0.85rem;
    white-space: nowrap;
    color: ${color.accentDeep};
    text-decoration: none;
    background: ${color.paper};
    border: 2px solid ${color.line};
    border-radius: 999px;
    padding: 4px 6px 4px 16px;
    box-shadow: 0 3px 0 ${color.border};
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }
  .t-section__more::after {
    content: "→";
    display: inline-grid;
    place-items: center;
    width: 26px;
    height: 20px;
    border-radius: 999px;
    background: ${color.accent};
    color: #fff;
    font-size: 0.8rem;
  }
  .t-section__more:hover {
    color: ${color.accentDeep};
    transform: translateY(-2px);
    box-shadow: 0 5px 0 ${color.border};
  }

  .t-prose {
    max-width: ${layout.measure};
  }
  .t-prose p + p {
    margin-top: 1em;
  }
  .t-prose h2 {
    font-size: 1.35rem;
    padding: 0.35em 0.8em;
    background: ${color.accentPale};
    border-left: 6px solid ${color.accent};
    border-radius: 0 ${radius.sm} ${radius.sm} 0;
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
    border: 2px dashed ${color.borderStrong};
    border-radius: ${radius.md};
    text-align: center;
  }
`
