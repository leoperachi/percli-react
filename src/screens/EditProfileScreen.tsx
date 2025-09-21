import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAppContext();
  const { theme } = useTheme();

  // Form state
  const [aboutUs, setAboutUs] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    console.log('Saving profile:', {
      aboutUs,
      phoneNo,
      gender,
      city,
    });

    Alert.alert(
      'Profile Updated',
      'Your profile information has been saved successfully.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Account deleted');
            logout();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section - Verde com curvatura */}
      <View style={styles.header}>
        <SafeAreaView>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../assets/images/illustrations/user.png')}
                style={styles.profileImage}
              />
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </View>

            <Text style={styles.userName}>{user?.name || 'Arif Çağlar'}</Text>
            <Text style={styles.userEmail}>
              {user?.email || 'support@mobiroller.com'}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* White content area */}
      <View
        style={[
          styles.contentArea,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>
            Profile Informations
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E5E5',
                  color: theme.colors.text,
                },
              ]}
              placeholder="About Us"
              placeholderTextColor="#B0B0B0"
              value={aboutUs}
              onChangeText={setAboutUs}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E5E5',
                  color: theme.colors.text,
                },
              ]}
              placeholder="Phone No"
              placeholderTextColor="#B0B0B0"
              value={phoneNo}
              onChangeText={setPhoneNo}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E5E5',
                  color: theme.colors.text,
                },
              ]}
              placeholder="Gender"
              placeholderTextColor="#B0B0B0"
              value={gender}
              onChangeText={setGender}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E5E5',
                  color: theme.colors.text,
                },
              ]}
              placeholder="City"
              placeholderTextColor="#B0B0B0"
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          {/* Delete Account */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Cinza claro
  },
  header: {
    backgroundColor: '#F5F5F5',
    paddingBottom: 60,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 28,
    fontWeight: '300',
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#333333',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F5F5F5',
  },
  cameraIconText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  userName: {
    color: '#333333',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -40, // Sobrepor um pouco o header
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 35,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#000000',
    minHeight: 60,
  },
  saveButton: {
    backgroundColor: '#2C5530', // Verde escuro da imagem
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 25,
    marginHorizontal: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 40,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
});
