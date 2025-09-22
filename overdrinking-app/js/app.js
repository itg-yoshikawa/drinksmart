class DrinkingApp {
    constructor() {
        this.drinks = [];
        this.waterIntakes = [];
        this.toiletVisits = [];
        this.bodyWeight = 77;
        this.gender = 'male'; // 'male' or 'female'
        this.dailyLimit = 20;
        this.targetPace = 30; // 分/杯
        this.waterReminderInterval = 20; // 分
        this.metabolismRate = 0.15; // %/時間（アルコール代謝速度）
        this.vibrationEnabled = true; // 振動フィードバック有効
        this.isCustomFormVisible = false;
        this.isCustomWaterFormVisible = false;
        this.waterReminderTimer = null;
        this.firstDrinkTime = null;
        this.favoriteDrinks = []; // お気に入り飲み物のリスト

        // デフォルト飲み物データ
        this.drinkTypes = [
            { type: 'beer', name: 'ビール', emoji: '🍺', volume: 350, alcohol: 5, info: '350ml (5%)' },
            { type: 'beer_large', name: 'ビール大', emoji: '🍺', volume: 500, alcohol: 5, info: '500ml (5%)' },
            { type: 'highball', name: 'ハイボール', emoji: '🥃', volume: 300, alcohol: 7, info: '300ml (7%)' },
            { type: 'sake', name: '日本酒', emoji: '🍶', volume: 180, alcohol: 15, info: '1合 (15%)' },
            { type: 'wine', name: 'ワイン', emoji: '🍷', volume: 120, alcohol: 12, info: '120ml (12%)' },
            { type: 'sparkling_wine', name: 'スパークリング', emoji: '🥂', volume: 120, alcohol: 12, info: '120ml (12%)' },
            { type: 'whiskey', name: 'ウイスキー', emoji: '🥃', volume: 30, alcohol: 40, info: '30ml (40%)' },
            { type: 'shochu', name: '焼酎', emoji: '🍺', volume: 90, alcohol: 25, info: '90ml (25%)' }
        ];

        // 血中アルコール濃度レベルの定義（医学的基準）
        this.bacLevels = [
            { min: 0, max: 0.02, status: "正常", className: "normal", icon: "😊" },
            { min: 0.02, max: 0.05, status: "爽快期", className: "mild", icon: "🙂" },
            { min: 0.05, max: 0.11, status: "ほろ酔い期", className: "tipsy", icon: "😅" },
            { min: 0.11, max: 0.16, status: "酩酊初期", className: "drunk", icon: "😵" },
            { min: 0.16, max: 0.31, status: "酩酊極期", className: "very-drunk", icon: "🤢" },
            { min: 0.31, max: 0.41, status: "泥酔期", className: "dangerous", icon: "🤮" },
            { min: 0.41, max: Infinity, status: "昏睡期", className: "dangerous", icon: "🚨" }
        ];

        this.init();
        this.loadData();
        this.loadFavorites();
        this.bindEvents();
        this.generateDrinkCards();
        this.updateDisplay();
        this.updateFavoriteDrinksDisplay();
        this.checkDateChange();
        this.startWaterReminder();
    }

    init() {
        this.updateDate();
        this.loadSettings();
    }

    updateDate() {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = today.toLocaleDateString('ja-JP', options);
        document.getElementById('currentDate').textContent = dateStr;
    }

    switchTab(tabName) {
        // すべてのタブボタンからactiveクラスを削除
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // すべてのタブコンテンツからactiveクラスを削除
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 選択されたタブボタンとコンテンツにactiveクラスを追加
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    showBottomSheet(sheetId) {
        const sheet = document.getElementById(sheetId);
        const overlay = document.getElementById('overlay');

        sheet.classList.add('active');
        overlay.classList.add('active');

        // bodyのスクロールを無効化
        document.body.style.overflow = 'hidden';
    }

    hideBottomSheet(sheetId) {
        const sheet = document.getElementById(sheetId);
        const overlay = document.getElementById('overlay');

        sheet.classList.remove('active');
        overlay.classList.remove('active');

        // bodyのスクロールを復活
        document.body.style.overflow = '';
    }

    hideAllBottomSheets() {
        document.querySelectorAll('.bottom-sheet').forEach(sheet => {
            sheet.classList.remove('active');
        });
        document.getElementById('overlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    generateDrinkCards() {
        const drinkGrid = document.getElementById('drinkGrid');

        const cardsHTML = this.drinkTypes.map(drink => {
            const isFavorite = this.favoriteDrinks.includes(drink.type);
            return `
                <div class="drink-card" data-type="${drink.type}">
                    <div class="drink-icon">${drink.emoji}</div>
                    <div class="drink-name">${drink.name}</div>
                    <div class="drink-info">${drink.info}</div>
                    <div class="drink-actions">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-type="${drink.type}">
                            ${isFavorite ? '★' : '☆'}
                        </button>
                        <button class="add-drink-btn" data-type="${drink.type}" data-volume="${drink.volume}" data-alcohol="${drink.alcohol}">
                            追加
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const customCard = `
            <div class="drink-card custom-card">
                <div class="drink-icon">🍹</div>
                <div class="drink-name">カスタム</div>
                <div class="drink-info">自由に設定</div>
                <div class="drink-actions">
                    <button class="add-drink-btn custom-btn" onclick="document.getElementById('customForm').classList.add('active'); document.getElementById('overlay').classList.add('active'); document.body.style.overflow = 'hidden';">
                        追加
                    </button>
                </div>
            </div>
        `;

        drinkGrid.innerHTML = cardsHTML + customCard;
    }

    bindEvents() {
        // タブナビゲーション
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // 設定ボタン
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showBottomSheet('settingsSheet');
        });

        // 動的に生成される飲み物カードのイベント委譲
        document.getElementById('drinkGrid').addEventListener('click', (e) => {
            // お気に入りボタンのクリック処理（最優先）
            if (e.target.classList.contains('favorite-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const type = e.target.getAttribute('data-type');
                this.toggleFavorite(type);
                return;
            }

            // 追加ボタンのクリック処理
            if (e.target.classList.contains('add-drink-btn') && !e.target.classList.contains('custom-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const type = e.target.getAttribute('data-type');
                const volume = parseInt(e.target.getAttribute('data-volume'));
                const alcohol = parseFloat(e.target.getAttribute('data-alcohol'));
                this.addDrink(type, volume, alcohol);
                return;
            }

            // カスタムボタンのクリック処理
            if (e.target.classList.contains('custom-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.showBottomSheet('customForm');
                return;
            }
        });

        // クイックお気に入りボタンのイベント（イベント委譲）
        document.getElementById('quickFavoritesGrid').addEventListener('click', (e) => {
            if (e.target.closest('.quick-favorite-btn')) {
                const btn = e.target.closest('.quick-favorite-btn');
                const type = btn.getAttribute('data-type');
                const volume = parseInt(btn.getAttribute('data-volume'));
                const alcohol = parseFloat(btn.getAttribute('data-alcohol'));
                this.addDrink(type, volume, alcohol);
            }
        });

        // カスタムフォームのイベント
        document.getElementById('addCustomDrink').addEventListener('click', () => {
            this.addCustomDrink();
        });

        document.getElementById('cancelCustom').addEventListener('click', () => {
            this.hideBottomSheet('customForm');
        });

        // 設定の変更イベント
        document.getElementById('gender').addEventListener('change', (e) => {
            this.gender = e.target.value;
            this.saveSettings();
            this.updateDisplay();
        });

        document.getElementById('bodyWeight').addEventListener('change', (e) => {
            this.bodyWeight = parseInt(e.target.value);
            this.saveSettings();
            this.updateDisplay();
        });

        document.getElementById('targetPace').addEventListener('change', (e) => {
            this.targetPace = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('waterReminder').addEventListener('change', (e) => {
            this.waterReminderInterval = parseInt(e.target.value);
            this.saveSettings();
            this.restartWaterReminder();
        });

        document.getElementById('dailyLimit').addEventListener('change', (e) => {
            this.dailyLimit = parseInt(e.target.value);
            this.saveSettings();
            this.updateDisplay();
        });

        document.getElementById('vibrationEnabled').addEventListener('change', (e) => {
            this.vibrationEnabled = e.target.checked;
            this.saveSettings();
        });

        // 記録クリアボタン
        document.getElementById('clearHistory').addEventListener('click', () => {
            if (confirm('今日の記録をすべてクリアしますか？')) {
                this.clearHistory();
            }
        });

        // 水分・トイレボタンのイベント
        document.getElementById('addWater').addEventListener('click', () => {
            this.addWater(200);
        });

        document.getElementById('addToilet').addEventListener('click', () => {
            this.addToiletVisit();
        });

        document.getElementById('customWater').addEventListener('click', () => {
            this.showBottomSheet('customWaterForm');
        });

        document.getElementById('addCustomWater').addEventListener('click', () => {
            this.addCustomWater();
        });

        document.getElementById('cancelCustomWater').addEventListener('click', () => {
            this.hideBottomSheet('customWaterForm');
        });

        // 個別削除ボタンのイベント（イベント委譲）
        document.getElementById('drinkHistory').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-item-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const type = e.target.getAttribute('data-type');
                const id = e.target.getAttribute('data-id');
                this.deleteRecord(type, id);
            }
        });

        // 設定ボトムシートのイベント
        document.getElementById('closeSettings').addEventListener('click', () => {
            this.hideBottomSheet('settingsSheet');
        });

        // オーバーレイクリック
        document.getElementById('overlay').addEventListener('click', () => {
            this.hideAllBottomSheets();
        });

        // 新しい設定項目のイベント
        document.getElementById('targetPace').addEventListener('change', (e) => {
            this.targetPace = parseInt(e.target.value);
            this.saveSettings();
            this.updateDisplay();
        });

        document.getElementById('waterReminder').addEventListener('change', (e) => {
            this.waterReminderInterval = parseInt(e.target.value);
            this.saveSettings();
            this.restartWaterReminder();
        });
    }

    addDrink(type, volume, alcoholPercent) {
        const now = new Date();
        const drink = {
            id: now.getTime(),
            type: type,
            volume: volume,
            alcoholPercent: alcoholPercent,
            pureAlcohol: this.calculatePureAlcohol(volume, alcoholPercent),
            timestamp: now
        };

        // 初回飲酒時刻を記録
        if (this.drinks.length === 0) {
            this.firstDrinkTime = now;
        }

        this.drinks.push(drink);

        // 振動フィードバック
        this.vibrate([50]);

        this.saveData();
        this.updateDisplay();
        this.checkWarnings();
        this.checkPaceWarning();
    }

    addCustomDrink() {
        const volume = parseInt(document.getElementById('customVolume').value);
        const alcoholPercent = parseFloat(document.getElementById('customAlcohol').value);

        if (!volume || !alcoholPercent || volume <= 0 || alcoholPercent < 0) {
            alert('正しい値を入力してください');
            return;
        }

        this.addDrink('custom', volume, alcoholPercent);
        this.hideBottomSheet('customForm');
        this.clearCustomForm();
    }

    clearCustomForm() {
        document.getElementById('customVolume').value = '';
        document.getElementById('customAlcohol').value = '';
    }

    addWater(amount) {
        const waterIntake = {
            id: Date.now(),
            amount: amount,
            timestamp: new Date()
        };

        this.waterIntakes.push(waterIntake);

        // 振動フィードバック（短い振動）
        this.vibrate([30]);

        this.saveData();
        this.updateDisplay();
    }

    addCustomWater() {
        const amount = parseInt(document.getElementById('customWaterAmount').value);

        if (!amount || amount <= 0) {
            alert('正しい水分量を入力してください');
            return;
        }

        this.addWater(amount);
        this.hideBottomSheet('customWaterForm');
        this.clearCustomWaterForm();
    }

    addToiletVisit() {
        const toiletVisit = {
            id: Date.now(),
            timestamp: new Date()
        };

        this.toiletVisits.push(toiletVisit);

        // 振動フィードバック（短い振動）
        this.vibrate([30]);

        this.saveData();
        this.updateDisplay();
    }

    clearCustomWaterForm() {
        document.getElementById('customWaterAmount').value = '';
    }

    calculatePureAlcohol(volume, alcoholPercent) {
        // 純アルコール量 = 飲酒量(ml) × アルコール度数(%) × 0.8（アルコールの比重）/ 100
        return Math.round(volume * alcoholPercent * 0.8 / 100 * 10) / 10;
    }

    calculateBloodAlcoholContent() {
        if (this.drinks.length === 0) return 0;

        const totalAlcohol = this.getTotalAlcohol();

        // Widmark公式による血中アルコール濃度計算
        // BAC = (A / (W × r)) - (β × t)
        // A: 摂取した純アルコール量 (g)
        // W: 体重 (kg)
        // r: 性別係数 (男性: 0.7, 女性: 0.6)
        // β: アルコール代謝速度 (0.15%/時間)
        // t: 飲酒開始からの経過時間 (時間)

        const bodyFactor = this.gender === 'male' ? 0.7 : 0.6;
        const now = new Date();
        const drinkingStartTime = this.firstDrinkTime || this.drinks[0].timestamp;
        const elapsedHours = (now - drinkingStartTime) / (1000 * 60 * 60);

        // 初期BAC計算（Widmark公式）
        // BAC(%) = (アルコール量(g) × 0.8) / (体重(kg) × 体水分率) × 100 / 1000
        const initialBAC = (totalAlcohol * 0.8) / (this.bodyWeight * bodyFactor) / 10;

        // 代謝による減少を考慮（0.15g/dL/時間 = 0.015%/時間）
        const metabolizedBAC = 0.015 * elapsedHours;

        // 最終BAC（負の値にならないように）
        const finalBAC = Math.max(0, initialBAC - metabolizedBAC);

        return Math.round(finalBAC * 100) / 100;
    }

    getTotalAlcohol() {
        return this.drinks.reduce((total, drink) => total + drink.pureAlcohol, 0);
    }

    getBacStatus(bac) {
        for (let level of this.bacLevels) {
            if (bac >= level.min && bac < level.max) {
                return level;
            }
        }
        // デフォルト（危険レベル）
        return this.bacLevels[this.bacLevels.length - 1];
    }

    getTotalWater() {
        return this.waterIntakes.reduce((total, intake) => total + intake.amount, 0);
    }

    getRecommendedWaterIntake() {
        const totalAlcohol = this.getTotalAlcohol();

        // 基本的な水分補給ガイドライン：
        // 1. アルコール1gにつき10-15mlの水分摂取を推奨
        // 2. 最低でもアルコール飲料と同量の水分
        // 3. 脱水防止のための追加水分

        if (totalAlcohol === 0) return 0;

        // アルコール量ベースの推奨量（12ml/g）
        const alcoholBasedWater = totalAlcohol * 12;

        // 飲料量ベースの推奨量（アルコール飲料総量と同量）
        const totalDrinkVolume = this.drinks.reduce((total, drink) => total + drink.volume, 0);

        // より高い方を採用し、最低300ml以上を確保
        const recommended = Math.max(alcoholBasedWater, totalDrinkVolume, 300);

        return Math.round(recommended);
    }

    getWaterAlcoholRatio() {
        const totalWater = this.getTotalWater();
        const totalAlcohol = this.getTotalAlcohol();

        if (totalAlcohol === 0) return '-';

        const ratio = totalWater / totalAlcohol;
        return `${Math.round(ratio * 10) / 10}:1`;
    }

    getCurrentPace() {
        if (this.drinks.length < 2) return '-';

        const now = new Date();
        const firstDrink = this.drinks[0].timestamp;
        const timeDiff = (now - firstDrink) / (1000 * 60); // 分
        const pace = timeDiff / this.drinks.length;

        return `${Math.round(pace)}分/杯`;
    }

    calculateSoberTime() {
        const currentBAC = this.calculateBloodAlcoholContent();
        if (currentBAC === 0) return '0時間';

        // BAC 0.05%を完全しらふとする閾値
        const soberThreshold = 0.05;

        if (currentBAC <= soberThreshold) return '0時間';

        // 代謝速度による時間計算
        const hoursToSober = (currentBAC - soberThreshold) / this.metabolismRate;

        if (hoursToSober < 1) {
            return `${Math.round(hoursToSober * 60)}分`;
        } else {
            const hours = Math.floor(hoursToSober);
            const minutes = Math.round((hoursToSober - hours) * 60);
            return minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
        }
    }

    updateDisplay() {
        const totalAlcohol = this.getTotalAlcohol();
        const bac = this.calculateBloodAlcoholContent();
        const remaining = Math.max(0, this.dailyLimit - totalAlcohol);
        const progressPercent = Math.min(100, (totalAlcohol / this.dailyLimit) * 100);
        const totalWater = this.getTotalWater();
        const waterAlcoholRatio = this.getWaterAlcoholRatio();
        const toiletCount = this.toiletVisits.length;
        const currentPace = this.getCurrentPace();
        const soberTime = this.calculateSoberTime();

        // 数値更新
        document.getElementById('totalAlcohol').textContent = `${totalAlcohol}g`;
        document.getElementById('bloodAlcohol').textContent = `${bac.toFixed(2)}%`;
        document.getElementById('remainingLimit').textContent = `${remaining}g`;
        document.getElementById('totalWater').textContent = `${totalWater}ml`;
        document.getElementById('waterAlcoholRatio').textContent = waterAlcoholRatio;
        document.getElementById('toiletCount').textContent = `${toiletCount}回`;
        document.getElementById('currentPace').textContent = currentPace;
        document.getElementById('soberTime').textContent = soberTime;

        // 推奨水分量の表示と評価
        const recommendedWater = this.getRecommendedWaterIntake();
        const waterTarget = document.getElementById('waterTarget');

        if (recommendedWater === 0) {
            waterTarget.textContent = '推奨: 飲酒開始で表示';
            waterTarget.className = 'info-target';
        } else {
            waterTarget.textContent = `推奨: ${recommendedWater}ml`;

            // 摂取状況による色分け
            if (totalWater >= recommendedWater) {
                waterTarget.className = 'info-target sufficient';
            } else if (totalWater >= recommendedWater * 0.7) {
                waterTarget.className = 'info-target';
            } else {
                waterTarget.className = 'info-target insufficient';
            }
        }

        // 血中アルコール濃度の状態表示更新
        const bacStatus = this.getBacStatus(bac);
        const bacIcon = document.getElementById('bacIcon');
        const bacText = document.getElementById('bacText');

        bacIcon.textContent = bacStatus.icon;
        bacText.textContent = bacStatus.status;

        // 既存のクラスを削除
        bacText.className = 'status-text';
        // 新しいクラスを追加
        bacText.classList.add(bacStatus.className);

        // プログレスバー更新
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${progressPercent}%`;

        // プログレスバーの色変更
        progressFill.classList.remove('warning', 'danger');
        if (progressPercent >= 100) {
            progressFill.classList.add('danger');
        } else if (progressPercent >= 80) {
            progressFill.classList.add('warning');
        }

        // 履歴更新
        this.updateHistory();

        // 設定値更新
        document.getElementById('gender').value = this.gender;
        document.getElementById('bodyWeight').value = this.bodyWeight;
        document.getElementById('dailyLimit').value = this.dailyLimit;
        document.getElementById('targetPace').value = this.targetPace;
        document.getElementById('waterReminder').value = this.waterReminderInterval;
        document.getElementById('vibrationEnabled').checked = this.vibrationEnabled;
    }

    updateHistory() {
        const historyContainer = document.getElementById('drinkHistory');

        // すべての記録を時系列で統合
        const allRecords = [
            ...this.drinks.map(drink => ({
                ...drink,
                originalType: drink.type,
                type: 'drink',
                timestamp: drink.timestamp
            })),
            ...this.waterIntakes.map(water => ({
                ...water,
                type: 'water',
                timestamp: water.timestamp
            })),
            ...this.toiletVisits.map(toilet => ({
                ...toilet,
                type: 'toilet',
                timestamp: toilet.timestamp
            }))
        ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        if (allRecords.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <div class="empty-text">まだ記録がありません</div>
                </div>
            `;
            return;
        }

        const historyHTML = allRecords.map(record => {
            const time = record.timestamp.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit'
            });

            if (record.type === 'drink') {
                const drinkName = this.getDrinkName(record.originalType || 'custom');
                return `
                    <div class="drink-item">
                        <div class="drink-info">
                            <div class="drink-name">${drinkName}</div>
                            <div class="drink-details">
                                ${record.volume}ml (${record.alcoholPercent}%) - ${time}
                            </div>
                        </div>
                        <div class="item-actions">
                            <div class="drink-alcohol">${record.pureAlcohol}g</div>
                            <button class="delete-item-btn" data-type="drink" data-id="${record.id}">×</button>
                        </div>
                    </div>
                `;
            } else if (record.type === 'water') {
                return `
                    <div class="drink-item water-item">
                        <div class="drink-info">
                            <div class="drink-name">💧 水分摂取</div>
                            <div class="drink-details">
                                ${record.amount}ml - ${time}
                            </div>
                        </div>
                        <div class="item-actions">
                            <div class="drink-alcohol">+${record.amount}ml</div>
                            <button class="delete-item-btn" data-type="water" data-id="${record.id}">×</button>
                        </div>
                    </div>
                `;
            } else if (record.type === 'toilet') {
                return `
                    <div class="drink-item toilet-item">
                        <div class="drink-info">
                            <div class="drink-name">🚽 トイレ</div>
                            <div class="drink-details">
                                ${time}
                            </div>
                        </div>
                        <div class="item-actions">
                            <div class="drink-alcohol">+1回</div>
                            <button class="delete-item-btn" data-type="toilet" data-id="${record.id}">×</button>
                        </div>
                    </div>
                `;
            }
        }).join('');

        historyContainer.innerHTML = historyHTML;
    }

    getDrinkName(type) {
        const names = {
            beer: '🍺 ビール(350ml)',
            beer_large: '🍺 ビール(500ml)',
            highball: '🥃 ハイボール',
            sake: '🍶 日本酒',
            wine: '🍷 ワイン',
            sparkling_wine: '🥂 スパークリング',
            whiskey: '🥃 ウイスキー',
            shochu: '🍺 焼酎',
            custom: '🍹 カスタム'
        };
        return names[type] || 'その他';
    }

    checkWarnings() {
        const totalAlcohol = this.getTotalAlcohol();
        const warningElement = document.getElementById('warningMessage');

        if (totalAlcohol > this.dailyLimit) {
            warningElement.style.display = 'block';
            this.showNotification('適正飲酒量を超えました！', 'warning');
        } else {
            warningElement.style.display = 'none';
        }

        // 血中アルコール濃度による警告
        const bac = this.calculateBloodAlcoholContent();
        if (bac >= 0.15) {
            this.showNotification('血中アルコール濃度が高くなっています！', 'danger');
        }
    }

    checkPaceWarning() {
        if (this.drinks.length < 2) return;

        const now = new Date();
        const lastDrink = this.drinks[this.drinks.length - 1].timestamp;
        const secondLastDrink = this.drinks[this.drinks.length - 2].timestamp;

        // 直近2杯の間隔を計算
        const timeDiff = (lastDrink - secondLastDrink) / (1000 * 60); // 分

        if (timeDiff < this.targetPace * 0.7) {
            this.showNotification(`ペースが早すぎます！目標：${this.targetPace}分/杯`, 'warning');
        }

        // 全体的なペースも確認
        if (this.drinks.length >= 3) {
            const firstDrink = this.drinks[0].timestamp;
            const totalTime = (now - firstDrink) / (1000 * 60); // 分
            const avgPace = totalTime / this.drinks.length;

            if (avgPace < this.targetPace * 0.8) {
                this.showNotification('全体的にペースが早めです。水分補給を忘れずに！', 'warning');
            }
        }
    }

    showNotification(message, type = 'info') {
        // 簡易的な通知表示
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? '#FF9800' : type === 'danger' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startWaterReminder() {
        this.stopWaterReminder();
        this.waterReminderTimer = setInterval(() => {
            this.showNotification('💧 水分補給の時間です！', 'info');
        }, this.waterReminderInterval * 60 * 1000);
    }

    stopWaterReminder() {
        if (this.waterReminderTimer) {
            clearInterval(this.waterReminderTimer);
            this.waterReminderTimer = null;
        }
    }

    restartWaterReminder() {
        this.startWaterReminder();
    }

    deleteRecord(type, id) {
        const numericId = parseInt(id);
        let deleted = false;

        if (type === 'drink') {
            const index = this.drinks.findIndex(drink => drink.id === numericId);
            if (index > -1) {
                this.drinks.splice(index, 1);
                deleted = true;
            }
        } else if (type === 'water') {
            const index = this.waterIntakes.findIndex(water => water.id === numericId);
            if (index > -1) {
                this.waterIntakes.splice(index, 1);
                deleted = true;
            }
        } else if (type === 'toilet') {
            const index = this.toiletVisits.findIndex(toilet => toilet.id === numericId);
            if (index > -1) {
                this.toiletVisits.splice(index, 1);
                deleted = true;
            }
        }

        if (deleted) {
            // 初回飲酒時刻のリセット（飲み物がすべて削除された場合）
            if (this.drinks.length === 0) {
                this.firstDrinkTime = null;
            }

            // 振動フィードバック（短い振動）
            this.vibrate([20]);

            this.saveData();
            this.updateDisplay();
        }
    }

    clearHistory() {
        this.drinks = [];
        this.waterIntakes = [];
        this.toiletVisits = [];
        this.firstDrinkTime = null;
        this.saveData();
        this.updateDisplay();
    }

    checkDateChange() {
        const lastDate = localStorage.getItem('drinkingApp_lastDate');
        const today = new Date().toDateString();

        if (lastDate && lastDate !== today) {
            this.clearHistory();
        }

        localStorage.setItem('drinkingApp_lastDate', today);
    }

    saveData() {
        const data = {
            drinks: this.drinks.map(drink => ({
                ...drink,
                timestamp: drink.timestamp.toISOString()
            })),
            waterIntakes: this.waterIntakes.map(water => ({
                ...water,
                timestamp: water.timestamp.toISOString()
            })),
            toiletVisits: this.toiletVisits.map(toilet => ({
                ...toilet,
                timestamp: toilet.timestamp.toISOString()
            })),
            date: new Date().toDateString()
        };
        localStorage.setItem('drinkingApp_data', JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem('drinkingApp_data');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                const today = new Date().toDateString();

                if (parsed.date === today) {
                    if (parsed.drinks) {
                        this.drinks = parsed.drinks.map(drink => ({
                            ...drink,
                            timestamp: new Date(drink.timestamp)
                        }));
                    }
                    if (parsed.waterIntakes) {
                        this.waterIntakes = parsed.waterIntakes.map(water => ({
                            ...water,
                            timestamp: new Date(water.timestamp)
                        }));
                    }
                    if (parsed.toiletVisits) {
                        this.toiletVisits = parsed.toiletVisits.map(toilet => ({
                            ...toilet,
                            timestamp: new Date(toilet.timestamp)
                        }));
                    }
                }
            } catch (e) {
                console.error('データの読み込みに失敗しました:', e);
            }
        }
    }

    saveSettings() {
        const settings = {
            gender: this.gender,
            bodyWeight: this.bodyWeight,
            dailyLimit: this.dailyLimit,
            targetPace: this.targetPace,
            waterReminderInterval: this.waterReminderInterval,
            vibrationEnabled: this.vibrationEnabled
        };
        localStorage.setItem('drinkingApp_settings', JSON.stringify(settings));
    }

    loadSettings() {
        const settings = localStorage.getItem('drinkingApp_settings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                this.gender = parsed.gender || 'male';
                this.bodyWeight = parsed.bodyWeight || 77;
                this.dailyLimit = parsed.dailyLimit || 20;
                this.targetPace = parsed.targetPace || 30;
                this.waterReminderInterval = parsed.waterReminderInterval || 20;
                this.vibrationEnabled = parsed.vibrationEnabled !== undefined ? parsed.vibrationEnabled : true;
            } catch (e) {
                console.error('設定の読み込みに失敗しました:', e);
            }
        }
    }

    toggleFavorite(drinkType) {
        const index = this.favoriteDrinks.indexOf(drinkType);
        if (index > -1) {
            this.favoriteDrinks.splice(index, 1);
            // お気に入り削除時の振動（短い1回）
            this.vibrate([20]);
        } else {
            this.favoriteDrinks.push(drinkType);
            // お気に入り追加時の振動（2回パターン）
            this.vibrate([30, 50, 30]);
        }
        this.saveFavorites();
        this.generateDrinkCards();
        this.updateFavoriteDrinksDisplay();
    }

    saveFavorites() {
        localStorage.setItem('drinkingApp_favorites', JSON.stringify(this.favoriteDrinks));
    }

    loadFavorites() {
        const favorites = localStorage.getItem('drinkingApp_favorites');
        if (favorites) {
            try {
                this.favoriteDrinks = JSON.parse(favorites);
            } catch (e) {
                console.error('お気に入りの読み込みに失敗しました:', e);
                this.favoriteDrinks = [];
            }
        }
    }

    vibrate(pattern) {
        // 振動設定が無効の場合は何もしない
        if (!this.vibrationEnabled) {
            return;
        }

        // Web Vibration API対応チェック
        if ('vibrate' in navigator) {
            try {
                // 振動実行
                const result = navigator.vibrate(pattern);
                console.log('振動API実行:', result ? '成功' : '失敗');

                // 振動が失敗した場合は代替フィードバックを表示
                if (!result) {
                    this.showVibrationFallback();
                }
            } catch (error) {
                console.log('振動API エラー:', error);
                this.showVibrationFallback();
            }
        } else {
            console.log('振動API 非対応ブラウザ');
            this.showVibrationFallback();
        }
    }

    showVibrationFallback() {
        // 振動の代替フィードバック（視覚的効果）
        const body = document.body;
        body.style.transition = 'transform 0.1s ease';
        body.style.transform = 'scale(1.005)';

        setTimeout(() => {
            body.style.transform = 'scale(1)';
            setTimeout(() => {
                body.style.transition = '';
            }, 100);
        }, 100);
    }

    updateFavoriteDrinksDisplay() {
        const quickFavoritesGrid = document.getElementById('quickFavoritesGrid');
        const quickFavorites = document.getElementById('quickFavorites');

        if (this.favoriteDrinks.length === 0) {
            quickFavorites.classList.remove('show');
            return;
        }

        quickFavorites.classList.add('show');

        const favoriteHTML = this.favoriteDrinks.slice(0, 5).map(drinkType => {
            const drink = this.drinkTypes.find(d => d.type === drinkType);
            if (!drink) return '';

            return `
                <button class="quick-favorite-btn" data-type="${drink.type}" data-alcohol="${drink.alcohol}" data-volume="${drink.volume}">
                    <div class="quick-favorite-icon">${drink.emoji}</div>
                    <div class="quick-favorite-name">${drink.name}</div>
                    <div class="quick-favorite-detail">${drink.volume}ml</div>
                </button>
            `;
        }).join('');

        quickFavoritesGrid.innerHTML = favoriteHTML;
    }
}

// CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    new DrinkingApp();
});