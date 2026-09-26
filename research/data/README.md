# 調査の素材データ（2026-09-27 未明にローカルで取得）

クラウド実行環境は外部サイトへアクセスできない（許可リスト方式で `google.com` すら拒否される）。
そのため**ネットから取ってくる作業はローカルのMacで行い、抽出した結果をここに置いた**。
夜間の学習エージェントは、ここのデータを読んで作業すること。新たに外部サイトを取りに行こうとしないこと。

## reference-sites.json

CEOが「見ていて・触っていて楽しかった」と挙げた6サイトのCSSを実際にダウンロードし、
正規表現で機械的に集計した数値。**推測は一切含まない。**

- 109ichiki.com / ds-k.site / unium.jp / arkreis.jp / komeinc.com / zeroten.jp
- 項目: font-family / @font-face / font-weight / font-size（clamp含む）/ line-height /
  letter-spacing / 16進カラー / cubic-bezier / ブレークポイント / grid-template-columns /
  padding・marginのpx値
- 数値の後ろの数はCSS内での出現回数。頻度が高いほどそのサイトの基調と考えてよい。

## design-systems/*.txt

公開されているデザインシステムのドキュメントページから本文テキストを抽出したもの。

- `ant.txt` … Ant Design のフォント規定
- `carbon.txt` … IBM Carbon タイポグラフィ
- `carbon_space.txt` … IBM Carbon スペーシング
- `digitalgo.txt` … デジタル庁デザインシステム タイポグラフィ
- `polaris.txt` … Shopify Polaris タイポグラフィ

Material Design 3 / Adobe Spectrum / Atlassian はJavaScriptで描画されるため本文が取得できなかった。
取得を試みた記録として残すが、データは無い。
