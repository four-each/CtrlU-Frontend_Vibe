import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient';

import {RootStackParamList} from '../App';
import {Task, TaskWithUser} from '../types';
import {formatTime, formatElapsedTime, isTimeExceeded, getTimeColor} from '../utils/helpers';

type DetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const {width, height} = Dimensions.get('window');

// 임시 데이터
const mockTasks: (Task | TaskWithUser)[] = [
  {
    id: '1',
    userId: 'user1',
    title: '운동하기',
    description: '30분 러닝을 통해 건강한 몸을 만들어보자!',
    targetTime: 30,
    startTime: new Date(Date.now() - 20 * 60 * 1000), // 20분 전 시작
    startImage: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=운동+시작',
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    title: '공부하기',
    description: 'React Native 공부를 통해 앱 개발 실력을 키워보자!',
    targetTime: 120,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전 시작
    endTime: new Date(Date.now() - 30 * 60 * 1000), // 30분 전 완료
    startImage: 'https://via.placeholder.com/300x400/2196F3/FFFFFF?text=공부+시작',
    endImage: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=공부+완료',
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    userId: 'user2',
    title: '요리하기',
    description: '저녁 준비를 통해 맛있는 식사를 만들어보자!',
    targetTime: 60,
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45분 전 시작
    startImage: 'https://via.placeholder.com/300x400/FF5722/FFFFFF?text=요리+시작',
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user2',
      username: 'friend1',
      nickname: '친구1',
      profileImage: 'https://via.placeholder.com/50x50/9C27B0/FFFFFF?text=F1',
    },
    isViewed: false,
  },
];

