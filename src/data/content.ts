import { Content, YouTubeVideo, TwitterPost } from '@/types';
import { mockCreators, mockFollowedCreators } from './creators';

export const mockContents: Content[] = [
  // Ado 콘텐츠 (8개)
  {
    id: '1',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【歌ってみた】新曲カバー / Ado',
    description: '今回は皆さんからリクエストの多かった楽曲をカバーさせていただきました！楽しんでいただけると嬉しいです♪',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example1',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    viewCount: 520000,
    likeCount: 45000,
    commentCount: 3200,
    duration: '15:23',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['歌ってみた', 'cover', 'Ado'],
      category: 'Music',
      language: 'ja',
    },
  },
  {
    id: '2',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【MV】新曲「夜想曲」/ Ado',
    description: '新曲「夜想曲」のミュージックビデオです。作詞作曲：〇〇さん、イラスト：△△さん',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example2',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 1200000,
    likeCount: 89000,
    commentCount: 5600,
    duration: '4:32',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['MV', 'オリジナル曲', 'Ado'],
      category: 'Music',
      language: 'ja',
    },
  },
  {
    id: '3',
    creator: mockCreators[0], // Ado
    platform: 'twitter',
    title: '今日はレコーディングでした！新しい曲もうすぐ完成します🎵楽しみにしていてください✨',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/ado1024imokenp/status/example1',
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    viewCount: 0,
    likeCount: 5800,
    commentCount: 234,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: [],
      mentions: [],
    },
  },
  {
    id: '4',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【ライブ】今夜21時から歌配信！',
    description: 'みなさんこんばんは！今夜はリクエスト曲を歌います～',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example3',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
    viewCount: 45000,
    likeCount: 8900,
    commentCount: 1200,
    duration: '2:15:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['ライブ配信', '歌配信', 'Ado'],
      category: 'Music',
      language: 'ja',
      isLive: true,
    },
  },
  {
    id: '5',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【Shorts】30秒で分かるボイトレ',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example1',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    viewCount: 850000,
    likeCount: 35000,
    commentCount: 890,
    duration: '0:32',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'ボイトレ', 'tutorial'],
      category: 'Education',
      language: 'ja',
      isShorts: true,
    },
  },
  {
    id: '6',
    creator: mockCreators[0], // Ado
    platform: 'twitter',
    title: 'ありがとうございます！😊\n皆さんの応援が本当に嬉しいです💖\n次回作も頑張ります！',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/ado1024imokenp/status/example2',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
    viewCount: 0,
    likeCount: 12500,
    commentCount: 892,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: [],
      mentions: [],
    },
  },
  {
    id: '7',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【コラボ】他のアーティストと一緒に歌ってみた！',
    description: '今回は特別コラボ企画！素敵なアーティストの皆さんと一緒に歌わせていただきました',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example4',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 2300000,
    likeCount: 180000,
    commentCount: 12000,
    duration: '6:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['コラボ', '歌ってみた', 'special'],
      category: 'Music',
      language: 'ja',
    },
  },
  {
    id: '8',
    creator: mockCreators[0], // Ado
    platform: 'twitter',
    title: '新しいMV撮影中です📹✨\n今回のテーマは「夢」です！お楽しみに〜',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    url: 'https://twitter.com/ado1024imokenp/status/example3',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
    viewCount: 0,
    likeCount: 9500,
    commentCount: 456,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['MV撮影', '夢'],
      mentions: [],
    },
  },

  // 히카킨 콘텐츠 (10개)
  {
    id: '9',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【検証】1000万円の○○買ってみた！',
    description: 'みなさんこんにちは！ヒカキンです！今回はなんと1000万円もする超高級○○を買ってみました！果たしてその価値はあるのか...!?',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example5',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    viewCount: 1200000,
    likeCount: 89000,
    commentCount: 12000,
    duration: '8:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['ヒカキン', '検証', '高級'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  {
    id: '10',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【開封】視聴者プレゼント開封！感動の連続...',
    description: '今回は視聴者の皆さんからいただいたプレゼントを開封していきます！本当にありがとうございます😭',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example6',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 980000,
    likeCount: 67000,
    commentCount: 8900,
    duration: '12:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['ヒカキン', 'プレゼント開封', '感謝'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  {
    id: '11',
    creator: mockCreators[1], // 히카킨
    platform: 'twitter',
    title: '今日も撮影頑張りました！\n明日の動画お楽しみに〜😊\n#ヒカキン #YouTube',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/hikakin/status/example4',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
    viewCount: 0,
    likeCount: 8900,
    commentCount: 567,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['ヒカキン', 'YouTube'],
      mentions: [],
    },
  },
  {
    id: '12',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【Shorts】今日の一言！',
    description: '今日の気分です！',
    thumbnail: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example2',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
    viewCount: 450000,
    likeCount: 28000,
    commentCount: 1200,
    duration: '0:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'daily', 'ヒカキン'],
      category: 'Entertainment',
      language: 'ja',
      isShorts: true,
    },
  },
  {
    id: '13',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【料理】初心者でも作れる簡単レシピ！',
    description: 'ヒカキンが料理に挑戦！果たして美味しく作れるのか...？',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example7',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 1800000,
    likeCount: 95000,
    commentCount: 15000,
    duration: '16:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['料理', 'レシピ', 'ヒカキン'],
      category: 'Lifestyle',
      language: 'ja',
    },
  },
  {
    id: '14',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【企画】24時間○○してみた！',
    description: '今回はチャレンジ企画！24時間○○し続けることができるのか！？',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example8',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    viewCount: 2500000,
    likeCount: 150000,
    commentCount: 20000,
    duration: '18:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['24時間企画', 'challenge', 'ヒカキン'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  {
    id: '15',
    creator: mockCreators[1], // 히카킨
    platform: 'twitter',
    title: '新しい企画を考え中です！\n皆さんのアイデアもお待ちしています💡',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/hikakin/status/example5',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
    viewCount: 0,
    likeCount: 6700,
    commentCount: 890,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['企画募集'],
      mentions: [],
    },
  },
  {
    id: '16',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【コラボ】人気YouTuberと一緒に動画作ってみた！',
    description: '今回は特別コラボ企画！面白い動画になりました〜',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example9',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    viewCount: 3200000,
    likeCount: 230000,
    commentCount: 35000,
    duration: '20:12',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['コラボ', 'YouTuber', 'special'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  {
    id: '17',
    creator: mockCreators[1], // 히카킨
    platform: 'twitter',
    title: '今日の撮影で面白いハプニングがありました😂\n動画でお見せできるかな？',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/hikakin/status/example6',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18시간 전
    viewCount: 0,
    likeCount: 4500,
    commentCount: 230,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['撮影'],
      mentions: [],
    },
  },
  {
    id: '18',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【Q&A】皆さんからの質問に答えます！',
    description: 'コメントでいただいた質問にお答えします！',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example10',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
    viewCount: 890000,
    likeCount: 54000,
    commentCount: 8900,
    duration: '14:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Q&A', '質問回答', 'ヒカキン'],
      category: 'Entertainment',
      language: 'ja',
    },
  },

  // 葛葉 콘텐츠 (8개)
  {
    id: '19',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【APEX】ランク上げ配信！マスター目指します',
    description: 'おつかれさまです！今日もAPEXランク配信やっていきます〜目標はマスターです！',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example11',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
    viewCount: 450000,
    likeCount: 23000,
    commentCount: 5600,
    duration: '3:45:12',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['APEX', 'ゲーム実況', '葛葉'],
      category: 'Gaming',
      language: 'ja',
      isLive: false,
    },
  },
  {
    id: '20',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【雑談】最近あったことを話す枠',
    description: '今日は雑談します！最近面白かったことなど',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example12',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 280000,
    likeCount: 18000,
    commentCount: 3400,
    duration: '1:23:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['雑談', 'talk', '葛葉'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  {
    id: '21',
    creator: mockCreators[2], // 葛葉
    platform: 'twitter',
    title: '今日のAPEX配信お疲れ様でした！\nマスターまであと少し！明日も頑張ります💪',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/Kuzuha_Channel/status/example7',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7시간 전
    viewCount: 0,
    likeCount: 3200,
    commentCount: 156,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['APEX', 'マスター'],
      mentions: [],
    },
  },
  {
    id: '22',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【Minecraft】建築企画始動！',
    description: 'マイクラで大きな建物を作ります！設計図も用意しました',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example13',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 650000,
    likeCount: 35000,
    commentCount: 4500,
    duration: '2:15:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Minecraft', '建築', 'ゲーム実況'],
      category: 'Gaming',
      language: 'ja',
    },
  },
  {
    id: '23',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【ホラーゲーム】夜中に一人でプレイ...',
    description: '怖いけど頑張ります！皆さんも一緒に見てください',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example14',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 890000,
    likeCount: 45000,
    commentCount: 8900,
    duration: '1:45:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['ホラーゲーム', 'horror', 'ゲーム実況'],
      category: 'Gaming',
      language: 'ja',
    },
  },
  {
    id: '24',
    creator: mockCreators[2], // 葛葉
    platform: 'twitter',
    title: 'ホラーゲーム配信、めちゃくちゃ怖かった😱\n皆さんのコメントに助けられました...',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/Kuzuha_Channel/status/example8',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    viewCount: 0,
    likeCount: 2800,
    commentCount: 234,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['ホラーゲーム'],
      mentions: [],
    },
  },
  {
    id: '25',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【コラボ配信】他のVTuberと一緒にゲーム！',
    description: 'にじさんじのメンバーと一緒にゲームします！',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example15',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    viewCount: 1200000,
    likeCount: 78000,
    commentCount: 12000,
    duration: '2:30:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['コラボ', 'VTuber', 'にじさんじ'],
      category: 'Gaming',
      language: 'ja',
    },
  },
  {
    id: '26',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【Shorts】今日のひとこと',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1614332625960-c8ba226b4722?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example3',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10시간 전
    viewCount: 320000,
    likeCount: 18000,
    commentCount: 890,
    duration: '0:25',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'daily', '葛葉'],
      category: 'Entertainment',
      language: 'ja',
      isShorts: true,
    },
  },

  // MrBeast 콘텐츠 (8개)
  {
    id: '27',
    creator: mockCreators[3], // MrBeast
    platform: 'youtube',
    title: 'I Gave Away $1,000,000 To Random People',
    description: 'Today I surprised random people by giving them $1,000,000! Their reactions were incredible!',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example16',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
    viewCount: 15000000,
    likeCount: 1200000,
    commentCount: 85000,
    duration: '12:34',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['MrBeast', 'giveaway', 'charity'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '28',
    creator: mockCreators[3], // MrBeast
    platform: 'youtube',
    title: 'Last To Leave Circle Wins $500,000',
    description: 'The ultimate endurance challenge! Who will last the longest?',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example17',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 28000000,
    likeCount: 2100000,
    commentCount: 120000,
    duration: '15:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['challenge', 'competition', 'MrBeast'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '29',
    creator: mockCreators[3], // MrBeast
    platform: 'twitter',
    title: 'New video dropping in 1 hour! This one is INSANE 🤯',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/MrBeast/status/example9',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7시간 전
    viewCount: 0,
    likeCount: 45000,
    commentCount: 3200,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['NewVideo'],
      mentions: [],
    },
  },
  {
    id: '30',
    creator: mockCreators[3], // MrBeast
    platform: 'youtube',
    title: '100 Days In Nuclear Bunker',
    description: 'I spent 100 days in a nuclear bunker and this is what happened...',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example18',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 45000000,
    likeCount: 3200000,
    commentCount: 180000,
    duration: '18:23',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['100 days', 'survival', 'extreme'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '31',
    creator: mockCreators[3], // MrBeast
    platform: 'youtube',
    title: 'I Built 100 Houses And Gave Them Away',
    description: 'Building and giving away 100 houses to families in need!',
    thumbnail: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example19',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    viewCount: 52000000,
    likeCount: 4100000,
    commentCount: 220000,
    duration: '16:52',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['charity', 'building', 'philanthropy'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '32',
    creator: mockCreators[3], // MrBeast
    platform: 'twitter',
    title: 'Just finished filming the craziest video ever. You guys are not ready for this one! 🔥',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/MrBeast/status/example10',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 0,
    likeCount: 67000,
    commentCount: 5600,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['FilmingComplete'],
      mentions: [],
    },
  },
  {
    id: '33',
    creator: mockCreators[3], // MrBeast
    platform: 'youtube',
    title: 'Shorts: 1 vs 1,000,000',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example4',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9시간 전
    viewCount: 8500000,
    likeCount: 450000,
    commentCount: 12000,
    duration: '0:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'challenge', 'viral'],
      category: 'Entertainment',
      language: 'en',
      isShorts: true,
    },
  },
  {
    id: '34',
    creator: mockCreators[3], // MrBeast
    platform: 'youtube',
    title: 'World\'s Largest Hide And Seek',
    description: 'Hide and seek in the world\'s largest mall with $100,000 prize!',
    thumbnail: 'https://images.unsplash.com/photo-1555529669-2269763671c0?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example20',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
    viewCount: 38000000,
    likeCount: 2800000,
    commentCount: 150000,
    duration: '14:28',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['hide and seek', 'mall', 'competition'],
      category: 'Entertainment',
      language: 'en',
    },
  },

  // PewDiePie 콘텐츠 (6개)
  {
    id: '35',
    creator: mockCreators[4], // PewDiePie
    platform: 'youtube',
    title: 'This Game Made Me Cry...',
    description: 'Playing an emotional indie game that actually made me cry...',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example21',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
    viewCount: 3400000,
    likeCount: 280000,
    commentCount: 18000,
    duration: '25:12',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['gaming', 'indie game', 'emotional'],
      category: 'Gaming',
      language: 'en',
    },
  },
  {
    id: '36',
    creator: mockCreators[4], // PewDiePie
    platform: 'youtube',
    title: 'Reacting to Cursed Comments',
    description: 'Looking at the weirdest comments from the internet...',
    thumbnail: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example22',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 4200000,
    likeCount: 350000,
    commentCount: 25000,
    duration: '18:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['reaction', 'memes', 'funny'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '37',
    creator: mockCreators[4], // PewDiePie
    platform: 'twitter',
    title: 'Just finished editing. This video is gonna be good bros 👊',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/pewdiepie/status/example11',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
    viewCount: 0,
    likeCount: 23000,
    commentCount: 1200,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['editing'],
      mentions: [],
    },
  },
  {
    id: '38',
    creator: mockCreators[4], // PewDiePie
    platform: 'youtube',
    title: 'Minecraft: Building the Ultimate Base',
    description: 'Building the most epic base in Minecraft!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example23',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    viewCount: 5600000,
    likeCount: 450000,
    commentCount: 32000,
    duration: '22:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Minecraft', 'building', 'gaming'],
      category: 'Gaming',
      language: 'en',
    },
  },
  {
    id: '39',
    creator: mockCreators[4], // PewDiePie
    platform: 'youtube',
    title: 'Philosophy with PewDiePie',
    description: 'Deep thoughts and philosophical discussions...',
    thumbnail: 'https://images.unsplash.com/photo-1559027260-dc66d52bef19?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example24',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
    viewCount: 2800000,
    likeCount: 230000,
    commentCount: 15000,
    duration: '16:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['philosophy', 'discussion', 'deep'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '40',
    creator: mockCreators[4], // PewDiePie
    platform: 'youtube',
    title: 'Shorts: Epic Fail Compilation',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1614332625960-c8ba226b4722?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example5',
    publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(), // 15시간 전
    viewCount: 1200000,
    likeCount: 85000,
    commentCount: 3200,
    duration: '0:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'fail', 'funny'],
      category: 'Entertainment',
      language: 'en',
      isShorts: true,
    },
  },

  // Marques Brownlee (MKBHD) 콘텐츠 (8개)
  {
    id: '41',
    creator: mockCreators[5], // Marques
    platform: 'youtube',
    title: 'iPhone 16 Pro Review: The Complete Truth',
    description: 'After 3 weeks with the iPhone 16 Pro, here\'s everything you need to know...',
    thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example25',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    viewCount: 1800000,
    likeCount: 145000,
    commentCount: 8900,
    duration: '12:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['iPhone', 'review', 'tech'],
      category: 'Tech',
      language: 'en',
    },
  },
  {
    id: '42',
    creator: mockCreators[5], // Marques
    platform: 'youtube',
    title: 'Tesla Model Y 2025: First Drive',
    description: 'Taking the updated Tesla Model Y for its first drive!',
    thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example26',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 2400000,
    likeCount: 190000,
    commentCount: 12000,
    duration: '15:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Tesla', 'EV', 'car review'],
      category: 'Tech',
      language: 'en',
    },
  },
  {
    id: '43',
    creator: mockCreators[5], // Marques
    platform: 'twitter',
    title: 'The new MacBook Pro M4 benchmarks are... interesting 🤔',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/MKBHD/status/example12',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
    viewCount: 0,
    likeCount: 12000,
    commentCount: 890,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['MacBook', 'M4'],
      mentions: [],
    },
  },
  {
    id: '44',
    creator: mockCreators[5], // Marques
    platform: 'youtube',
    title: 'The Future of Smartphones in 2025',
    description: 'Predicting the biggest smartphone trends for this year...',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example27',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 3200000,
    likeCount: 280000,
    commentCount: 18000,
    duration: '18:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['smartphones', 'future', 'predictions'],
      category: 'Tech',
      language: 'en',
    },
  },
  {
    id: '45',
    creator: mockCreators[5], // Marques
    platform: 'youtube',
    title: 'Shorts: Quick Tech Tip',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1484863137639-abc9fe9734ad?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example6',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
    viewCount: 890000,
    likeCount: 45000,
    commentCount: 2100,
    duration: '0:35',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'tech tip', 'tutorial'],
      category: 'Tech',
      language: 'en',
      isShorts: true,
    },
  },
  {
    id: '46',
    creator: mockCreators[5], // Marques
    platform: 'youtube',
    title: 'Best Budget Tech of 2025',
    description: 'The best tech you can buy without breaking the bank!',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example28',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    viewCount: 1600000,
    likeCount: 125000,
    commentCount: 7800,
    duration: '14:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['budget tech', 'recommendations', 'value'],
      category: 'Tech',
      language: 'en',
    },
  },
  {
    id: '47',
    creator: mockCreators[5], // Marques
    platform: 'twitter',
    title: 'Just wrapped up testing the new Galaxy S25. Video coming soon! 📱',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/MKBHD/status/example13',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    viewCount: 0,
    likeCount: 18000,
    commentCount: 1500,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['GalaxyS25', 'Review'],
      mentions: [],
    },
  },
  {
    id: '48',
    creator: mockCreators[5], // Marques
    platform: 'youtube',
    title: 'Why I Switched Back to Android',
    description: 'After using iPhone for a year, here\'s why I switched back...',
    thumbnail: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example29',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
    viewCount: 4100000,
    likeCount: 320000,
    commentCount: 28000,
    duration: '16:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Android', 'iPhone', 'comparison'],
      category: 'Tech',
      language: 'en',
    },
  },

  // Emma Chamberlain 콘텐츠 (6개)
  {
    id: '49',
    creator: mockCreators[6], // Emma
    platform: 'youtube',
    title: 'My Morning Routine (but make it chaotic)',
    description: 'Trying to have a productive morning routine but failing miserably...',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example30',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9시간 전
    viewCount: 890000,
    likeCount: 78000,
    commentCount: 4500,
    duration: '11:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['morning routine', 'lifestyle', 'vlog'],
      category: 'Lifestyle',
      language: 'en',
    },
  },
  {
    id: '50',
    creator: mockCreators[6], // Emma
    platform: 'youtube',
    title: 'Trying Pinterest DIY Room Decor',
    description: 'Testing viral Pinterest room decor ideas... some worked, some didn\'t',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example31',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 1200000,
    likeCount: 95000,
    commentCount: 6700,
    duration: '15:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['DIY', 'room decor', 'Pinterest'],
      category: 'Lifestyle',
      language: 'en',
    },
  },
  {
    id: '51',
    creator: mockCreators[6], // Emma
    platform: 'twitter',
    title: 'currently drinking my 4th coffee of the day and it\'s only 2pm... oops ☕️',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/emmachamberlain/status/example14',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
    viewCount: 0,
    likeCount: 8900,
    commentCount: 456,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['coffee'],
      mentions: [],
    },
  },
  {
    id: '52',
    creator: mockCreators[6], // Emma
    platform: 'youtube',
    title: 'What I Eat in a Day (realistic version)',
    description: 'Showing you what I actually eat in a day, not the perfect Instagram version',
    thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example32',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    viewCount: 1500000,
    likeCount: 120000,
    commentCount: 8900,
    duration: '12:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['what I eat', 'lifestyle', 'realistic'],
      category: 'Lifestyle',
      language: 'en',
    },
  },
  {
    id: '53',
    creator: mockCreators[6], // Emma
    platform: 'youtube',
    title: 'Thrifting But Make It Expensive',
    description: 'Going thrift shopping but only buying the most expensive items I can find',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example33',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
    viewCount: 980000,
    likeCount: 85000,
    commentCount: 5600,
    duration: '13:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['thrifting', 'fashion', 'shopping'],
      category: 'Lifestyle',
      language: 'en',
    },
  },
  {
    id: '54',
    creator: mockCreators[6], // Emma
    platform: 'youtube',
    title: 'Shorts: Life Update',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616c79d7a3c?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example7',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11시간 전
    viewCount: 650000,
    likeCount: 42000,
    commentCount: 1800,
    duration: '0:28',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'life update', 'personal'],
      category: 'Lifestyle',
      language: 'en',
      isShorts: true,
    },
  },

  // Dude Perfect 콘텐츠 (5개)
  {
    id: '55',
    creator: mockCreators[7], // Dude Perfect
    platform: 'youtube',
    title: 'Airplane Trick Shots | Dude Perfect',
    description: 'Epic trick shots from 30,000 feet in the air!',
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example34',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7시간 전
    viewCount: 5600000,
    likeCount: 450000,
    commentCount: 28000,
    duration: '10:25',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['trick shots', 'airplane', 'sports'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '56',
    creator: mockCreators[7], // Dude Perfect
    platform: 'youtube',
    title: 'Water Bottle Flip Championship',
    description: 'The ultimate water bottle flip competition!',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example35',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 8900000,
    likeCount: 680000,
    commentCount: 45000,
    duration: '12:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['water bottle flip', 'competition', 'challenge'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '57',
    creator: mockCreators[7], // Dude Perfect
    platform: 'twitter',
    title: 'New trick shot video drops tomorrow! This one is our craziest yet 🎯',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/dudeperfect/status/example15',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 0,
    likeCount: 15000,
    commentCount: 890,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['TrickShots', 'NewVideo'],
      mentions: [],
    },
  },
  {
    id: '58',
    creator: mockCreators[7], // Dude Perfect
    platform: 'youtube',
    title: 'Giant Jenga Battle | OT 25',
    description: 'Playing Jenga with massive blocks! Things get intense...',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example36',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    viewCount: 6700000,
    likeCount: 520000,
    commentCount: 32000,
    duration: '15:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Jenga', 'giant', 'Overtime'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '59',
    creator: mockCreators[7], // Dude Perfect
    platform: 'youtube',
    title: 'Shorts: Perfect Shot',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example8',
    publishedAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(), // 13시간 전
    viewCount: 2100000,
    likeCount: 180000,
    commentCount: 5600,
    duration: '0:18',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'perfect shot', 'amazing'],
      category: 'Entertainment',
      language: 'en',
      isShorts: true,
    },
  },

  // Ninja 콘텐츠 (5개)
  {
    id: '60',
    creator: mockCreators[8], // Ninja
    platform: 'youtube',
    title: 'INSANE Victory Royale in Fortnite!',
    description: 'This might be my best Fortnite game ever! 20 elimination Victory Royale!',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example37',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10시간 전
    viewCount: 1800000,
    likeCount: 145000,
    commentCount: 8900,
    duration: '12:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Fortnite', 'Victory Royale', 'gaming'],
      category: 'Gaming',
      language: 'en',
    },
  },
  {
    id: '61',
    creator: mockCreators[8], // Ninja
    platform: 'youtube',
    title: 'Reacting to My Old Fortnite Videos',
    description: 'Looking back at my old Fortnite content and cringing...',
    thumbnail: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example38',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 2300000,
    likeCount: 180000,
    commentCount: 12000,
    duration: '16:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['reaction', 'old videos', 'nostalgia'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '62',
    creator: mockCreators[8], // Ninja
    platform: 'twitter',
    title: 'Stream starting in 30 minutes! Come hang out 🎮',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/ninja/status/example16',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14시간 전
    viewCount: 0,
    likeCount: 9500,
    commentCount: 560,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['Stream', 'Gaming'],
      mentions: [],
    },
  },
  {
    id: '63',
    creator: mockCreators[8], // Ninja
    platform: 'youtube',
    title: 'Teaching My Wife How to Play Valorant',
    description: 'Jessica tries Valorant for the first time! This should be interesting...',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example39',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    viewCount: 1600000,
    likeCount: 125000,
    commentCount: 7800,
    duration: '18:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Valorant', 'teaching', 'couple'],
      category: 'Gaming',
      language: 'en',
    },
  },
  {
    id: '64',
    creator: mockCreators[8], // Ninja
    platform: 'youtube',
    title: 'Shorts: Epic Gaming Moment',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example9',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16시간 전
    viewCount: 950000,
    likeCount: 78000,
    commentCount: 3200,
    duration: '0:22',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'gaming', 'epic'],
      category: 'Gaming',
      language: 'en',
      isShorts: true,
    },
  },

  // Veritasium 콘텐츠 (5개)
  {
    id: '65',
    creator: mockCreators[9], // Veritasium
    platform: 'youtube',
    title: 'The Physics of Black Holes',
    description: 'Understanding the mind-bending physics behind black holes and what happens at the event horizon...',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example40',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
    viewCount: 2100000,
    likeCount: 185000,
    commentCount: 12000,
    duration: '18:35',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['physics', 'black holes', 'science'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '66',
    creator: mockCreators[9], // Veritasium
    platform: 'youtube',
    title: 'Why Quantum Computing Will Change Everything',
    description: 'The revolutionary potential of quantum computers and how they will transform our world...',
    thumbnail: 'https://images.unsplash.com/photo-1518709414565-57cbf42f8814?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example41',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 3800000,
    likeCount: 320000,
    commentCount: 25000,
    duration: '22:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['quantum computing', 'technology', 'future'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '67',
    creator: mockCreators[9], // Veritasium
    platform: 'twitter',
    title: 'Fun fact: A teaspoon of neutron star matter would weigh about 6 billion tons on Earth! 🌟',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/veritasium/status/example17',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 0,
    likeCount: 18000,
    commentCount: 1200,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['ScienceFact', 'NeutronStar'],
      mentions: [],
    },
  },
  {
    id: '68',
    creator: mockCreators[9], // Veritasium
    platform: 'youtube',
    title: 'The Impossible Math Problem',
    description: 'This math problem stumped mathematicians for centuries, until now...',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example42',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
    viewCount: 4200000,
    likeCount: 380000,
    commentCount: 28000,
    duration: '16:40',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['mathematics', 'problem solving', 'education'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '69',
    creator: mockCreators[9], // Veritasium
    platform: 'youtube',
    title: 'Climate Change: The Scientific Evidence',
    description: 'Examining the overwhelming scientific evidence for climate change and what it means for our future...',
    thumbnail: 'https://images.unsplash.com/photo-1569163139394-de44cb03c7c5?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example43',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8일 전
    viewCount: 2800000,
    likeCount: 245000,
    commentCount: 18000,
    duration: '20:25',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['climate change', 'science', 'environment'],
      category: 'Education',
      language: 'en',
    },
  },

  // Gordon Ramsay 콘텐츠 (5개)
  {
    id: '70',
    creator: mockCreators[10], // Gordon Ramsay
    platform: 'youtube',
    title: 'Perfect Beef Wellington in 10 Minutes',
    description: 'Master the art of Beef Wellington with this quick and easy recipe!',
    thumbnail: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example44',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
    viewCount: 1500000,
    likeCount: 125000,
    commentCount: 8900,
    duration: '10:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['cooking', 'beef wellington', 'recipe'],
      category: 'Lifestyle',
      language: 'en',
    },
  },
  {
    id: '71',
    creator: mockCreators[10], // Gordon Ramsay
    platform: 'youtube',
    title: 'Kitchen Nightmares: The Worst Restaurant Ever',
    description: 'This restaurant was so bad, I almost walked out! Watch the dramatic transformation...',
    thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example45',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 3200000,
    likeCount: 280000,
    commentCount: 25000,
    duration: '15:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['kitchen nightmares', 'restaurant', 'transformation'],
      category: 'Entertainment',
      language: 'en',
    },
  },
  {
    id: '72',
    creator: mockCreators[10], // Gordon Ramsay
    platform: 'twitter',
    title: 'Just tasted the most incredible pasta in Italy! The secret is in the simplicity 🍝',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    url: 'https://twitter.com/GordonRamsay/status/example18',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    viewCount: 0,
    likeCount: 23000,
    commentCount: 1800,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['Italy', 'Pasta'],
      mentions: [],
    },
  },
  {
    id: '73',
    creator: mockCreators[10], // Gordon Ramsay
    platform: 'youtube',
    title: 'Shorts: 60-Second Scrambled Eggs',
    description: '',
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=270&h=480&fit=crop',
    url: 'https://youtube.com/shorts/example10',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
    viewCount: 2800000,
    likeCount: 220000,
    commentCount: 8900,
    duration: '0:60',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Shorts', 'scrambled eggs', 'quick recipe'],
      category: 'Lifestyle',
      language: 'en',
      isShorts: true,
    },
  },
  {
    id: '74',
    creator: mockCreators[10], // Gordon Ramsay
    platform: 'youtube',
    title: 'Masterclass: How to Season Food Properly',
    description: 'The fundamentals of seasoning that every home cook needs to know!',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example46',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4일 전
    viewCount: 2100000,
    likeCount: 185000,
    commentCount: 12000,
    duration: '12:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['masterclass', 'seasoning', 'cooking tips'],
      category: 'Education',
      language: 'en',
    },
  },

  // Kurzgesagt 콘텐츠 (5개)
  {
    id: '75',
    creator: mockCreators[11], // Kurzgesagt
    platform: 'youtube',
    title: 'What If We Terraformed Mars?',
    description: 'Exploring the possibilities and challenges of making Mars habitable for humans...',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example47',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11시간 전
    viewCount: 4200000,
    likeCount: 380000,
    commentCount: 28000,
    duration: '14:20',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Mars', 'terraforming', 'space'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '76',
    creator: mockCreators[11], // Kurzgesagt
    platform: 'youtube',
    title: 'The Immune System Explained',
    description: 'How your immune system works to protect you from disease, visualized in beautiful animation...',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example48',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    viewCount: 6800000,
    likeCount: 620000,
    commentCount: 45000,
    duration: '16:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['immune system', 'biology', 'health'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '77',
    creator: mockCreators[11], // Kurzgesagt
    platform: 'twitter',
    title: 'Working on our next video about the universe\'s biggest mysteries! Stay tuned 🌌',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/Kurz_Gesagt/status/example19',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 0,
    likeCount: 25000,
    commentCount: 2100,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['Universe', 'NewVideo'],
      mentions: [],
    },
  },
  {
    id: '78',
    creator: mockCreators[11], // Kurzgesagt
    platform: 'youtube',
    title: 'The Fermi Paradox Explained',
    description: 'If the universe is so vast, where is everybody? Exploring the famous Fermi Paradox...',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example49',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6일 전
    viewCount: 8500000,
    likeCount: 750000,
    commentCount: 65000,
    duration: '18:30',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['Fermi paradox', 'aliens', 'universe'],
      category: 'Education',
      language: 'en',
    },
  },
  {
    id: '79',
    creator: mockCreators[11], // Kurzgesagt
    platform: 'youtube',
    title: 'What Happens When You Die?',
    description: 'A scientific look at what happens to your body and consciousness when you die...',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=480&h=270&fit=crop',
    url: 'https://youtube.com/watch?v=example50',
    publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9일 전
    viewCount: 12000000,
    likeCount: 950000,
    commentCount: 85000,
    duration: '15:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['death', 'consciousness', 'philosophy'],
      category: 'Education',
      language: 'en',
    },
  },
];

