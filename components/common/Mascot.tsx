import { ReactNode } from "react"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color, radius, shadow } from "@/lib/styles/theme"

/**
 * キャラクターシートから切り出したマスコットのイラスト。
 * 画像はすべて public/images/mascot/ 配下（透過 WebP）。
 */
const mascots = {
  "ferret-front": { w: 252, h: 296, label: "本を抱えたフェレット" },
  "ferret-side": { w: 218, h: 284, label: "横を向いたフェレット" },
  "ferret-run": { w: 260, h: 292, label: "駆けだすフェレット" },
  "ferret-back": { w: 228, h: 276, label: "後ろ姿のフェレット" },
  "ferret-wink": { w: 156, h: 157, label: "ウインクするフェレット" },
  "ferret-curious": { w: 157, h: 168, label: "首をかしげるフェレット" },
  "ferret-puzzled": { w: 145, h: 142, label: "きょとんとするフェレット" },
  "ferret-smile": { w: 155, h: 152, label: "ほほえむフェレット" },
  "ferret-determined": { w: 151, h: 154, label: "きりっとしたフェレット" },
  "ferret-sleepy": { w: 148, h: 146, label: "眠そうなフェレット" },
  owl: { w: 209, h: 268, label: "フクロウの博士" },
  cat: { w: 219, h: 276, label: "ねこの案内人" },
  mouse: { w: 166, h: 214, label: "ねずみの地図屋" },
} as const

export type MascotName = keyof typeof mascots

/** 高さを基準に表示する（装飾扱いのため既定で alt は空） */
export const Mascot = ({
  name,
  height = 96,
  className,
  alt = "",
}: {
  name: MascotName
  height?: number
  className?: string
  alt?: string
}) => {
  const m = mascots[name]
  return (
    <img
      className={className ? `t-mascot ${className}` : "t-mascot"}
      src={assetPath(`/images/mascot/${name}.webp`)}
      width={Math.round((m.w / m.h) * height)}
      height={height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      loading="lazy"
      decoding="async"
    />
  )
}

export const mascotLabel = (name: MascotName) => mascots[name].label

const talkStyles = css`
  .t-talk {
    display: flex;
    align-items: flex-end;
    gap: 14px;
  }
  .t-talk--center {
    justify-content: center;
  }
  .t-talk .t-mascot {
    flex: none;
    height: auto;
  }
  .t-talk__bubble {
    position: relative;
    padding: 12px 18px;
    background: ${color.paper};
    border: 2px solid ${color.line};
    border-radius: ${radius.md};
    box-shadow: ${shadow.sm};
    font-weight: 700;
    font-size: 0.92rem;
    line-height: 1.7;
    color: ${color.ink};
    text-align: left;
    margin-bottom: 18px;
  }
  .t-talk__bubble::before {
    content: "";
    position: absolute;
    left: -10px;
    bottom: 14px;
    width: 14px;
    height: 14px;
    background: ${color.paper};
    border-left: 2px solid ${color.line};
    border-bottom: 2px solid ${color.line};
    transform: rotate(45deg);
  }
`

/** マスコットがふきだしで話しかける */
export const MascotTalk = ({
  name,
  height = 96,
  center = false,
  children,
}: {
  name: MascotName
  height?: number
  center?: boolean
  children: ReactNode
}) => (
  <div className={`t-talk${center ? " t-talk--center" : ""}`}>
    <Style id="mascot-talk">{talkStyles}</Style>
    <Mascot name={name} height={height} />
    <div className="t-talk__bubble">{children}</div>
  </div>
)
