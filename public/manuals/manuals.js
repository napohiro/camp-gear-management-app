'use strict';
// ============================================================
// 取扱説明書 PDFレジストリ
//
// 新しいPDFを追加するときは、このファイルにエントリを追加してください。
// index.html のギアIDと一致させてください（DEFAULT_GEARS の id フィールド）。
//
// 書き方:
//   'ギアID': {
//     path:     'public/manuals/ファイル名.pdf',  ← HTMLからの相対パス
//     filename: 'ファイル名.pdf',
//     note:     '説明（省略可）',
//   }
// ============================================================
const MANUALS_REGISTRY = {

    // ✅ 登録済み
    't0': {
        path:     'public/manuals/circus_st.pdf',
        filename: 'circus_st.pdf',
        note:     'テンマクデザイン サーカスS 取扱説明書',
    },

    // ── 以下は未登録 ──
    // PDFを入手したらコメントを外してパスを設定してください

    // 't1': {
    //     path:     'public/manuals/snopeak_vault.pdf',
    //     filename: 'snopeak_vault.pdf',
    //     note:     'Snow Peak ヴォールト 取扱説明書',
    // },
    // 't2': {
    //     path:     'public/manuals/tomount_pup_tc.pdf',
    //     filename: 'tomount_pup_tc.pdf',
    //     note:     'TOMOUNT パップテント（軍幕TC）取扱説明書',
    // },
    // 't3': {
    //     path:     'public/manuals/alice_onetouch.pdf',
    //     filename: 'alice_onetouch.pdf',
    //     note:     '雑貨の国のアリス ワンタッチドーム 取扱説明書',
    // },
    // 't4': {
    //     path:     'public/manuals/desertfox_lodge.pdf',
    //     filename: 'desertfox_lodge.pdf',
    //     note:     'DesertFox ロッジ型広空間テント 取扱説明書',
    // },
    // 'g5': {
    //     path:     'public/manuals/sp_takibitai_m.pdf',
    //     filename: 'sp_takibitai_m.pdf',
    //     note:     'Snow Peak 焚き火台M 取扱説明書',
    // },
    // 'g6': {
    //     path:     'public/manuals/goalzero_lighthouse.pdf',
    //     filename: 'goalzero_lighthouse.pdf',
    //     note:     'Goal Zero ライトハウスマイクロ 取扱説明書',
    // },
    // 'g7': {
    //     path:     'public/manuals/soto_st310.pdf',
    //     filename: 'soto_st310.pdf',
    //     note:     'SOTO ST-310 取扱説明書',
    // },
    // 'g8': {
    //     path:     'public/manuals/uniflame_fieldrack.pdf',
    //     filename: 'uniflame_fieldrack.pdf',
    //     note:     'Uniflame フィールドラック 取扱説明書',
    // },
    // 'g9': {
    //     path:     'public/manuals/montbell_downhugger800.pdf',
    //     filename: 'montbell_downhugger800.pdf',
    //     note:     'mont-bell ダウンハガー800 #3 取扱説明書',
    // },
    // 'g10': {
    //     path:     'public/manuals/yeti_roadiecut60.pdf',
    //     filename: 'yeti_roadiecut60.pdf',
    //     note:     'YETI ローディーカット60 取扱説明書',
    // },
};
