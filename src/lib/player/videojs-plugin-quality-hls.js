import videojs from 'video.js';

const SettingOptionItem = videojs.getComponent('SettingOptionItem');

class QualityHlsSettingItem extends SettingOptionItem {
    maxQuality = 0;

    constructor(player, options) {
        super(player, {
            ...options,
            name: 'QualityHlsSettingItem',
            label: 'Quality',
            icon: 'vjs-icon-hd'
        });

        this.maxQuality = options.maxQuality || player.options().maxQuality || 0;

        this.addClass('vjs-setting-quality');

        this.levels = [];

        this.handleAllLevelsAdded();
    }

    handleAllLevelsAdded() {
        const player = this.player_;

        if (!player) {
            return false;
        }

        if (!player.qualityLevels) {
            console.error('plugin videojs-contrib-quality-levels do not exsits');

            return false;
        }

        const qualityLevels = player.qualityLevels();
        let levels = [];
        let timeout;

        qualityLevels.on('addqualitylevel', ({ qualityLevel }) => {
            clearTimeout(timeout);

            levels.push(formatQualityLevel(qualityLevel, this.maxQuality));

            const callback = () => {
                this.levels = levels.slice(0);

                player.trigger('before-quality-setup', {
                    levels: this.levels
                });

                this.onAllLevelsAdded();

                levels = [];
            };

            timeout = setTimeout(callback, 10);
        });

        // Prevent the quality level from being changed to a level that is higher than the max quality
        qualityLevels.on('change', () => {
            if (this.maxQuality > 0 && qualityLevels[qualityLevels.selectedIndex].height > this.maxQuality) {
                const maxSelectableIndex = this.levels.findLastIndex(lv => (lv.height <= this.maxQuality));
                if (maxSelectableIndex >= 0 && maxSelectableIndex !== qualityLevels.selectedIndex) {
                    this.levels.map(lv => {
                        lv.enabled = lv.height <= this.maxQuality;
                    });
                    qualityLevels.selectedIndex_ = maxSelectableIndex;
                    qualityLevels.trigger({ type: 'change', selectedIndex: maxSelectableIndex });
                }
            }
        });
    }

    onAllLevelsAdded() {
        const entries = [
            ...this.levels
                .map(({ height, label }) => {
                    return {
                        label: label,
                        value: height,
                        default: false
                    };
                })
                .sort((a, b) => b.value - a.value),
            {
                label: 'Auto',
                value: 'auto',
                default: true
            }
        ];

        if (this.levels.length > 1) {
            // use auto as default
            this.setEntries(entries, entries.length - 1);

            this.show();

            this.player_.trigger('hls-quality', this.levels);
        } else {
            this.hide();
        }
    }

    onChange(...args) {
        const index = this.maxQualityBoundary(args[0].index);
        args[0].index = index;
        super.onChange(...args);

        const value = this.selected.value;

        this.levels.forEach(lv => {
            lv.enabled = lv.height === value || value === 'auto';
        });

        this.player_.trigger(
            'hls-qualitychange',
            this.entries.reduce((acc, entry, index) => {
                if (entry.value === value) {
                    const level = this.levels.find(v => v.height === value) || {};

                    acc = {
                        index,
                        level,
                        ...entry
                    };
                }

                return acc;
            }, {})
        );
    }

    maxQualityBoundary(index) {
        const selected = this.entries[index].value;
        if (this.maxQuality <= 0 || selected === 'auto' || selected <= this.maxQuality) {
            return index;
        }
        const maxSelectableIndex = this.entries.findIndex(e => (e.value <= this.maxQuality));
        if (maxSelectableIndex >= 0) {
            return maxSelectableIndex;
        }
        return index;
    }
}

videojs
    .getComponent('SettingMenuButton')
    .prototype.options_.entries.push('QualityHlsSettingItem');

videojs.registerComponent('QualityHlsSettingItem', QualityHlsSettingItem);

export default QualityHlsSettingItem;

function formatQualityLevel(lv, maxQuality = 0) {
    const quality = Math.min(lv.width, lv.height);
    if (maxQuality > 0 && quality > maxQuality) {
        lv.label = `${quality}p (Pro)`;
        lv.enabled = false;
    } else {
        lv.label = `${quality}p`;
    }
    return lv;
}