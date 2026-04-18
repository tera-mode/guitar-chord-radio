# あの頃チャンネル — 機能追加指示書

## 概要

以下4つの機能追加・改修を行ってください。

1. 各年代の曲データを30曲ずつに増やす
2. リピート / 連続再生 / オフ の再生モード切替を追加
3. お気に入り曲だけを再生する「お気に入りライブラリ」機能を追加
4. モバイルのファーストビューに「動画 / 使用コード / コード進行」が収まるよう改修

## 全体ルール

- 報告は**必ず日本語**で行うこと
- 管理者の許可なく `git push` / Vercelデプロイは実行しないこと
- 既存機能の挙動を変える/壊す変更は事前に確認すること
- 1要件ずつ着手し、各要件完了ごとに動作確認の報告を出すこと
- 既存のディレクトリ構成・命名規則・スタイル方針(Tailwind, amber系カラー)を踏襲すること

---

## 要件1: 曲データ拡充(各年代30曲)

### 現状
- `lib/mockSongs.ts` に 80s×3 / 90s×3 / 2000s×3 = 計9曲
- 各曲の `youtubeId` はプレースホルダー `dQw4w9WgXcQ`(`lib/youtubeSearch.ts` がAPI検索で解決する仕組みあり)

### 目標
- 80年代: 30曲
- 90年代: 30曲
- 2000年代: 30曲
- 合計: 90曲

### 選曲方針
- コード進行がシンプル(5〜7種以内)、弾き語りしやすい曲を優先
- YouTubeに公式MV/公式オーディオがある曲を選ぶ
- 各年代でアーティストが偏らないよう分散させる
- 参考アーティスト例:
  - 80年代: 尾崎豊 / BOØWY / サザン / チェッカーズ / 米米CLUB / 安全地帯 / TM NETWORK / 浜田省吾 / 長渕剛 / 中島みゆき など
  - 90年代: スピッツ / Mr.Children / GLAY / L'Arc〜en〜Ciel / B'z / ZARD / X JAPAN / 槇原敬之 / 福山雅治 / Every Little Thing など
  - 2000年代: BUMP OF CHICKEN / レミオロメン / MONGOL800 / コブクロ / ゆず / いきものがかり / RADWIMPS / ASIAN KUNG-FU GENERATION / aiko / 19 など

### 実装ルール

**コード制約(重要)**
- `components/ui/ChordDiagram.tsx` の `DIAGRAMS` に定義済みのコードのみ使用すること
- 現在対応: `C / D / E / Em / F / G / A / Am / Dm / Bm / B / C#m`
- 上記以外を使う曲を入れたい場合は、**先に `ChordDiagram.tsx` の `DIAGRAMS` と `lib/chordDiagrams.ts` の両方にダイアグラム定義を追加**してから曲データを追加すること
- 追加が望ましい代表的なコード: `D7 / G7 / C7 / E7 / A7 / B7 / Em7 / Am7 / Dm7 / F#m / G#m / D#m / Fmaj7 / Cmaj7 / Dsus4 / Asus4 / Esus4`
- 必要に応じて簡易転調(カポ使用)で対応コードに収める判断もOK。その場合 `capo` フィールドを正しく設定する

**データフォーマット**
- 既存の `Song` 型(`types/index.ts`)に厳密に従うこと
- `id` は `song_010` から連番で振ること
- `sections.label` は以下の日本語ラベルに統一: `イントロ / Aメロ / Bメロ / サビ / アウトロ / ブリッジ`
- `youtubeId` は実IDが分からない曲はプレースホルダー `dQw4w9WgXcQ` のまま入れて構わない(API検索で解決される)
- ただし**実IDが既知の有名曲は実IDを入れる**こと(API消費を抑えるため)
- `difficulty` はコード数とバレーコード有無で判定: 5種以内+バレーなし=easy / 6〜7種=medium / それ以上=hard

**ファイル分割**
- `lib/mockSongs.ts` が肥大化するため、以下に分割すること:
  - `lib/songs/songs80s.ts`
  - `lib/songs/songs90s.ts`
  - `lib/songs/songs2000s.ts`
  - `lib/songs/index.ts` (3ファイルをまとめてexport + `getSongsByDecade` / `getRandomSongByDecade` / `getSongsByIds` を提供)
