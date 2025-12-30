import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSettings } from '@/hooks/use-settings';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function MenuScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const systemColorScheme = useColorScheme();
  const { settings, updateSettings } = useSettings();
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem('forced_theme');
        if (stored !== null) {
          setTheme(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  const colorScheme: 'light' | 'dark' = (theme || systemColorScheme || 'light') as 'light' | 'dark';

  const setThemeAndSave = async (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('forced_theme', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  const toggleHaptics = (value: boolean) => {
    updateSettings({ hapticsEnabled: value });
  };

  return (
    <ThemedView style={styles.container} colorScheme={colorScheme}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle} colorScheme={colorScheme}>Settings</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView style={[styles.scrollView, styles.content]}>
        {/* How to Play Section */}
        <View style={[styles.section, { backgroundColor: Colors[colorScheme].sectionBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle} colorScheme={colorScheme}>How to Play</ThemedText>
          <ThemedText style={styles.instructions} colorScheme={colorScheme}>
            1. Tap on a team score above to select which team to add points to{'\n\n'}
            2. Press the scoring buttons to add points to the selected team{'\n\n'}
            3. Bunco gives +21 points!{'\n\n'}
            4. Use undo/redo arrows in the top bar to correct mistakes{'\n\n'}
            5. Press CLEAR SCORES to reset both teams
          </ThemedText>
        </View>

        {/* Haptics Section */}
        <View style={[styles.section, { backgroundColor: Colors[colorScheme].sectionBackground }]}>
          <View style={styles.settingRow}>
            <ThemedText style={styles.settingLabel} colorScheme={colorScheme}>Haptic Feedback</ThemedText>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#767577', true: Colors[colorScheme].tint }}
              thumbColor={settings.hapticsEnabled ? Colors[colorScheme].background : '#f4f3f4'}
            />
          </View>
          {/* Subtext for haptic feedback */}
          {/* <ThemedText style={[styles.settingDescription, { color: Colors[colorScheme].icon }]} colorScheme={colorScheme}>
            Enable vibration feedback when pressing buttons
          </ThemedText> */}
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: Colors[colorScheme].sectionBackground }]}>
          <ThemedText style={styles.sectionTitle} colorScheme={colorScheme}>Appearance</ThemedText>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'light' && styles.selectedTheme,
                { backgroundColor: Colors[colorScheme].background }
              ]}
              onPress={() => setThemeAndSave('light')}
              onPressIn={() => {
                if (settings.hapticsEnabled && process.env.EXPO_OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <IconSymbol name="sun.max.fill" size={24} color={theme === 'light' ? '#FFD700' : Colors[colorScheme].tint} />
              <ThemedText style={styles.themeLabel} colorScheme={colorScheme}>Light</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                theme === 'dark' && styles.selectedTheme,
                { backgroundColor: Colors[colorScheme].background }
              ]}
              onPress={() => setThemeAndSave('dark')}
              onPressIn={() => {
                if (settings.hapticsEnabled && process.env.EXPO_OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <IconSymbol name="moon.fill" size={24} color={theme === 'dark' ? '#FFD700' : Colors[colorScheme].tint} />
              <ThemedText style={styles.themeLabel} colorScheme={colorScheme}>Dark</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50, // Account for status bar
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c6c6c8',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44, // Match back button width for centering
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 17,
  },
  settingDescription: {
    fontSize: 13,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTheme: {
    borderColor: '#0a7ea4',
  },
  themeLabel: {
    marginTop: 8,
    fontSize: 16,
  },
});