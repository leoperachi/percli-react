import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  launchImageLibrary,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { ProfilePhoto } from '../components/profilePhoto';
import apiService from '../services/apiService';

const { width, height } = Dimensions.get('window');

export function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, updateUser } = useAppContext();
  const { theme } = useTheme();

  // Form state
  const [aboutUs, setAboutUs] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | null>(
    user?.profilePhoto || null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permissão de Galeria',
            message:
              'Este app precisa acessar sua galeria para selecionar fotos.',
            buttonNeutral: 'Perguntar depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const convertImageToBase64 = (imageUri: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          const base64 = reader.result as string;
          // Remove o prefixo "data:image/...;base64," para obter apenas o base64
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', imageUri);
      xhr.responseType = 'blob';
      xhr.send();
    });
  };

  const handleSelectPhoto = async () => {
    console.log('🔥 [DEBUG] handleSelectPhoto called - function started');
    console.log('🔥 [DEBUG] Platform.OS:', Platform.OS);

    const hasPermission = await requestPermissions();
    console.log('🔥 [DEBUG] Permission result:', hasPermission);

    if (!hasPermission) {
      console.log('🔥 [DEBUG] Permission denied, showing alert');
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar sua galeria.',
      );
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.3 as const, // Much lower quality for smaller file size
      maxWidth: 200, // Much smaller max width
      maxHeight: 200, // Much smaller max height
      includeBase64: true,
    };

    console.log('🔥 [DEBUG] Calling launchImageLibrary with options:', options);

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('🔥 [DEBUG] launchImageLibrary response received:', {
        didCancel: response.didCancel,
        errorMessage: response.errorMessage,
        assets: response.assets?.length || 0,
      });
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Erro', 'Erro ao selecionar a imagem');
      } else if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        console.log(
          '🔥 [DEBUG] Original image size:',
          asset.fileSize
            ? `${(asset.fileSize / 1024).toFixed(2)}KB`
            : 'unknown',
        );

        if (asset.base64) {
          console.log('🔥 [DEBUG] Base64 length:', asset.base64.length);
          console.log(
            '🔥 [DEBUG] Estimated size:',
            `${((asset.base64.length * 0.75) / 1024).toFixed(2)}KB`,
          );
          setProfilePhotoBase64(asset.base64);
        } else if (asset.uri) {
          // Fallback: convert URI to base64
          convertImageToBase64(asset.uri)
            .then(base64 => {
              console.log(
                '🔥 [DEBUG] URI converted, size:',
                `${((base64.length * 0.75) / 1024).toFixed(2)}KB`,
              );
              setProfilePhotoBase64(base64);
            })
            .catch(error => {
              console.error('Error converting URI to base64:', error);
              Alert.alert('Erro', 'Erro ao processar a imagem');
            });
        }
      }
    });
  };

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      console.log('Saving profile:', {
        aboutUs,
        phoneNo,
        gender,
        city,
        profilePhoto: profilePhotoBase64,
      });

      // Prepare profile data
      const profileData: any = {};

      // Only include fields that have values
      if (aboutUs.trim()) profileData.aboutUs = aboutUs.trim();
      if (phoneNo.trim()) profileData.phoneNo = phoneNo.trim();
      if (gender.trim()) profileData.gender = gender.trim();
      if (city.trim()) profileData.city = city.trim();
      if (profilePhotoBase64) profileData.profilePhoto = profilePhotoBase64;

      // Include current user data that shouldn't change
      if (user?.name) profileData.name = user.name;
      if (user?.email) profileData.email = user.email;

      console.log('Sending profile data to API:', Object.keys(profileData));

      // Call API to update profile
      const response = await apiService.updateUserProfileWithPhoto(profileData);

      if (response.success) {
        // Update user context with new profile data
        updateUser(profileData);

        Alert.alert(
          'Perfil Atualizado',
          'As informações do seu perfil foram salvas com sucesso.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert(
          'Erro',
          response.error || 'Erro ao atualizar perfil. Tente novamente.',
        );
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        'Erro',
        'Erro inesperado ao salvar perfil. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
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
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => {
                console.log('🔥 [DEBUG] TouchableOpacity onPress triggered');
                handleSelectPhoto();
              }}
              activeOpacity={0.8}
            >
              <ProfilePhoto
                imageBase64={profilePhotoBase64}
                userName={user?.name || 'User'}
                size={120}
                style={styles.profileImage}
              />
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </TouchableOpacity>

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
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
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
  saveButtonDisabled: {
    backgroundColor: '#A5A5A5',
    opacity: 0.7,
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