- `lib/mockSongs.ts` は `lib/songs/index.ts` への再エクスポートに置き換え(既存importを壊さないため)

---

## 要件2: 再生モード切替

### 仕様
3つのモードを切り替えられるようにする。

| モード | 動作 |
|---|---|
| `repeat-one` | 曲が終わったら同じ曲を最初から再生 |
| `autoplay` | 曲が終わったら次のランダム曲に進む(現状の挙動) |
| `off` | 曲が終わっても何もしない(停止) |

### UI
- フッター(「次の曲」ボタンの左隣)にモード切替ボタンを配置
- タップするたびに `off` → `autoplay` → `repeat-one` → `off` ... と循環
- アイコン例: `off` = ⏹ / `autoplay` = ⏭ / `repeat-one` = 🔂
- ボタン下にモード名のラベルを小さく表示してもよい

### 実装

**状態管理**
- `app/player/PlayerClient.tsx` に `playMode` 状態を追加
- 型は `types/index.ts` に追加: `export type PlayMode = 'off' | 'autoplay' | 'repeat-one'`
- 初期値は `autoplay`(現状の挙動を維持)
- localStorageキー `anokoro-play-mode` で永続化

**動作変更**
- 現状 `YouTubePlayer` の `onEnded` に `nextSong` をそのまま渡しているのを以下に変更:
  ```
  onEnded={() => {
    if (playMode === 'autoplay') nextSong()
    else if (playMode === 'repeat-one') replayCurrent()
    // 'off' の場合は何もしない
  }}
  ```
- `replayCurrent` を実現するため、`YouTubePlayer` に ref を介した `replay()` メソッドを公開、または `onEnded` 経由で `playerRef.current.seekTo(0)` + `playVideo()` を呼ぶ仕組みを実装

**注意事項**
- モード変更ボタンは曲再生中でも切替可能にすること
- `repeat-one` でも「次の曲」ボタンを押せば次曲に進む(モードはそのまま維持)

---

## 要件3: お気に入りライブラリ機能

### 仕様
お気に入りに登録した曲だけを対象にプレイヤーを起動できるようにする。

### UI設計

**トップ画面(`app/page.tsx`)の変更**
- 既存の年代3つの下に4つ目のカード「お気に入り」を追加
- アイコン: ❤️
- サブテキスト: 「保存した曲を聴く」
- 背景色: 既存の年代カードと違う色(例: `from-pink-400 to-rose-500`)
- お気に入りが0件の時もカード自体は表示し、タップ時に「まだお気に入りがありません」と表示するか、トップに戻すかを選択

### 実装

**ルーティング**
- 既存の `/player?decade=80s` の枠組みを活かして `/player?source=favorites` を追加
- または `decade` パラメータを `Source` 型に拡張: `type Source = Decade | 'favorites'`
- 推奨は後者(既存コードの差分が少ない)

**型定義**
- `types/index.ts` に追加: `export type Source = Decade | 'favorites'`

**`app/player/page.tsx`**
- `source` クエリを判定し、`favorites` ならお気に入り曲リストを取得
- ただし**お気に入りはlocalStorage管理なのでサーバーコンポーネントでは取得できない**
- 解決策: `source=favorites` の場合は `initialSong` を渡さず、PlayerClient側でlocalStorageから読み込んで初期表示する
- 該当ロジックを `PlayerClient` に移管するか、`PlayerClient` を「ソース指定可能」な汎用形に拡張する

**`app/player/PlayerClient.tsx`**
- props を `{ source: Source, initialSong?: Song }` に拡張
- `source === 'favorites'` の場合:
  - localStorageから `anokoro-favorites`(曲IDリスト)を読み取り
  - `lib/songs/index.ts` の `getSongsByIds(ids)` で対象曲を取得
  - その中からランダムで初期曲をセット
  - 0件なら「お気に入りに曲を追加してください」というUIを表示し、年代選択に戻るボタンを置く
- `nextSong` の選曲対象も `source` に応じて切り替え

**ChordSheet表示時の挙動**
- お気に入りモードで再生中の曲を「お気に入り解除」した場合の動作:
  - 即座に再生対象から外れると曲リストが減って混乱するので、**現曲はそのまま流し、次曲遷移時から除外**する仕様にする

**ヘッダー表示**
- 現状ヘッダーに「🎸 80年代」と表示している箇所を、お気に入りモード時は「❤️ お気に入り」と表示

