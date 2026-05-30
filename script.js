// ==========================================
// 米inc風：完全バウンドなし・仮想スクロール制御
// ==========================================

let currentScrollY = window.scrollY || 0;
const scrollSpeed = 0.8; // 💡 スクロールの滑らかさ・速度（好みに合わせて0.5〜1.2で調整してね）

// ページ読み込み完了時にもう一度スクロール位置を同期（リロード時のジャンプ防止）
window.addEventListener('load', () => {
    currentScrollY = window.scrollY;
});

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice) {
    // 1. ブラウザ本来のスクロール挙動を、ページ全体で「100%完全禁止」にする
    window.addEventListener('wheel', (e) => {
        // YouTube iframe上ではスクロールをスルー（座標ベースで判定・クロスオリジン対応）
        const youtubeWrapper = document.querySelector('.youtube-wrapper');
        if (youtubeWrapper) {
            const rect = youtubeWrapper.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top  && e.clientY <= rect.bottom) {
                return;
            }
        }

        e.preventDefault(); // 通常のスクロールを殺す

        // マウスのホイール量（勢い）を計算
        currentScrollY += e.deltaY * scrollSpeed;

        // スクロールの限界値を設定（一番上と一番下を超えないようにロック）
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        currentScrollY = Math.max(0, Math.min(currentScrollY, maxScroll));

        // 画面を計算した位置へカチッと強制移動
        window.scrollTo({
            top: currentScrollY,
            behavior: 'auto' // smoothにするとバウンドが復活するので必ずauto
        });
    }, { passive: false });

    // 2. スマホやトラックパッドの「指でのスワイプ（タッチ操作）」も完全にバウンドを殺す
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].pageY;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        // YouTube iframe上ではタッチスクロールをスルー（座標ベースで判定・クロスオリジン対応）
        const youtubeWrapper = document.querySelector('.youtube-wrapper');
        if (youtubeWrapper) {
            const rect = youtubeWrapper.getBoundingClientRect();
            const touch = e.touches[0];
            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top  && touch.clientY <= rect.bottom) {
                return;
            }
        }

        e.preventDefault(); // スマホのびよーん（ラバーバンド）を完全禁止

        const touchCurrentY = e.touches[0].pageY;
        const touchDeltaY = touchStartY - touchCurrentY; // 指の動いた量

        currentScrollY += touchDeltaY * 1.5; // タッチの感度調整

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        currentScrollY = Math.max(0, Math.min(currentScrollY, maxScroll));

        window.scrollTo({
            top: currentScrollY,
            behavior: 'auto'
        });

        touchStartY = touchCurrentY; // 次の移動のために位置を更新
    }, { passive: false });
}

// ==========================================
// 映像風：ダイナミックナビゲーションの制御（3本線span連動版）
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const dynamicNav = document.querySelector('.dynamic-nav');
    const navToggleBtn = document.getElementById('nav-toggle');

    if (navToggleBtn && dynamicNav) {
        navToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dynamicNav.classList.toggle('is-open');
        });
    }

    // 💡 ナビゲーションのリンクなどをクリックした際のジャンプを制御
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // ターゲットの位置を取得
                const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
                
                // 💡 仮想スクロールの位置を更新して、次回スクロール時のジャンプ（カクつき）を防ぐ
                currentScrollY = targetY;
                
                // スムーズにスクロールさせる
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });
                
                // メニューが開いていたら閉じる
                if (dynamicNav && dynamicNav.classList.contains('is-open')) {
                    dynamicNav.classList.remove('is-open');
                }
            }
        });
    });
});

// 2. スクロールに連動して枠線のグラデーションを回転させる
// 💡 同時に currentScrollY をブラウザの実際位置と常に同期させる
//    （最下部などで位置がズレると次のスクロール時に瞬間移動するバグを防ぐ）
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // ✅ 仮想スクロール位置をブラウザの実際位置に常に合わせておく
    currentScrollY = scrollY;

    // スクロール量に合わせて角度を計算
    const angle = scrollY * 0.15;

    // CSSの変数（--nav-angle）をリアルタイムに上書き
    document.documentElement.style.setProperty('--nav-angle', `${angle}deg`);
});

// ==========================================
// 作品カードのクリック遷移（作品コード自動取得版）
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('click', () => {
            // カードの中にある .work-category の文字（例: 25E12M）を自動で拾う！
            const categoryElem = item.querySelector('.work-category');
            
            if (categoryElem) {
                // 前後の余計な空白を削ってID（作品コード）にする
                const id = categoryElem.textContent.trim(); 
                
                if (id) {
                    window.location.href = `work-detail.html?id=${id}`;
                }
            }
        });
    });
});

// ==========================================
// Worksカテゴリーフィルターの制御
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // アクティブなボタンのクラスを切り替え
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            workItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });

            // 💡 フィルター切り替え時に、仮想スクロール位置の整合性が崩れないように調整
            // （要素が減ってページ高さが低くなった場合、現在のスクロール位置がページ最下部を超えないように制限）
            setTimeout(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (window.currentScrollY !== undefined) {
                    if (window.currentScrollY > maxScroll) {
                        window.currentScrollY = Math.max(0, maxScroll);
                        window.scrollTo({
                            top: window.currentScrollY,
                            behavior: 'smooth'
                        });
                    }
                } else if (typeof currentScrollY !== 'undefined') {
                    if (currentScrollY > maxScroll) {
                        currentScrollY = Math.max(0, maxScroll);
                        window.scrollTo({
                            top: currentScrollY,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 100);
        });
    });
});