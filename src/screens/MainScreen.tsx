import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {RootStackParamList} from '../App';
import {Task, TaskWithUser, StoryItem} from '../types';
import {getStoryItems, getStoryStatusColor} from '../utils/helpers';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const {width} = Dimensions.get('window');

// 임시 데이터
const mockMyTasks: Task[] = [
  {
    id: '1',
    userId: 'user1',
    title: '운동하기',
    description: '30분 러닝',
    targetTime: 30,
    startTime: new Date(Date.now() - 20 * 60 * 1000), // 20분 전 시작
    startImage: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=운동',
    isCompleted: false,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    title: '공부하기',
    description: 'React Native 공부',
    targetTime: 120,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전 시작
    endTime: new Date(Date.now() - 30 * 60 * 1000), // 30분 전 완료
    startImage: 'https://via.placeholder.com/100x100/2196F3/FFFFFF?text=공부',
    endImage: 'https://via.placeholder.com/100x100/FF9800/FFFFFF?text=완료',
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
];

const mockFriendTasks: TaskWithUser[] = [
  {
    id: '3',
    userId: 'user2',
    title: '요리하기',
    description: '저녁 준비',
    targetTime: 60,
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45분 전 시작
    startImage: 'https://via.placeholder.com/100x100/FF5722/FFFFFF?text=요리',
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
  {
    id: '4',
    userId: 'user3',
    title: '청소하기',
    description: '방 정리',
    targetTime: 45,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전 시작
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전 완료
    startImage: 'https://via.placeholder.com/100x100/795548/FFFFFF?text=청소',
    endImage: 'https://via.placeholder.com/100x100/607D8B/FFFFFF?text=완료',
    isCompleted: true,
    isAbandoned: false,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    user: {
      id: 'user3',
      username: 'friend2',
      nickname: '친구2',
      profileImage: 'https://via.placeholder.com/50x50/3F51B5/FFFFFF?text=F2',
    },
    isViewed: true,
  },
];

const MainScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const [storyItems, setStoryItems] = useState<StoryItem[]>([]);
  const [myOngoingTasks, setMyOngoingTasks] = useState<Task[]>([]);
  const [friendOngoingTasks, setFriendOngoingTasks] = useState<TaskWithUser[]>([]);

  useEffect(() => {
    // 스토리 아이템 생성
    const items = getStoryItems(mockMyTasks, mockFriendTasks);
    setStoryItems(items);

    // 진행중인 할 일들 분리
    const ongoing = mockMyTasks.filter(task => !task.isCompleted && !task.isAbandoned);
    setMyOngoingTasks(ongoing);

    const friendOngoing = mockFriendTasks.filter(task => !task.isCompleted && !task.isAbandoned);
    setFriendOngoingTasks(friendOngoing);
  }, []);

  const renderStoryItem = ({item}: {item: StoryItem}) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => {
        navigation.navigate('Detail', {
          taskId: item.task.id,
          isMyTask: item.isMyTask,
          isCompleted: item.task.isCompleted,
        });
      }}>
      <View style={[styles.storyCircle, {borderColor: getStoryStatusColor(item)}]}>
        <Image source={{uri: item.task.startImage}} style={styles.storyImage} />
        <View style={[styles.storyStatus, {backgroundColor: getStoryStatusColor(item)}]} />
      </View>
      <Text style={styles.storyNickname} numberOfLines={1}>
        {item.task.user.nickname}
      </Text>
    </TouchableOpacity>
  );

  const renderTaskItem = ({item}: {item: Task | TaskWithUser}) => {
    const now = new Date();
    const elapsedMs = now.getTime() - item.startTime.getTime();
    const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
    const isTimeExceeded = elapsedMinutes > item.targetTime;
    
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `+ ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${Math.floor((elapsedMs % (1000 * 60)) / 1000).toString().padStart(2, '0')}`;
    };
    
    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => {
          navigation.navigate('Detail', {
            taskId: item.id,
            isMyTask: 'user' in item ? false : true,
            isCompleted: item.isCompleted,
          });
        }}>
        <Text style={styles.taskUserName}>{'user' in item ? item.user.nickname : '나'}</Text>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={[styles.taskTime, {color: '#8e3fca'}]}>
            {formatTime(elapsedMinutes)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const hasOngoingTask = myOngoingTasks.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileNav}>
          <View style={styles.profileButtons}>
            <Text style={styles.profileButton}>내 프로필</Text>
            <Text style={styles.profileButton}>활성화 프로필</Text>
          </View>
        </View>
        <View style={styles.settingsIconContainer}>
          <Image source={require('../../assets/설정.png')} style={styles.iconImage} />
        </View>
        
        <View style={styles.profileList}>
          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => {
              if (myOngoingTasks.length > 0) {
                navigation.navigate('Detail', {
                  taskId: myOngoingTasks[0].id,
                  isMyTask: true,
                  isCompleted: myOngoingTasks[0].isCompleted,
                });
              }
            }}>
            <Image 
              source={require('../../assets/프로필.png')} 
              style={styles.profileImage} 
            />
            <Text style={styles.profileName}>
              나
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileItem}
            onPress={() => {
              if (friendOngoingTasks.length > 0) {
                navigation.navigate('Detail', {
                  taskId: friendOngoingTasks[0].id,
                  isMyTask: false,
                  isCompleted: friendOngoingTasks[0].isCompleted,
                });
              }
            }}>
            <Image 
              source={require('../../assets/프로필.png')} 
              style={styles.profileImage} 
            />
            <Text style={styles.profileName}>
              친구1
            </Text>
          </TouchableOpacity>
        </View>
        
      </View>

      {/* Divider */}
      <View style={styles.profileDivider} />

      {/* Progress List */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>진행 목록</Text>
          <Image source={require('../../assets/새로고침.png')} style={styles.iconImage} />
        </View>
        
        <View style={styles.progressList}>
          {myOngoingTasks.slice(0, 1).map((task) => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.activityItem}
              onPress={() => {
                navigation.navigate('Detail', {
                  taskId: task.id,
                  isMyTask: 'user' in task ? false : true,
                  isCompleted: task.isCompleted,
                });
              }}>
              <Text style={styles.activityName}>
                {'user' in task ? (task as TaskWithUser).user.nickname : '나'}
              </Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{task.title}</Text>
                <Text style={styles.activityTime}>+ 00:11:02</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Friends Section */}
      <View style={styles.friendsSection}>
        <Text style={styles.friendsTitle}>친구</Text>
        
        <View style={styles.friendsList}>
          {friendOngoingTasks.slice(0, 4).map((task) => (
            <TouchableOpacity 
              key={task.id} 
              style={styles.activityItem}
              onPress={() => {
                navigation.navigate('Detail', {
                  taskId: task.id,
                  isMyTask: 'user' in task ? false : true,
                  isCompleted: task.isCompleted,
                });
              }}>
              <Text style={styles.activityName}>{task.user.nickname}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>{task.title}</Text>
                <Text style={styles.activityTime}>+ 00:11:02</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate('CreateTask')}>
        <View style={styles.uploadGradient}>
          <Icon name="add" size={30} color="#ffffff" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  profileItem: {
    alignItems: 'center',
  },
  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    backgroundColor: '#f1e7f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeProfile: {
    borderColor: '#832cc5',
    backgroundColor: '#832cc5',
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  profileName: {
    fontSize: 12,
    color: '#545656',
    textAlign: 'center',
    fontFamily: 'Noto Sans KR',
  },
  activeName: {
    color: '#1d1d1d',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
    fontFamily: 'Noto Sans KR',
  },

  profileNav: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
  },
  profileButtons: {
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'flex-start',
  },
  profileButton: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Noto Sans KR',
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  settingsIconContainer: {
    position: 'absolute',
    top: 15,
    right: 20,
    width: 24,
    height: 24,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  activeProfileImage: {
    borderWidth: 2,
    borderColor: '#832cc5',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 20,
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
    fontFamily: 'Noto Sans KR',
  },
  progressList: {
    gap: 10,
  },
  friendsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  friendsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
    marginBottom: 20,
    fontFamily: 'Noto Sans KR',
  },
  friendsList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  activityName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1d1d1d',
    fontFamily: 'Noto Sans KR',
  },
  activityContent: {
    flexDirection: 'row',
    gap: 36,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1d1d1d',
    fontFamily: 'Noto Sans KR',
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7c3aed',
    fontFamily: 'Noto Sans KR',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
    fontFamily: 'Noto Sans KR',
  },
  storySection: {
    backgroundColor: 'white',
    paddingVertical: 15,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  section: {
    backgroundColor: 'white',
    paddingVertical: 15,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1d',
    marginBottom: 15,
    paddingHorizontal: 16,
    fontFamily: 'Noto Sans KR',
  },
  storyList: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },
  storyCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#832cc5',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
  },
  storyStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  storyNickname: {
    fontSize: 12,
    color: '#1d1d1d',
    textAlign: 'center',
    fontFamily: 'Noto Sans KR',
  },
  taskItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c8b0db',
    borderRadius: 15,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
  },
  taskUserName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1d1d1d',
    marginBottom: 8,
    fontFamily: 'Noto Sans KR',
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  taskImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: '#d9d9d9',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1d1d1d',
    marginBottom: 4,
    fontFamily: 'Noto Sans KR',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'Noto Sans KR',
  },
  taskTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8e3fca',
    fontFamily: 'Noto Sans KR',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 35.5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 35.5,
    width: 71,
    height: 71,
    backgroundColor: '#832cc5',
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MainScreen; 