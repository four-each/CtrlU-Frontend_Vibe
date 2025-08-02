import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LinearGradient} from 'expo-linear-gradient';
import {Picker} from '@react-native-picker/picker';

import {RootStackParamList} from '../App';

type CreateTaskScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateTask'>;

const {width} = Dimensions.get('window');

const CreateTaskScreen = () => {
  const navigation = useNavigation<CreateTaskScreenNavigationProp>();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(30);
  const [startImage, setStartImage] = useState<string | null>(null);

  const handleTakePhoto = () => {
    // 실제로는 카메라 권한 요청 후 카메라 화면으로 이동
    Alert.alert(
      '카메라 접근',
      '시작 사진을 찍기 위해 카메라에 접근합니다.',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: () => {
            // 임시로 플레이스홀더 이미지 설정
            setStartImage('https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=시작+사진');
          },
        },
      ],
    );
  };

  const handleRemovePhoto = () => {
    setStartImage(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('입력 오류', '할 일 제목을 입력해주세요.');
      return;
    }

    if (!startImage) {
      Alert.alert('입력 오류', '시작 사진을 찍어주세요.');
      return;
    }

    const totalMinutes = targetHours * 60 + targetMinutes;
    if (totalMinutes === 0) {
      Alert.alert('입력 오류', '목표 시간을 설정해주세요.');
      return;
    }

    // 할 일 생성 로직 구현
    Alert.alert(
      '할 일 생성',
      '할 일이 성공적으로 생성되었습니다!',
      [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  const isFormValid = title.trim() && startImage && (targetHours > 0 || targetMinutes > 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>할 일 업로드</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 사진 섹션 */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>시작 사진</Text>
          <View style={styles.photoContainer}>
            {startImage ? (
              <View style={styles.photoWrapper}>
                <Image source={{uri: startImage}} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={handleRemovePhoto}>
                  <Icon name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoPlaceholder} onPress={handleTakePhoto}>
                <Icon name="camera-alt" size={48} color="#999" />
                <Text style={styles.photoPlaceholderText}>사진 찍기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 할 일 정보 섹션 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>할 일 정보</Text>
          
          {/* 제목 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>제목</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="할 일 제목을 입력하세요"
              placeholderTextColor="#999"
              maxLength={50}
            />
          </View>

          {/* 설명 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>설명</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="할 일에 대한 설명을 입력하세요"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              maxLength={200}
            />
          </View>

          {/* 목표 시간 설정 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>목표 시간</Text>
            <View style={styles.timePickerContainer}>
              <View style={styles.timePickerWrapper}>
                <Text style={styles.timePickerLabel}>시간</Text>
                <Picker
                  selectedValue={targetHours}
                  onValueChange={setTargetHours}
                  style={styles.picker}>
                  {Array.from({length: 25}, (_, i) => (
                    <Picker.Item key={i} label={`${i}시간`} value={i} />
                  ))}
                </Picker>
              </View>
              <View style={styles.timePickerWrapper}>
                <Text style={styles.timePickerLabel}>분</Text>
                <Picker
                  selectedValue={targetMinutes}
                  onValueChange={setTargetMinutes}
                  style={styles.picker}>
                  {Array.from({length: 60}, (_, i) => (
                    <Picker.Item key={i} label={`${i}분`} value={i} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid}>
          <LinearGradient
            colors={isFormValid ? ['#4CAF50', '#45A049'] : ['#CCCCCC', '#BBBBBB']}
            style={styles.submitGradient}>
            <Text style={styles.submitButtonText}>할 일 시작하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  photoSection: {
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 10,
  },
  infoSection: {
    backgroundColor: 'white',
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  photoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: width - 80,
    height: (width - 80) * 1.33,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholder: {
    width: width - 80,
    height: (width - 80) * 1.33,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  photoPlaceholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timePickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  timePickerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateTaskScreen; 