# 学習ログ②（2026-09-27 実行分）

## やったこと

学習①が作った `01_typography.md` / `02_spacing-layout.md` / `03_color-motion.md` /
`_log_01.md` と、`research/data/` の実測データを全て読み、実際の `style.css`（1173行）を
1行ずつ突き合わせて差分を洗い出した。成果物：

- `research/design-system/04_gap-analysis.md`（新規。次のコード改善担当への作業指示書。優先度順）
- `01_typography.md` / `02_spacing-layout.md` / `03_color-motion.md` に、今回見つけた
  抜け・誤りを追記・訂正（各ファイル末尾および該当箇所に「学習②で追加/訂正」として明記）

**`style.css` を含むサイトのコードは1文字も変更していない。** `research/data/` は読むだけで
変更していない。作業ブランチは `auto/2026-09-27` のみ。

## 何を根拠にしたか

- `style.css` の `grep` による全数調査（`font-size` / `padding` / `margin` / `gap` /
  `transition` / 16進カラーなど）を行い、01〜03文書の記述と1件ずつ突き合わせた。
- 疑わしい箇所は `index.html` / `work-detail.html` / `works-data.js` の実際のマークアップと
  データも確認し、CSSの見た目上の不整合が「実装ミス」なのか「データ内容による意図的な差」
  なのかを可能な限り切り分けた（例：`.work-award` の `text-transform: uppercase` の有無は、
  受賞歴データが日本語文字列なので無関係と判断できた）。
- WebSearchは**今回も使っていない**。`research/data/` と `style.css` 自体の実測だけで
  必要な裏付けが揃ったため。

## 見つけた主な差分（優先度順、詳細は `04_gap-analysis.md`）

1. 固定remフォントサイズ（`clamp()` を使わない本文サイズ以下）が11段階に散らばっている。
   01文書は大見出し系の`clamp()`だけを6段階に整理しており、この部分は完全にノーマークだった。
2. `.work-award` と `.detail-award` — コード自身のコメントが「揃える」と明言しているのに
   letter-spacing（0.08em vs 0.06em）・font-size（0.66rem vs 0.78rem）・padding が
   揃っていない。
3. opacityの遷移で `03_color-motion.md` の既定ルール（`var(--ease-out)`を使う）に
   反する箇所が2つ（`.detail-pager-link` / `#splash-screen`）。
4. `02_spacing-layout.md` 自体の「例外は5箇所のみ」という記述が実測不足だった。実際は
   `10px`・`14px`・`18px`・`20px`・`28px`・`36px`・`72px` も4の倍数スケールに乗っていない
   （このセッションで訂正済み）。
5. `.contact-email`（610行目）のclamp外れ値について、学習①では「確認できず」だった点に
   「メールアドレスの折り返し対策では」という仮説を追加した（結論はまだ未確定）。

## 未解決の問い（3本目以降への申し送り）

- **スクリーンショットでの確認が必要な項目が多数残っている。** このクラウド実行環境は
  ブラウザでの実機確認ができないため、`04_gap-analysis.md` で「自信度：中／低・要確認」と
  した項目（固定remの統合先、`28px`系の値を独自トークンにするか統合するか、
  `.detail-award`のサイズ差など）は、実際に画面を見られる人間かローカル環境での
  スクリーンショット取得が必要。
- `.detail-award` のfont-size/paddingがwork-awardと異なる理由（意図的な拡大か、ズレか）は
  実装者本人に聞くのが一番早いかもしれない。
- 学習①からの持ち越し（`unium`のフォント名が空、109ichikiの`--grid-columns`実体、
  Polarisの再取得）はまだ手つかず。今回はstyle.css側の差分出しを優先したため着手していない。
- `04_gap-analysis.md` で「安全に直せる」とした項目（`.detail-award`のletter-spacing、
  opacity遷移2箇所、`.work-award`/`.work-badge`のfont-size、`10px→12px`統一）は、
  コード改善担当が着手する際も変更前後でのスクリーンショット比較を推奨する
  （このセッションでは実施できていないため、実際に見た目が壊れないかは未検証）。
