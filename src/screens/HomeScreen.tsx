import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';

export function HomeScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAppContext();
  const { theme } = useTheme();

  const renderBottomNav = () => (
    <>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => (navigation as any).navigate('Profile')}
      >
        <Text style={styles.navIcon}>👤</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>💬</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Text style={styles.navIcon}>📊</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={logout}>
        <Text style={styles.navIcon}>🌙</Text>
      </TouchableOpacity>
    </>
  );

  const renderContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* News Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
          News
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.newsScroll}
        >
          <View style={[styles.newsCard, styles.newsCard1]}>
            <Text style={styles.newsTitle}>Short news title will be here</Text>
            <View style={styles.newsDecoration}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={[styles.newsCard, styles.newsCard2]}>
            <Text style={styles.newsTitle}>Short news title will be here</Text>
            <View style={styles.newsDecoration}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={[styles.newsCard, styles.newsCard3]}>
            <Text style={styles.newsTitle}>Short news title will be here</Text>
            <View style={styles.newsDecoration}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Daily Tasks Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>
          Daily Tasks:
        </Text>
        <View style={styles.tasksContainer}>
          <View
            style={[styles.taskCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={styles.taskLabel}>Daily astromeditation</Text>
            <View style={styles.taskNumberContainer}>
              <Text style={styles.taskNumber}>3</Text>
              <View style={styles.taskIcon}>
                <Text style={styles.taskIconText}>🧘</Text>
              </View>
            </View>
          </View>

          <View
            style={[styles.taskCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.taskLabel, styles.taskLabelRed]}>
              Daily sleep astromeditation
            </Text>
            <View style={styles.taskNumberContainer}>
              <Text style={[styles.taskNumber, styles.taskNumberRed]}>1</Text>
              <View style={styles.taskIcon}>
                <Text style={styles.taskIconText}>😴</Text>
              </View>
            </View>
          </View>

          <View
            style={[styles.taskCard, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.taskLabel, styles.taskLabelGreen]}>
              Daily mantra
            </Text>
            <View style={styles.taskNumberContainer}>
              <Text style={[styles.taskNumber, styles.taskNumberGreen]}>2</Text>
              <View style={styles.taskIcon}>
                <Text style={styles.taskIconText}>🕉️</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.section}>
        <Text style={[styles.progressText, { color: theme.colors.secondary }]}>
          Your overall progress is{' '}
          <Text style={styles.progressPercentage}>60%</Text>
        </Text>
        <View
          style={[styles.progressBar, { backgroundColor: theme.colors.border }]}
        >
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Daily Question Section */}
      <TouchableOpacity
        style={[styles.questionCard, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.questionIcon}>📅</Text>
          <View style={styles.questionContent}>
            <Text style={[styles.questionTitle, { color: theme.colors.text }]}>
              How was your day?
            </Text>
            <Text
              style={[
                styles.questionSubtitle,
                { color: theme.colors.secondary },
              ]}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel
              odio en urna ultrices...
            </Text>
          </View>
          <Text
            style={[styles.questionArrow, { color: theme.colors.secondary }]}
          >
            ›
          </Text>
        </View>
      </TouchableOpacity>

      {/* Current Transit Section */}
      <TouchableOpacity
        style={[styles.transitCard, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.transitHeader}>
          <Text style={styles.transitIcon}>🕐</Text>
          <View style={styles.transitContent}>
            <Text style={styles.transitTitle}>Current Transit: 3rd House</Text>
            <Text
              style={[
                styles.transitSubtitle,
                { color: theme.colors.secondary },
              ]}
            >
              This is demonstrate siblings, hobbies, efforts, confidence,
              friends and short tr...
            </Text>
          </View>
          <Text
            style={[styles.transitArrow, { color: theme.colors.secondary }]}
          >
            ›
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <MainLayout
      title="Home"
      showBottomNav={true}
      bottomNavContent={renderBottomNav()}
    >
      {renderContent()}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  newsScroll: {
    marginLeft: -5,
  },
  newsCard: {
    width: 180,
    height: 120,
    borderRadius: 20,
    padding: 20,
    marginRight: 15,
    justifyContent: 'space-between',
  },
  newsCard1: {
    backgroundColor: '#6B46C1',
  },
  newsCard2: {
    backgroundColor: '#059669',
  },
  newsCard3: {
    backgroundColor: '#DC2626',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  newsDecoration: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
  },
  tasksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  taskLabel: {
    fontSize: 12,
    color: '#6B46C1',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  taskLabelRed: {
    color: '#DC2626',
  },
  taskLabelGreen: {
    color: '#059669',
  },
  taskNumberContainer: {
    alignItems: 'center',
  },
  taskNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  taskNumberRed: {
    color: '#DC2626',
  },
  taskNumberGreen: {
    color: '#059669',
  },
  taskIcon: {
    marginTop: 5,
  },
  taskIconText: {
    fontSize: 16,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  progressPercentage: {
    color: '#EC4899',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  questionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  questionContent: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  questionArrow: {
    fontSize: 20,
    color: '#666',
  },
  transitCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  transitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  transitContent: {
    flex: 1,
  },
  transitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 5,
  },
  transitSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  transitArrow: {
    fontSize: 20,
    color: '#666',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  navIcon: {
    fontSize: 24,
  },
});
