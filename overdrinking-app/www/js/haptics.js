// Haptics Service - Web版とネイティブ版の統合
class HapticsService {
    constructor() {
        this.isNative = false;
        this.Haptics = null;
        this.ImpactStyle = null;
        this.NotificationType = null;
        this.init();
    }

    async init() {
        // Capacitorが利用可能かチェック
        if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform && Capacitor.isNativePlatform()) {
            try {
                const { Haptics, ImpactStyle, NotificationType } = Capacitor.Plugins;
                this.Haptics = Haptics;
                this.ImpactStyle = ImpactStyle;
                this.NotificationType = NotificationType;
                this.isNative = true;
                console.log('Capacitor Haptics initialized');
            } catch (error) {
                console.warn('Capacitor Haptics not available:', error);
                this.isNative = false;
            }
        }
    }

    async vibrate(pattern) {
        if (this.isNative && this.Haptics) {
            return this.nativeVibrate(pattern);
        } else {
            return this.webVibrate(pattern);
        }
    }

    async nativeVibrate(pattern) {
        if (!this.Haptics) return;

        try {
            if (Array.isArray(pattern)) {
                // パターンに応じて適切なハプティクスを選択
                if (pattern[0] === 50) {
                    // 飲み物追加（中程度）
                    await this.Haptics.impact({ style: this.ImpactStyle.Medium });
                } else if (pattern[0] === 30) {
                    // 水分/トイレ（軽い）
                    await this.Haptics.impact({ style: this.ImpactStyle.Light });
                } else if (pattern[0] === 20) {
                    // 削除（非常に軽い）
                    await this.Haptics.impact({ style: this.ImpactStyle.Light });
                } else if (pattern.length > 1) {
                    // 複雑なパターン（リマインダー等）
                    await this.Haptics.notification({ type: this.NotificationType.Warning });
                } else if (pattern[0] >= 100) {
                    // 重い振動（警告）
                    await this.Haptics.impact({ style: this.ImpactStyle.Heavy });
                }
            } else {
                // 数値が直接渡された場合
                await this.Haptics.impact({ style: this.ImpactStyle.Medium });
            }
        } catch (error) {
            console.error('Haptics error:', error);
            // フォールバックとしてWeb版を使用
            this.webVibrate(pattern);
        }
    }

    webVibrate(pattern) {
        // Web標準のVibration API
        if (navigator.vibrate) {
            if (Array.isArray(pattern)) {
                navigator.vibrate(pattern);
            } else {
                navigator.vibrate([pattern]);
            }
        }
    }

    // 便利メソッド
    async light() {
        if (this.isNative && this.Haptics) {
            await this.Haptics.impact({ style: this.ImpactStyle.Light });
        } else {
            this.webVibrate([30]);
        }
    }

    async medium() {
        if (this.isNative && this.Haptics) {
            await this.Haptics.impact({ style: this.ImpactStyle.Medium });
        } else {
            this.webVibrate([50]);
        }
    }

    async heavy() {
        if (this.isNative && this.Haptics) {
            await this.Haptics.impact({ style: this.ImpactStyle.Heavy });
        } else {
            this.webVibrate([100]);
        }
    }

    async success() {
        if (this.isNative && this.Haptics) {
            await this.Haptics.notification({ type: this.NotificationType.Success });
        } else {
            this.webVibrate([50, 50, 50]);
        }
    }

    async warning() {
        if (this.isNative && this.Haptics) {
            await this.Haptics.notification({ type: this.NotificationType.Warning });
        } else {
            this.webVibrate([100, 50, 100]);
        }
    }

    async error() {
        if (this.isNative && this.Haptics) {
            await this.Haptics.notification({ type: this.NotificationType.Error });
        } else {
            this.webVibrate([100, 50, 100, 50, 100]);
        }
    }
}

// グローバルインスタンスを作成
const hapticsService = new HapticsService();