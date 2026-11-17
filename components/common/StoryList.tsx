import type { Story } from "@/lib/content/schema"
import { getSourcesByIds } from "@/lib/content/repository"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"

const styles = css`
  .t-story-list {
    list-style: none;
    display: grid;
    gap: 16px;
  }
  .t-story {
    border-left: 2px solid ${color.gold};
    padding: 2px 0 2px 16px;
  }
  .t-story__title {
    font-family: ${font.serif};
    font-weight: 600;
    color: ${color.navy};
    font-size: 1.02rem;
  }
  .t-story__summary {
    font-size: 0.9rem;
    line-height: 1.8;
    margin-top: 4px;
  }
  .t-story__src {
    font-size: 0.78rem;
    color: ${color.muted};
    margin-top: 4px;
  }
`

/** 物語（エピソード）の一覧。出典と該当箇所を併記する */
export const StoryList = ({ stories }: { stories: Story[] }) => {
  if (stories.length === 0) return null
  return (
    <>
      <Style id="stories">{styles}</Style>
      <ul className="t-story-list">
        {stories.map((story) => (
          <li key={story.id} className="t-story">
            <h3 className="t-story__title">{story.title}</h3>
            <p className="t-story__summary">{story.summary}</p>
            <p className="t-story__src">
              出典：
              {getSourcesByIds(story.sourceIds)
                .map((s) => `${s.author}『${s.title}』`)
                .join("、")}
              {story.sourceLocation && `（${story.sourceLocation}）`}
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}
