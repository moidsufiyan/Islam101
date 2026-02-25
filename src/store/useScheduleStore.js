import { create } from 'zustand';
import { persist } from 'zustand/middleware';



const fetchPrayerTimes = async (city, country) => {
    try {
        const res = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`
        );
        const data = await res.json();
        if (data.code === 200) {
            const t = data.data.timings;
            return {
                Fajr: t.Fajr,
                Dhuhr: t.Dhuhr,
                Asr: t.Asr,
                Maghrib: t.Maghrib,
                Isha: t.Isha,
                Sunrise: t.Sunrise,
            };
        }
        return null;
    } catch (e) {
        console.error('Failed to fetch prayer times:', e);
        return null;
    }
};



const toMinutes = (timeStr) => {
    const [h, m] = timeStr.replace(/ \(.*\)/, '').split(':').map(Number);
    return h * 60 + m;
};



const toTimeString = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
};



const computeSmartAlarms = (prayerTimes, scheduleBlocks) => {
    if (!prayerTimes) return [];

    const prayers = [
        { name: 'Fajr', start: prayerTimes.Fajr, end: prayerTimes.Sunrise },
        { name: 'Dhuhr', start: prayerTimes.Dhuhr, end: prayerTimes.Asr },
        { name: 'Asr', start: prayerTimes.Asr, end: prayerTimes.Maghrib },
        { name: 'Maghrib', start: prayerTimes.Maghrib, end: prayerTimes.Isha },
        { name: 'Isha', start: prayerTimes.Isha, end: '23:59' },
    ];

    const alarms = [];

    for (const prayer of prayers) {
        const prS = toMinutes(prayer.start);
        const prE = toMinutes(prayer.end);

        let bestTime = prS;
        let hasConflict = false;
        let conflictEndTime = null;
        let conflictName = '';

        for (const block of scheduleBlocks) {
            const bS = toMinutes(block.start);
            const bE = toMinutes(block.end);

            if (bS <= prS && bE > prS) {
                hasConflict = true;
                conflictEndTime = bE;
                conflictName = block.name;
                bestTime = Math.min(bE + 5, prE);
            }
        }

        for (const block of scheduleBlocks) {
            const bS = toMinutes(block.start);
            const bE = toMinutes(block.end);
            if (bS <= bestTime && bE > bestTime) {
                bestTime = Math.min(bE + 5, prE);
            }
        }

        let nextBlockName = null;
        let nextBlockStart = null;
        for (const block of scheduleBlocks) {
            const bS = toMinutes(block.start);
            if (bS > bestTime && bS <= prE) {
                if (!nextBlockStart || bS < nextBlockStart) {
                    nextBlockStart = bS;
                    nextBlockName = block.name;
                }
            }
        }

        const suggestedTime = toTimeString(bestTime);
        let message = '';
        if (hasConflict) {
            if (nextBlockName) {
                message = `You're free after ${conflictName}. Pray ${prayer.name} before your ${nextBlockName} at ${toTimeString(nextBlockStart)}.`;
            } else {
                message = `Your ${conflictName} ends — great time to pray ${prayer.name}!`;
            }
        } else {
            if (nextBlockName) {
                message = `Free window now before your ${nextBlockName} at ${toTimeString(nextBlockStart)}. Good time for ${prayer.name}!`;
            } else {
                message = `You have a free window. Good time for ${prayer.name}!`;
            }
        }

        alarms.push({
            prayer: prayer.name,
            originalTime: toTimeString(prS),
            suggestedTime,
            endTime: toTimeString(prE),
            hasConflict,
            message,
            bestTimeMinutes: bestTime,
        });
    }

    return alarms;
};

export const useScheduleStore = create(
    persist(
        (set, get) => ({
            city: '',
            country: '',
            prayerTimes: null,
            scheduleBlocks: [],
            smartAlarms: [],
            isLoading: false,
            error: null,

            setLocation: async (city, country) => {
                set({ city, country, isLoading: true, error: null });
                const times = await fetchPrayerTimes(city, country);
                if (times) {
                    set({ prayerTimes: times, isLoading: false });
                    const alarms = computeSmartAlarms(times, get().scheduleBlocks);
                    set({ smartAlarms: alarms });
                } else {
                    set({ error: 'Failed to fetch prayer times. Check your city name.', isLoading: false });
                }
            },

            addBlock: (block) => {
                const blocks = [...get().scheduleBlocks, block];
                set({ scheduleBlocks: blocks });
                if (get().prayerTimes) {
                    set({ smartAlarms: computeSmartAlarms(get().prayerTimes, blocks) });
                }
            },

            removeBlock: (index) => {
                const blocks = get().scheduleBlocks.filter((_, i) => i !== index);
                set({ scheduleBlocks: blocks });
                if (get().prayerTimes) {
                    set({ smartAlarms: computeSmartAlarms(get().prayerTimes, blocks) });
                }
            },

            refreshPrayerTimes: async () => {
                const { city, country } = get();
                if (city && country) {
                    const times = await fetchPrayerTimes(city, country);
                    if (times) {
                        set({ prayerTimes: times });
                        const alarms = computeSmartAlarms(times, get().scheduleBlocks);
                        set({ smartAlarms: alarms });
                    }
                }
            },
        }),
        {
            name: 'islam101-schedule',
            partialize: (state) => ({
                city: state.city,
                country: state.country,
                scheduleBlocks: state.scheduleBlocks,
            }),
        }
    )
);

