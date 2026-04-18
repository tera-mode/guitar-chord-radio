# ギターコードラジオ — Claude Code 作業ガイド

## プロジェクト概要

「ギターを構えた30秒後には、もう弾いている」をコンセプトにした個人用Webアプリ。
年代を選ぶとヒット曲がランダム表示され、YouTubeで再生しながらコード譜を確認できる。

詳細要件: [docs/requirements.md](docs/requirements.md)

## 技術スタック

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Firebase Firestore（環境変数未設定時はモックデータで動作）
- YouTube IFrame Player API

## ディレクトリ構成

```
app/
  page.tsx          # トップ画面（年代選択）
  player/
    page.tsx        # プレイヤー画面（Server Component）
    PlayerClient.tsx # プレイヤー画面（Client Component）
components/
  ui/
    ChordDiagram.tsx  # コードダイアグラムSVG
    ChordPopup.tsx    # コードタップでポップアップ
  player/
    YouTubePlayer.tsx # YouTube IFrame埋め込み
    ChordSheet.tsx    # コード譜セクション表示
lib/
  firebase.ts       # Firebase初期化
  firestore.ts      # Firestore CRUD（モックフォールバック付き）
  mockSongs.ts      # 開発用モック曲データ（9曲）
  chordDiagrams.ts  # コードダイアグラムデータ定義
types/
  index.ts          # 型定義（Song, Decade, etc.）
docs/
  requirements.md   # 要件定義書
```

## 開発サーバー

```bash
cd E:\dev\guitar-chord-radio
npm run dev
# http://localhost:3000
```

## 重要な注意事項

### Claude Code ガイドライン
- **管理者への報告は必ず日本語で行う**
- **管理者の許可なくVercelデプロイやgit pushは実行しない**
- 既存機能の変更・削除は必ず確認してから実行
- 問題解決時は関連箇所を全て調べてから対処する

### モックデータについて
- Firebase設定なし（`.env.local`未作成）の場合、`lib/mockSongs.ts` のデータで動作
- YouTubeのIDは `dQw4w9WgXcQ`（仮）になっているため、実際の曲IDに差し替えが必要

### YouTube IDの設定
各曲の `youtubeId` を `lib/mockSongs.ts` で実際のYouTube動画IDに更新する。
YouTube URLの `?v=XXXXX` の部分がID。

### Firebaseの設定（本番用）
1. `.env.local.example` をコピーして `.env.local` を作成
2. Firebaseコンソールからプロジェクト設定を取得して記入
3. Firestoreのコレクション `songs` に曲データを投入

## 現在の実装状況

### 完了
- [x] プロジェクトセットアップ（Next.js + Tailwind + Firebase）
- [x] 型定義 (`types/index.ts`)
- [x] モック曲データ9曲（80s×3, 90s×3, 2000s×3）
- [x] コードダイアグラムSVGコンポーネント（12コード）
- [x] コードタップでポップアップ表示
- [x] YouTube IFrame Player（再生/停止/速度変更）
- [x] トップ画面（年代選択3ボタン）
- [x] プレイヤー画面（2カラムレイアウト）
- [x] お気に入りボタン（ローカルストレージ保存）
- [x] 次の曲ボタン（同年代ランダム）

### 次のステップ
- [ ] 実際のYouTube動画IDに差し替え（mockSongs.tsの youtubeId）
- [ ] 曲データを30曲まで増やす
- [ ] Firebase Firestoreに本番データを移行
- [ ] OGP設定
- [ ] Vercelデプロイ

## 今後のコンテンツ追加方法

`lib/mockSongs.ts` の `mockSongs` 配列に曲を追加する。
セクションラベルの対応：
- `intro` → イントロ
- `verse` → Aメロ
- `verse-b` → Bメロ
- `chorus` → サビ
- `outro` → アウトロ
- `bridge` → ブリッジ
