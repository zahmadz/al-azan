import {i18n} from '@lingui/core';
import {t} from '@lingui/macro';
import {PolarCircleResolution, HighLatitudeRule, Madhab, Shafaq} from 'adhan';
import {VStack, IStackProps, Select, FormControl, Accordion} from 'native-base';

import {CalculationMethods} from '@/adhan';
import {MenuIcon} from '@/assets/icons/menu';
import {
  ASR_CALCULATION,
  CALCULATION_METHOD_KEY,
  HIGH_LATITUDE_RULE,
  POLAR_RESOLUTION,
  SHAFAQ,
} from '@/constants/settings';
import {isRTL} from '@/i18n';
import {useStoreHelper} from '@/store/settings';

export function CalculationSettings(props: IStackProps) {
  const [calculationMethodKey, setCalculationMethodKey] =
    useStoreHelper<string>(CALCULATION_METHOD_KEY);

  const [highLatitudeRuleSetting, setHighLatitudeRuleSetting] =
    useStoreHelper<string>(HIGH_LATITUDE_RULE);

  const [asrCalculationSetting, setAsrCalculationSetting] =
    useStoreHelper<string>(ASR_CALCULATION);

  const [polarResolutionSetting, setPolarResolutionSetting] =
    useStoreHelper<string>(POLAR_RESOLUTION);

  const [shafaqSetting, setShafaqSetting] = useStoreHelper<string>(SHAFAQ);

  const calculationMethodKeyChanged = (itemValue: string) => {
    setCalculationMethodKey(itemValue);
  };

  const highLatitudeSettingChanged = (itemValue: string) => {
    setHighLatitudeRuleSetting(itemValue);
  };

  const asrCalculationSettingChanged = (itemValue: string) => {
    setAsrCalculationSetting(itemValue);
  };

  const polarResolutionSettingChanged = (itemValue: string) => {
    setPolarResolutionSetting(itemValue);
  };

  const shafaqSettingChanged = (itemValue: string) => {
    setShafaqSetting(itemValue);
  };

  return (
    <VStack p="4" {...props}>
      <FormControl mb="3">
        <FormControl.Label flexDirection={isRTL ? 'row-reverse' : 'row'} m="0">
          {t`Calculation Method`}:
        </FormControl.Label>
        <Select
          selectedValue={calculationMethodKey}
          accessibilityLabel={t`Choose Calculation Method`}
          onValueChange={calculationMethodKeyChanged}>
          {Object.keys(CalculationMethods).map(key => (
            <Select.Item
              label={i18n._((CalculationMethods as any)[key].label)}
              value={key}
              key={key}
            />
          ))}
        </Select>
      </FormControl>
      <Accordion mb="5" borderRadius={0}>
        <Accordion.Item>
          <Accordion.Summary>
            {t`Advanced Calculation Settings`}
            <MenuIcon></MenuIcon>
          </Accordion.Summary>
          <Accordion.Details>
            <FormControl mb="3">
              <FormControl.Label
                flexDirection={isRTL ? 'row-reverse' : 'row'}
                m="0">
                {t`High Latitude`}:
              </FormControl.Label>
              <Select
                accessibilityLabel={t`Choose High Latitude Setting`}
                selectedValue={highLatitudeRuleSetting || 'none'}
                onValueChange={highLatitudeSettingChanged}
                flex="1">
                <Select.Item label={t`None (Automatic)`} value="none" />
                <Select.Item
                  label={t`Middle of the Night`}
                  value={HighLatitudeRule.MiddleOfTheNight}
                />
                <Select.Item
                  label={t`One-Seventh of the Night`}
                  value={HighLatitudeRule.SeventhOfTheNight}
                />
                <Select.Item
                  label={t`Twilight Angle`}
                  value={HighLatitudeRule.TwilightAngle}
                />
              </Select>
            </FormControl>
            <FormControl mb="3">
              <FormControl.Label
                flexDirection={isRTL ? 'row-reverse' : 'row'}
                m="0">
                {t`Asr Calculation`}:
              </FormControl.Label>
              <Select
                accessibilityLabel={t`Choose Asr Calculation Madhab`}
                selectedValue={asrCalculationSetting || Madhab.Shafi}
                onValueChange={asrCalculationSettingChanged}
                flex="1">
                <Select.Item label={t`Shafi (Default)`} value={Madhab.Shafi} />
                <Select.Item label="{t`Hanafi`}" value={Madhab.Hanafi} />
              </Select>
            </FormControl>
            <FormControl mb="3">
              <FormControl.Label
                flexDirection={isRTL ? 'row-reverse' : 'row'}
                m="0">
                {t`Polar Resolution`}:
              </FormControl.Label>
              <Select
                accessibilityLabel={t`Choose Polar Resolution`}
                onValueChange={polarResolutionSettingChanged}
                selectedValue={
                  polarResolutionSetting || PolarCircleResolution.Unresolved
                }
                flex="1">
                <Select.Item
                  label={t`Unresolved (default)`}
                  value={PolarCircleResolution.Unresolved}
                />
                <Select.Item
                  label={t`Closest City`}
                  value={PolarCircleResolution.AqrabBalad}
                />
                <Select.Item
                  label={t`Closest Date`}
                  value={PolarCircleResolution.AqrabYaum}
                />
              </Select>
            </FormControl>
            <FormControl mb="3">
              <FormControl.Label
                flexDirection={isRTL ? 'row-reverse' : 'row'}
                m="0">
                {t`Shafaq`}:
              </FormControl.Label>
              <FormControl.HelperText my="0">
                {t`Shafaq is used by the MoonsightingCommittee method to 
              determine what type of twilight to use in order to
              determine the time for Isha`}
              </FormControl.HelperText>
              <Select
                mt="1"
                accessibilityLabel={t`Choose Shafaq method`}
                onValueChange={shafaqSettingChanged}
                selectedValue={shafaqSetting || Shafaq.General}
                flex="1">
                <Select.Item
                  label={t`General (default)`}
                  value={Shafaq.General}
                />
                <Select.Item label={t`Ahmer`} value={Shafaq.Ahmer} />
                <Select.Item label={t`Abyad`} value={Shafaq.Abyad} />
              </Select>
            </FormControl>
          </Accordion.Details>
        </Accordion.Item>
      </Accordion>
    </VStack>
  );
}