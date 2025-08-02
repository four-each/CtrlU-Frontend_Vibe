import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LinearGradient} from 'expo-linear-gradient';

import {RootStackParamList} from '../App';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

const {width, height} = Dimensions.get('window');

const CameraScreen = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const route = useRoute<CameraScreenRouteProp>();
  const {mode, taskId} = route.params;

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleTakePhoto = () => {
    setIsCapturing(true);
    
    // 실제로는 카메라로 사진 촬영
    setTimeout(() => {
      const imageUrl = mode === 'start' 
        ? 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=시작+사진'
        : 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=완료+사진';
      
      setCapturedImage(imageUrl);
      setIsCapturing(false);
    }, 1000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (!capturedImage) {
      Alert.alert('오류', '사진을 먼저 찍어주세요.');
      return;
    }

    Alert.alert(
      '사진 확인',
      mode === 'start' ? '시작 사진을 사용하시겠습니까?' : '완료 사진을 사용하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '확인',
          onPress: () => {
            // 사진 저장 로직 구현
            if (mode === 'start') {
              navigation.navigate('CreateTask');
            } else {
              navigation.navigate('Main');
            }
          },
        },
      ],
    );
  };

  const getScreenTitle = () => {
    return mode === 'start' ? '시작 사진 찍기' : '완료 사진 찍기';
  };

  const getScreenDescription = () => {
    return mode === 'start' 
      ? '할 일을 시작하기 전에 시작 사진을 찍어주세요.'
      : '할 일을 완료했으니 완료 사진을 찍어주세요.';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getScreenTitle()}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* 카메라 프리뷰 영역 */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image source={{uri: capturedImage}} style={styles.capturedImage} />
        ) : (
          <View style={styles.cameraPreview}>
            <Icon name="camera-alt" size={80} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.cameraPreviewText}>카메라 프리뷰</Text>
          </View>
        )}
      </View>

      {/* 설명 텍스트 */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{getScreenDescription()}</Text>
      </View>

      {/* 하단 컨트롤 */}
      <View style={styles.controlsContainer}>
        {capturedImage ? (
          // 사진 촬영 후 버튼들
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
              <Text style={styles.retakeButtonText}>다시 찍기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <LinearGradient
                colors={['#4CAF50', '#45A049']}
                style={styles.confirmGradient}>
                <Text style={styles.confirmButtonText}>사용하기</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // 사진 촬영 전 버튼
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
              onPress={handleTakePhoto}
              disabled={isCapturing}>
              <View style={styles.captureButtonInner}>
                {isCapturing ? (
                  <Icon name="hourglass-empty" size={32} color="white" />
                ) : (
                  <Icon name="camera" size={32} color="white" />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.captureText}>
              {isCapturing ? '사진 촬영 중...' : '사진 촬영'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerRight: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    width: width - 40,
    height: height * 0.6,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  cameraPreviewText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 16,
    marginTop: 10,
  },
  capturedImage: {
    width: width - 40,
    height: height * 0.6,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retakeButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CameraScreen; 