const DetailScreen = () => {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const {taskId, isMyTask, isCompleted} = route.params;

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showEndImage, setShowEndImage] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  // 현재 할 일 찾기
  const currentTask = mockTasks.find(task => task.id === taskId) || mockTasks[0];
  const currentIndex = mockTasks.findIndex(task => task.id === taskId);

  useEffect(() => {
    setCurrentTaskIndex(currentIndex);
    
    // 진행중인 할 일의 경우 타이머 시작
    if (!currentTask.isCompleted && !currentTask.isAbandoned) {
      const timer = setInterval(() => {
        const now = new Date();
        const elapsedMs = now.getTime() - currentTask.startTime.getTime();
        const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
        const elapsedSecs = Math.floor((elapsedMs % (1000 * 60)) / 1000);
        setElapsedTime(elapsedMinutes);
        setElapsedSeconds(elapsedSecs);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentTask, currentIndex]);

  const handleComplete = () => {
    if (isMyTask && !currentTask.isCompleted) {
      navigation.navigate('Camera', {
        mode: 'complete',
        taskId: currentTask.id,
      });
    }
  };

  const handleAbandon = () => {
    if (isMyTask && !currentTask.isCompleted) {
      Alert.alert(
        '할 일 포기',
        '정말로 이 할 일을 포기하시겠습니까?',
        [
          {text: '취소', style: 'cancel'},
          {
            text: '포기',
            style: 'destructive',
            onPress: () => {
              // 포기 로직 구현
              Alert.alert('포기 완료', '할 일을 포기했습니다.');
            },
          },
        ],
      );
    }
  };

  const handleDelete = () => {
    if (isMyTask && currentTask.isCompleted) {
      Alert.alert(
        '할 일 삭제',
        '정말로 이 할 일을 삭제하시겠습니까?',
        [
          {text: '취소', style: 'cancel'},
          {
            text: '삭제',
            style: 'destructive',
            onPress: () => {
              // 삭제 로직 구현
              Alert.alert('삭제 완료', '할 일을 삭제했습니다.');
            },
          },
        ],
      );
    }
  };

  const navigateToNext = () => {
    const nextIndex = (currentTaskIndex + 1) % mockTasks.length;
    setCurrentTaskIndex(nextIndex);
    const nextTask = mockTasks[nextIndex];
    
    navigation.replace('Detail', {
      taskId: nextTask.id,
      isMyTask: 'user' in nextTask ? false : true,
      isCompleted: nextTask.isCompleted,
    });
  };

  const navigateToPrevious = () => {
    const prevIndex = currentTaskIndex === 0 ? mockTasks.length - 1 : currentTaskIndex - 1;
    setCurrentTaskIndex(prevIndex);
    const prevTask = mockTasks[prevIndex];
    
    navigation.replace('Detail', {
      taskId: prevTask.id,
      isMyTask: 'user' in prevTask ? false : true,
      isCompleted: prevTask.isCompleted,
    });
  };

  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationX: translateX}}],
    {useNativeDriver: Platform.OS !== 'web'},
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const {translationX} = event.nativeEvent;
      
      if (translationX > 100) {
        // 오른쪽으로 스와이프 - 이전 할 일
        navigateToPrevious();
      } else if (translationX < -100) {
        // 왼쪽으로 스와이프 - 다음 할 일
        navigateToNext();
      }
      
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const isTimeOver = isTimeExceeded(currentTask);
  const timeColor = getTimeColor(currentTask);
  const displayImage = require('../../assets/todo.png');
  
  // 진행률 계산 (0-100%)
  const progressPercentage = Math.min(100, Math.floor((elapsedTime / currentTask.targetTime) * 100));
  
  // 진행률 원의 위치 계산 (각도 기반)
  const progressAngle = (progressPercentage / 100) * 360 - 90; // -90도부터 시작 (12시 방향)
  const radius = 136; // 원형 이미지 반지름
  const progressX = Math.cos((progressAngle * Math.PI) / 180) * radius;
  const progressY = Math.sin((progressAngle * Math.PI) / 180) * radius;

  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{translateX}],
            },
          ]}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>뒤로가기</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isMyTask ? '나' : ('user' in currentTask ? (currentTask as TaskWithUser).user.nickname : '친구 이름')}
            </Text>
            <View style={styles.headerRight} />
          </View>

          {/* 메인 콘텐츠 */}
          <View style={styles.mainContent}>
            {/* 프로필 이미지 */}
            <View style={styles.profileContainer}>
              <View style={styles.profileImage}>
                <Image source={require('../../assets/profile.png')} style={styles.profileImg} />
              </View>
            </View>

            {/* 제목 */}
            <View style={styles.titleContainer}>
              <Text style={styles.taskTitle}>{currentTask.title}</Text>
            </View>

            {/* 중앙 원형 이미지 */}
            <View style={styles.imageContainer}>
              <View style={styles.imageCircle}>
                <Image source={displayImage} style={styles.taskImage} resizeMode="cover" />
              </View>
              
              {/* 진행률 표시 */}
              <View style={[styles.progressContainer, {
                left: 136 + progressX - 15, // 15는 진행률 원의 반지름
                top: 136 + progressY - 15,
              }]}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>{progressPercentage}%</Text>
                </View>
              </View>
            </View>

            {/* 목표 시간 */}
            <View style={styles.targetTimeContainer}>
              <Text style={styles.targetTimeText}>
                목표 시간:   {formatTime(currentTask.targetTime)}
              </Text>
            </View>

            {/* 시간 표시 */}
            <View style={styles.timeDisplay}>
              <Text style={[styles.elapsedTime, {color: timeColor}]}>
                {`${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}`}
              </Text>
            </View>
          </View>

          {/* 하단 버튼들 */}
          {isMyTask && !currentTask.isCompleted && !currentTask.isAbandoned && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.abandonButton} onPress={handleAbandon}>
                <Text style={styles.abandonButtonText}>미션 포기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeButtonText}>미션 완료</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 스와이프 안내 */}
          <View style={styles.swipeHint}>
            <Text style={styles.swipeHintText}>좌우로 스와이프하여 다른 할 일 보기</Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f1e7f9',
    borderBottomWidth: 0,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#545656',
    fontFamily: 'Noto Sans KR',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titleContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: '#c8b0db',
    overflow: 'hidden',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    zIndex: 2,
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#832cc5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Noto Sans KR',
  },
  imageCircle: {
    width: 272,
    height: 272,
    borderRadius: 136,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#bababa',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeDisplay: {
    marginTop: 20,
    alignItems: 'center',
  },
  elapsedTime: {
    fontSize: 60,
    fontWeight: '500',
    fontFamily: 'Noto Sans KR',
    color: '#1d1d1d',
  },
  targetTimeContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f1e7f9',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 3,
  },
  targetTimeText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Noto Sans KR',
    textAlign: 'left',
    color: '#1d1d1d',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Noto Sans KR',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    width: 272,
    height: 272,
  },
  taskImage: {
    width: 257,
    height: 257,
    borderRadius: 150,
  },
  imageToggle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  imageToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  taskInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1d1d1d',
    fontFamily: 'Noto Sans KR',
    textAlign: 'center',
  },
  taskDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  timeContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    color: '#666',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 48,
    paddingHorizontal: 20,
  },
  abandonButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#f1e7f9',
    borderRadius: 50,
    alignItems: 'center',
  },
  abandonButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '400',
  },
  completeButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#832cc5',
    borderRadius: 50,
    alignItems: 'center',
  },

  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  swipeHint: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  swipeHintText: {
    fontSize: 12,
    color: '#999',
  },
});

export default DetailScreen; 