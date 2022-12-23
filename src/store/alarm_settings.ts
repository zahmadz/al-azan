import {produce} from 'immer';
import {useCallback} from 'react';
import create from 'zustand';
import {persist} from 'zustand/middleware';
import createVanilla from 'zustand/vanilla';
import {zustandStorage} from './mmkv';
import {Prayer, PrayersInOrder} from '@/adhan';

const ALARM_SETTINGS_STORAGE_KEY = 'ALARM_SETTINGS_STORAGE';

export const ADHAN_NOTIFICATION_SUFFIX = '_NOTIFY';
export const ADHAN_SOUND_SUFFIX = '_SOUND';
export const ADHAN_ADJUSTMENT_SUFFIX = '_ADJUSTMENT';

export function getAdhanSettingKey(
  prayer: Prayer,
  k: 'sound' | 'notify' | 'adjustment',
): keyof AlarmSettingsStore {
  if (k === 'adjustment') {
    return (prayer.toUpperCase() +
      ADHAN_ADJUSTMENT_SUFFIX) as keyof AlarmSettingsStore;
  } else if (k === 'notify') {
    return (prayer.toUpperCase() +
      ADHAN_NOTIFICATION_SUFFIX) as keyof AlarmSettingsStore;
  } else {
    return (prayer.toUpperCase() +
      ADHAN_SOUND_SUFFIX) as keyof AlarmSettingsStore;
  }
}

export type AlarmSettingsStore = {
  //prayer notification settings
  FAJR_NOTIFY?: boolean;
  SUNRISE_NOTIFY?: boolean;
  DHUHR_NOTIFY?: boolean;
  ASR_NOTIFY?: boolean;
  SUNSET_NOTIFY?: boolean;
  MAGHRIB_NOTIFY?: boolean;
  ISHA_NOTIFY?: boolean;
  MIDNIGHT_NOTIFY?: boolean;
  // prayer sound settings
  FAJR_SOUND?: boolean;
  SUNRISE_SOUND?: boolean;
  DHUHR_SOUND?: boolean;
  ASR_SOUND?: boolean;
  SUNSET_SOUND?: boolean;
  MAGHRIB_SOUND?: boolean;
  ISHA_SOUND?: boolean;
  MIDNIGHT_SOUND?: boolean;

  setSetting: <T extends keyof AlarmSettingsStore>(
    key: T,
    val: AlarmSettingsStore[T],
  ) => void;
  setSettingCurry: <T extends keyof AlarmSettingsStore>(
    key: T,
  ) => (val: AlarmSettingsStore[T]) => void;
  removeSetting: (key: keyof AlarmSettingsStore) => () => void;
};

const invalidKeys = ['setSetting', 'setSettingCurry', 'removeSetting'];

export const alarmSettings = createVanilla<AlarmSettingsStore>()(
  persist(
    set => ({
      // general
      setSetting: <T extends keyof AlarmSettingsStore>(
        key: T,
        val: AlarmSettingsStore[T],
      ) =>
        set(
          produce<AlarmSettingsStore>(draft => {
            if (invalidKeys.includes(key)) return;
            draft[key] = val;
          }),
        ),
      setSettingCurry:
        <T extends keyof AlarmSettingsStore>(key: T) =>
        (val: AlarmSettingsStore[T]) =>
          set(
            produce<AlarmSettingsStore>(draft => {
              if (invalidKeys.includes(key)) return;
              draft[key] = val;
            }),
          ),
      removeSetting: key => () =>
        set(
          produce<AlarmSettingsStore>(draft => {
            if (invalidKeys.includes(key)) return;
            delete draft[key];
          }),
        ),
    }),
    {
      name: ALARM_SETTINGS_STORAGE_KEY,
      getStorage: () => zustandStorage,
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !invalidKeys.includes(key)),
        ),
      version: 0,
      migrate: (persistedState, version) => {
        /* eslint-disable no-fallthrough */
        // fall through cases is exactly the use case for migration.
        switch (version) {
          case 0:
            // this will be run when storage version is changed to 1
            break;
        }
        /* eslint-enable no-fallthrough */
        return persistedState as AlarmSettingsStore;
      },
    },
  ),
);

export const useAlarmSettings = create(alarmSettings);

export function useAlarmSettingsHelper<T extends keyof AlarmSettingsStore>(
  key: T,
) {
  const state = useAlarmSettings(s => s[key]);
  const setterCurry = useAlarmSettings(s => s.setSettingCurry);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setCallback = useCallback(setterCurry(key), [key]);
  return [state, setCallback] as [
    AlarmSettingsStore[T],
    (val: AlarmSettingsStore[T]) => void,
  ];
}

export function hasAtLeastOneNotificationSetting() {
  for (let prayer of PrayersInOrder) {
    if (alarmSettings.getState()[getAdhanSettingKey(prayer, 'notify')]) {
      return true;
    }
  }
  return false;
}