// 북마크/좋아요 상태 관리
export const mockBookmarkedContent: Set<string> = new Set();
export const mockLikedContent: Set<string> = new Set();

export const mockGetContent = async (params?: {
  page?: number;
  limit?: number;
  creators?: string[];
  platforms?: string[];
  search?: string;
  sortBy?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredContent = [...mockContents];
  
  // 크리에이터 필터 - 전체 보기 시에도 팔로우한 크리에이터만 표시
  if (params?.creators) {
    if (params.creators.includes('all')) {
      // 전체 보기 시 팔로우한 크리에이터만 필터링
      const followedCreatorIds = Array.from(mockFollowedCreators);
      filteredContent = filteredContent.filter(content =>
        followedCreatorIds.includes(content.creator.id)
      );
    } else {
      // 특정 크리에이터 선택 시
      filteredContent = filteredContent.filter(content =>
        params.creators!.includes(content.creator.id)
      );
    }
  } else {
    // 파라미터가 없을 때도 팔로우한 크리에이터만 표시
    const followedCreatorIds = Array.from(mockFollowedCreators);
    filteredContent = filteredContent.filter(content =>
      followedCreatorIds.includes(content.creator.id)
    );
  }
  
  // 플랫폼 필터
  if (params?.platforms && !params.platforms.includes('all')) {
    filteredContent = filteredContent.filter(content =>
      params.platforms!.includes(content.platform)
    );
  }
  
  // 검색 필터
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredContent = filteredContent.filter(content =>
      content.title.toLowerCase().includes(searchTerm) ||
      content.description?.toLowerCase().includes(searchTerm) ||
      content.creator.displayName.toLowerCase().includes(searchTerm)
    );
  }
  
  // 정렬
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'newest':
        filteredContent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        filteredContent.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        filteredContent.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'trending':
        filteredContent.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
    }
  }
  
  // 페이지네이션
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContent = filteredContent.slice(startIndex, endIndex);
  
  // 북마크/좋아요 상태 적용
  paginatedContent.forEach(content => {
    content.isBookmarked = mockBookmarkedContent.has(content.id);
    content.isLiked = mockLikedContent.has(content.id);
  });
  
  return {
    data: paginatedContent,
    pagination: {
      page,
      limit,
      total: filteredContent.length,
      totalPages: Math.ceil(filteredContent.length / limit),
      hasNext: endIndex < filteredContent.length,
      hasPrev: page > 1,
    },
  };
};

