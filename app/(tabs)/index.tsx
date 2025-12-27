import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

type GameState = {
  team1Score: number;
  team2Score: number;
};

export default function BuncoGameController() {
  const systemColorScheme = useColorScheme();
  const [forcedTheme, setForcedTheme] = useState<'light' | 'dark' | null>(null);
  const colorScheme = forcedTheme || systemColorScheme || 'light';

  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2'>('team1');
  const [history, setHistory] = useState<GameState[]>([{ team1Score: 0, team2Score: 0 }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const saveToHistory = (newState: GameState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addPoints = (points: number) => {
    const newState = {
      team1Score: selectedTeam === 'team1' ? team1Score + points : team1Score,
      team2Score: selectedTeam === 'team2' ? team2Score + points : team2Score,
    };
    saveToHistory(newState);
    setTeam1Score(newState.team1Score);
    setTeam2Score(newState.team2Score);
  };

  const clearScores = () => {
    const newState = { team1Score: 0, team2Score: 0 };
    saveToHistory(newState);
    setTeam1Score(0);
    setTeam2Score(0);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setTeam1Score(prevState.team1Score);
      setTeam2Score(prevState.team2Score);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setTeam1Score(nextState.team1Score);
      setTeam2Score(nextState.team2Score);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const setLightMode = () => {
    setForcedTheme('light');
  };

  const setDarkMode = () => {
    setForcedTheme('dark');
  };

  const openSettings = () => {
    Alert.alert(
      'How to Play Bunco',
      '1. Tap on a team score above to select which team to add points to\n\n' +
      '2. Press the scoring buttons to add points to the selected team\n\n' +
      '3. Bunco gives +21 points!\n\n' +
      '4. Use undo/redo arrows in the top bar to correct mistakes\n\n' +
      '5. Press CLEAR SCORES to reset both teams\n\n' +
      '6. Use sun/moon buttons for light/dark mode\n\n\n' +
      'Future settings will include:\n• Change team names\n• Game rules\n• Sound preferences',
      [
        { text: 'OK' }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={undo} style={styles.topBarButton} disabled={historyIndex <= 0}>
            <IconSymbol
              name="arrow.uturn.left"
              size={24}
              color={historyIndex <= 0 ? '#999' : Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={redo} style={styles.topBarButton} disabled={historyIndex >= history.length - 1}>
            <IconSymbol
              name="arrow.uturn.right"
              size={24}
              color={historyIndex >= history.length - 1 ? '#999' : Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={setLightMode} style={styles.topBarButton}>
            <IconSymbol
              name="sun.max.fill"
              size={24}
              color={colorScheme === 'light' ? '#FFD700' : Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={setDarkMode} style={styles.topBarButton}>
            <IconSymbol
              name="moon.fill"
              size={24}
              color={colorScheme === 'dark' ? '#FFD700' : Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={openSettings} style={styles.topBarButton}>
            <IconSymbol
              name="gear"
              size={24}
              color={Colors[colorScheme ?? 'light'].tint}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Team Scores */}
      <View style={styles.teamsContainer}>
        <TouchableOpacity
          style={[
            styles.teamScore,
            selectedTeam === 'team1' && styles.selectedTeam,
            { backgroundColor: Colors[colorScheme ?? 'light'].background }
          ]}
          onPress={() => setSelectedTeam('team1')}
        >
          <ThemedText type="title" style={styles.teamLabel}>Team 1</ThemedText>
          <ThemedText type="title" style={styles.scoreText}>{team1Score}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.teamScore,
            selectedTeam === 'team2' && styles.selectedTeam,
            { backgroundColor: Colors[colorScheme ?? 'light'].background }
          ]}
          onPress={() => setSelectedTeam('team2')}
        >
          <ThemedText type="title" style={styles.teamLabel}>Team 2</ThemedText>
          <ThemedText type="title" style={styles.scoreText}>{team2Score}</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Scoring Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.scoreButton}
          onPress={() => addPoints(1)}
        >
          <ThemedText type="title" style={styles.buttonText}>+1</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scoreButton}
          onPress={() => addPoints(5)}
        >
          <ThemedText type="title" style={styles.buttonText}>+5</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scoreButton}
          onPress={() => addPoints(11)}
        >
          <ThemedText type="title" style={styles.buttonText}>4, 5, 6</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scoreButton, styles.buncoButton]}
          onPress={() => addPoints(21)}
        >
          <ThemedText type="title" style={styles.buttonText}>BUNCO</ThemedText>
          {/* <ThemedText type="subtitle" style={styles.buttonSubText}>+21</ThemedText> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.scoreButton, styles.clearButton]}
          onPress={clearScores}
        >
          <ThemedText type="title" style={styles.buttonText}>CLEAR SCORES</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 85, // Account for top bar and iPhone notch
  },
  topBar: {
    position: 'absolute',
    top: 35, // Push down more from top to account for iPhone notch
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 1000,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: {
    padding: 8,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginHorizontal: 20,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 140, // Increased height for better vertical fit
  },
  selectedTeam: {
    borderColor: '#0a7ea4',
  },
  teamLabel: {
    marginBottom: 15,
    fontSize: 20,
  },
  scoreText: {
    fontSize: 33, // Reduced from 48 for better iPhone fit
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  scoreButton: {
    width: '85%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buncoButton: {
    backgroundColor: '#FFD700',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSubText: {
    fontSize: 14,
    marginTop: 5,
    color: '#000',
  },

});
