# ギターコードラジオ

「ギターを構えた30秒後には、もう弾いている」をコンセプトにした個人用Webアプリ。
年代を選ぶとヒット曲がランダム表示され、YouTubeで再生しながらコード譜を確認できる。

## 開発サーバー起動

```bash
npm run dev
# http://localhost:3000
```

## 技術スタック

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Firebase Firestore（環境変数未設定時はモックデータで動作）
- YouTube IFrame Player API