export const mockBookmarkContent = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('콘텐츠를 찾을 수 없습니다.');
  }
  
  mockBookmarkedContent.add(id);
  return { success: true };
};

export const mockRemoveBookmark = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockBookmarkedContent.delete(id);
  return { success: true };
};

export const mockLikeContent = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('콘텐츠를 찾을 수 없습니다.');
  }
  
  mockLikedContent.add(id);
  // 좋아요 수 증가
  content.likeCount = (content.likeCount || 0) + 1;
  return { success: true };
};

export const mockUnlikeContent = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('콘텐츠를 찾을 수 없습니다.');
  }
  
  mockLikedContent.delete(id);
  // 좋아요 수 감소
  content.likeCount = Math.max(0, (content.likeCount || 0) - 1);
  return { success: true };
};

export const mockGetBookmarks = async (page = 1, limit = 20) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const bookmarkedContents = mockContents.filter(content => 
    mockBookmarkedContent.has(content.id)
  );
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookmarks = bookmarkedContents.slice(startIndex, endIndex);
  
  return {
    data: paginatedBookmarks,
    pagination: {
      page,
      limit,
      total: bookmarkedContents.length,
      totalPages: Math.ceil(bookmarkedContents.length / limit),
      hasNext: endIndex < bookmarkedContents.length,
      hasPrev: page > 1,
    },
  };
};