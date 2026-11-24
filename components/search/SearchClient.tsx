"use client"

import { useEffect, useMemo, useState } from "react"
import { MascotTalk } from "@/components/common/Mascot"
import { excerpt, search } from "@/lib/search"
import type { SearchEntry, SearchKind } from "@/lib/searchIndex"

const kindLabel: Record<SearchKind, string> = {
  character: "キャラクター・設定",
  article: "記事",
  figure: "人物・怪物",
  work: "作品",
  mythology: "神話",
  topic: "テーマ",
}

type Props = { indexUrl: string; basePath: string }

/** 静的な検索インデックス（/search-index.json）を読み込んで検索する */
export const SearchClient = ({ indexUrl, basePath }: Props) => {
  const [entries, setEntries] = useState<SearchEntry[] | null>(null)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState<SearchKind | "all">("all")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // URL のクエリから初期値を復元する（静的ページのためクライアントで読む）
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(params.get("q") ?? "")
    fetch(indexUrl)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json()
      })
      .then(setEntries)
      .catch(() => setError(true))
  }, [indexUrl])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (query) url.searchParams.set("q", query)
    else url.searchParams.delete("q")
    window.history.replaceState(null, "", url)
  }, [query])

  const results = useMemo(
    () => (entries && query.trim() ? search(entries, query) : []),
    [entries, query]
  )
  const visible =
    kind === "all" ? results : results.filter((r) => r.kind === kind)
  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.kind] = (acc[r.kind] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="t-search">
      <form
        className="t-search__form"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="search-q" className="t-visually-hidden">
          検索キーワード
        </label>
        <input
          id="search-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例：キャラクター名、作品名、メデューサ"
          autoComplete="off"
        />
      </form>

      {error && (
        <p className="t-empty">
          検索インデックスを読み込めませんでした。時間をおいて再度お試しください。
        </p>
      )}
      {!entries && !error && <p className="t-meta">読み込み中…</p>}

      {entries && !query.trim() && (
        <div style={{ marginTop: 24 }}>
          <MascotTalk name="ferret-curious" height={96}>
            キャラクター名・作品名・神話の神さまの名前など、
            <br />
            気になることばを入れてみてね。
          </MascotTalk>
        </div>
      )}

      {entries && query.trim() && (
        <>
          <div
            className="t-search__kinds"
            role="group"
            aria-label="種別で絞り込む"
          >
            {(
              [
                "all",
                "character",
                "article",
                "figure",
                "work",
                "mythology",
                "topic",
              ] as const
            ).map((k) => {
              const count = k === "all" ? results.length : (counts[k] ?? 0)
              if (k !== "all" && count === 0) return null
              return (
                <button
                  key={k}
                  type="button"
                  className="t-chip"
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                >
                  {k === "all" ? "すべて" : kindLabel[k]}
                  <small>{count}</small>
                </button>
              )
            })}
          </div>
          <p className="t-meta" aria-live="polite">
            「{query}」の検索結果：{visible.length}件
          </p>
          <ul className="t-search__results">
            {visible.map((r) => {
              const snippet = excerpt(r.body, query)
              return (
                <li key={r.href} className="t-search__item">
                  <span className="t-search__kind">
                    {kindLabel[r.kind]}
                    {r.label &&
                      r.label !== kindLabel[r.kind] &&
                      ` ／ ${r.label}`}
                  </span>
                  <a href={`${basePath}${r.href}`} className="t-search__title">
                    {r.title}
                  </a>
                  <p className="t-search__desc">{snippet ?? r.description}</p>
                </li>
              )
            })}
          </ul>
          {visible.length === 0 && (
            <div className="t-empty">
              <MascotTalk name="ferret-puzzled" height={96} center>
                該当する結果が見つかりませんでした。
                <br />
                別のキーワード（別名・ひらがな表記など）でもお試しください。
              </MascotTalk>
            </div>
          )}
        </>
      )}
    </div>
  )
}
