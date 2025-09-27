import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';

export function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAppContext();
  const { theme } = useTheme();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedRole, setEditedRole] = useState('Analyzer');

  const handleSaveProfile = () => {
    // Here you would call an API to update the profile
    console.log('Saving profile:', { name: editedName, role: editedRole });
    setIsEditModalVisible(false);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <MainLayout title="Profile" leftIcon="back" onLeftPress={handleBackPress}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/images/illustrations/user.png')}
              style={styles.profileImage}
            />
            <View
              style={[
                styles.statusIndicator,
                { borderColor: theme.colors.background },
              ]}
            >
              <Text style={styles.statusIcon}>⚡</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || 'Angelica Jackson'}
            </Text>
            <Text style={[styles.userRole, { color: theme.colors.secondary }]}>
              Analyzer
            </Text>
            <TouchableOpacity
              style={styles.changeProfileButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text
                style={[
                  styles.changeProfileText,
                  { color: theme.colors.secondary },
                ]}
              >
                Change profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Strong Side Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.secondary }]}
          >
            Strong side:
          </Text>
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, styles.tagBlue]}>
              <Text style={styles.tagText}>Analytics</Text>
            </View>
            <View style={[styles.tag, styles.tagGreen]}>
              <Text style={styles.tagText}>Perfectionism</Text>
            </View>
            <View style={[styles.tag, styles.tagBlue]}>
              <Text style={styles.tagText}>Analytics</Text>
            </View>
          </View>
        </View>

        {/* Weak Side Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.secondary }]}
          >
            Weak side:
          </Text>
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, styles.tagPink]}>
              <Text style={styles.tagText}>Perfectionism</Text>
            </View>
            <View style={[styles.tag, styles.tagOrange]}>
              <Text style={styles.tagText}>Analytics</Text>
            </View>
          </View>
        </View>

        {/* My Reports Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.secondary }]}
          >
            My Reports:
          </Text>

          {/* Reports Grid */}
          <View style={styles.reportsGrid}>
            {/* Row 1 */}
            <View style={styles.reportsRow}>
              <TouchableOpacity
                style={[
                  styles.reportCard,
                  styles.reportCard1,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.reportBookmark}>
                  <Text style={styles.bookmarkIcon}>🔖</Text>
                </View>
                <View style={styles.reportIcon}>
                  <Text style={styles.reportIconText}>👤</Text>
                </View>
                <Text
                  style={[styles.reportTitle, { color: theme.colors.text }]}
                >
                  Astro- psychological report
                </Text>
                <Text
                  style={[
                    styles.reportDescription,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Some short description of this type of report.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reportCard,
                  styles.reportCard2,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.reportBookmark}>
                  <Text style={styles.bookmarkIcon}>🔖</Text>
                </View>
                <View style={styles.reportIcon}>
                  <Text style={styles.reportIconText}>📅</Text>
                </View>
                <Text
                  style={[styles.reportTitle, { color: theme.colors.text }]}
                >
                  Monthly prediction report
                </Text>
                <Text
                  style={[
                    styles.reportDescription,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Some short description of this type of report.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={styles.reportsRow}>
              <TouchableOpacity
                style={[
                  styles.reportCard,
                  styles.reportCard3,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.reportBookmark}>
                  <Text style={styles.bookmarkIcon}>🔖</Text>
                </View>
                <View style={styles.reportIcon}>
                  <Text style={styles.reportIconText}>✅</Text>
                </View>
                <Text
                  style={[styles.reportTitle, { color: theme.colors.text }]}
                >
                  Daily Prediction
                </Text>
                <Text
                  style={[
                    styles.reportDescription,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Some short description of this type of report.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reportCard,
                  styles.reportCard4,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.reportBookmark}>
                  <Text style={styles.bookmarkIcon}>🔖</Text>
                </View>
                <View style={styles.reportIcon}>
                  <Text style={styles.reportIconText}>💝</Text>
                </View>
                <Text
                  style={[styles.reportTitle, { color: theme.colors.text }]}
                >
                  Love report
                </Text>
                <Text
                  style={[
                    styles.reportDescription,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Some short description of this type of report.
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
              <Text
                style={[styles.modalCancel, { color: theme.colors.secondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Edit Profile
            </Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Name
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Role
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                value={editedRole}
                onChangeText={setEditedRole}
                placeholder="Enter your role"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.disabledInput,
                  {
                    backgroundColor: theme.colors.border,
                    color: theme.colors.secondary,
                  },
                ]}
                value={user?.email}
                editable={false}
                placeholder="Email (read-only)"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusIcon: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  changeProfileButton: {
    alignSelf: 'flex-start',
  },
  changeProfileText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagBlue: {
    backgroundColor: '#E0F2FE',
  },
  tagGreen: {
    backgroundColor: '#DCFCE7',
  },
  tagPink: {
    backgroundColor: '#FCE7F3',
  },
  tagOrange: {
    backgroundColor: '#FED7AA',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  reportsGrid: {
    gap: 15,
  },
  reportsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  reportCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
    minHeight: 150,
  },
  reportCard1: {
    backgroundColor: '#F0F9FF',
  },
  reportCard2: {
    backgroundColor: '#ECFDF5',
  },
  reportCard3: {
    backgroundColor: '#FEF2F2',
  },
  reportCard4: {
    backgroundColor: '#FDF2F8',
  },
  reportBookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  reportIcon: {
    marginBottom: 15,
  },
  reportIconText: {
    fontSize: 24,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  reportDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalCancel: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSave: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
});