---

## 要件4: モバイルファーストビューの改善

### 現状の問題
スマホ表示のファーストビュー(画面初期表示領域)に以下しか見えていない:
- 動画領域
- 曲タイトル領域
- 使用コード一覧領域

「コード進行(イントロ/Aメロ/サビ等)」が見えるまでスクロールが必要。

### 目標
ファーストビューに以下を**全部**収める:
- 動画領域
- 使用コード一覧
- コード進行(最低1セクション、できればAメロかサビが見える)

※ 曲タイトル/アーティスト名はファーストビューから外してOK(下にスクロールでも見られる、またはコンパクトなヘッダーに統合する)

### 改修方針

**動画領域の縮小**
- 現在は `aspect-video`(16:9) でフル幅 → スマホ縦画面では高さを取りすぎ
- モバイルのみ `max-h-[32vh]` 程度に制限する(`md:` 以上では現状維持)
- iframe側のレスポンシブ対応: コンテナを `aspect-video` ではなく明示的な `h-` で制御し、`max-w-` で幅を絞る方式に変更

**曲情報ヘッダーのコンパクト化**
- 現在: タイトル(text-xl) / アーティスト+年(text-sm) / カポ・難易度バッジ / お気に入りボタン
- モバイルでは:
  - タイトル + アーティストを1行に圧縮(タイトルbold + ・区切り)
  - 難易度バッジは省略 or 小さくする
  - カポは数字のみ(「カポ2」→「♪2」等)
  - お気に入りはアイコンのみ(ラベル「お気に入り」テキストは削除)
- PCレイアウト(`lg:`以上)では現状維持

**使用コード一覧の縮小**
- `compact` のChordDiagramをさらに一回り小さくする(縦60px → 50px程度)
- またはモバイルだけさらに小さい `extra-compact` サイズを追加

**速度コントロールの位置調整**
- 現在YouTubePlayerの下に独立配置 → モバイルでは動画の右側 or 圧縮ヘッダーに統合できないか検討
- 最低限フォントサイズと余白を詰める

**フッターの再考**
- 現状: 「次の曲」ボタン+(要件2追加後の)モード切替ボタン
- モバイルではフッターも高さを取るので、`py-3` → `py-2` 程度に圧縮

### 確認方法
- iPhone SE(375×667)、iPhone 14(390×844)、Pixel 7(412×915)の縦向きで確認
- 動画 / 使用コード / コード進行(少なくともイントロ部分)が**スクロールなしで全部見える**こと
- PCレイアウト(`lg:`以上)で見た目が崩れていないこと

---

## 実装順序の推奨

依存関係を考慮し、以下の順で進めること。

1. **要件4(モバイルレイアウト改善)** — 既存挙動を変えるリスクが低く、他要件と独立
2. **要件2(再生モード切替)** — UIが安定した状態で追加した方がデザインしやすい
3. **要件3(お気に入りライブラリ)** — 型・ルーティング拡張が必要、既存挙動への影響あり
4. **要件1(曲データ30曲ずつ)** — 上記3つで動作確認できる土台ができてから一気にデータ追加

各要件完了時に以下を報告すること:
- 変更したファイル一覧
- 動作確認した内容(モバイル/PC両方)
- 既存機能への影響有無

---

## 補足: 影響範囲チェックリスト

各要件着手前に以下を確認し、既存機能を壊さないよう注意すること。

| 観点 | 該当ファイル |
|---|---|
| 型定義 | `types/index.ts` |
| 曲データ取得 | `lib/mockSongs.ts` / `lib/firestore.ts` |
| YouTube動画ID解決 | `lib/youtubeSearch.ts` / `app/api/youtube-search/route.ts` |
| プレイヤーロジック | `app/player/page.tsx` / `app/player/PlayerClient.tsx` |
| YouTube再生制御 | `components/player/YouTubePlayer.tsx` |
| コード譜表示 | `components/player/ChordSheet.tsx` |
| コードダイアグラム | `components/ui/ChordDiagram.tsx` / `components/ui/ChordPopup.tsx` |
| トップ画面 | `app/page.tsx` |

`lib/firestore.ts` がモック / Firebase本番を切り替える仕組みになっているため、データ構造を変える際は両側の整合性に注意すること。