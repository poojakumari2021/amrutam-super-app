import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/navigation/types';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { ScreenSection } from '@/shared/components/ScreenSection';
import type { Locale } from '@/core/i18n/translations';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

type ThemeMode = 'light' | 'dark' | 'system';

function OptionRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors, spacing, borderRadius } = useTheme();

  return (
    <View style={[styles.optionRow, { gap: spacing.gutter, rowGap: spacing.gutter }]}>
      {options.map(option => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              {
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary + '18' : colors.surface,
                borderRadius: borderRadius.sm,
              },
            ]}>
            <AppText
              variant="label"
              color={selected ? colors.primary : colors.textSecondary}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SettingsScreen({}: Props) {
  const { colors, spacing, mode, setMode } = useTheme();
  const { locale, setLocale, t } = useI18n();

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <ScreenHeader
          title={t('settings.title')}
          subtitle="v1.0.0 · assignment build"
        />

        <Card elevated style={{ marginBottom: spacing.block }}>
          <ScreenSection title={t('settings.theme')} compact>
            <OptionRow
              value={mode}
              onChange={setMode}
              options={[
                { value: 'light', label: t('settings.light') },
                { value: 'dark', label: t('settings.dark') },
                { value: 'system', label: t('settings.system') },
              ]}
            />
          </ScreenSection>
        </Card>

        <Card elevated style={{ marginBottom: spacing.block }}>
          <ScreenSection title={t('settings.language')} compact>
            <OptionRow<Locale>
              value={locale}
              onChange={setLocale}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'हिन्दी' },
              ]}
            />
          </ScreenSection>
        </Card>

        <AppText
          variant="caption"
          color={colors.textSecondary}
          style={{ textAlign: 'center' }}>
          Amrutam Super App
        </AppText>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'stretch',
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    minWidth: 88,
    alignItems: 'center',
  },
});
