import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Modal, ScrollView } from 'react-native';
import { Searchbar, Card, Title, ActivityIndicator, Menu, Divider, Button } from 'react-native-paper';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';

const BodyPartVideosScreen = () => {
  const [tutorialData, setTutorialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyPartList, setBodyPartList] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedBodyPart, searchQuery]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises', {
        params: { 
          limit: 30,
          bodyPart: selectedBodyPart || undefined,
          name: searchQuery,
        },
        headers: {
          'X-RapidAPI-Key': '8e2a28eabbmsh6b31e7bf49e2302p1aab6djsn1854cd34eeb1',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      });

      console.log('API Response:', response.data);

      // Filter data based on selected bodyPart
      const filteredData = response.data.filter(item => {
        if (!selectedBodyPart) {
          return true; // No filter selected, include all data
        }
        return item.bodyPart === selectedBodyPart;
      });

      // Filter data based on search query
      const searchedData = filteredData.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.bodyPart.toLowerCase().includes(searchLower) ||
          item.target.toLowerCase().includes(searchLower)
        );
      });

      // Sort filtered data by body weight
      const sortedData = searchedData.sort((a, b) => {
        const weightA = a.target.toLowerCase() === 'body weight' ? 0 : 1;
        const weightB = b.target.toLowerCase() === 'body weight' ? 0 : 1;
        return weightA - weightB;
      });

      setTutorialData(sortedData);

      // Extract unique bodyPart from the response
      const allBodyPart = Array.from(new Set(response.data.map(item => item.bodyPart)));
      setBodyPartList(allBodyPart);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const handleFilterPress = () => {
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const handleBodyPartSelect = bodyPart => {
    setSelectedBodyPart(bodyPart);
    setMenuVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedBodyPart(null);
  };

  const handleVideoSearch = async exerciseName => {
    try {
      // Use the YouTube Data API to search for related videos based on exercise name
      const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: exerciseName + ' workout',
          maxResults: 3, // Display only 3 videos for each exercise
          key: 'AIzaSyCu8UMUAtOViAltRJtpcgGMllYJq6bckQs', 
        },
      });

      const videos = youtubeResponse.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
      }));

      return videos;
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  };

  const renderMenuItems = () => {
    const allBodyPart = Array.from(new Set(bodyPartList));

    return allBodyPart.map((bodyPart, index) => (
      <Menu.Item key={index} onPress={() => handleBodyPartSelect(bodyPart)} title={bodyPart} />
    ));
  };

  const renderCardItem = ({ item }) => {
    const { name } = item;

    const handleViewVideos = async () => {
      const videos = await handleVideoSearch(name);

      if (videos.length > 0) {
        // Display videos in a modal
        setSelectedVideo(videos);
        setModalVisible(true);
      } else {
        console.warn('No videos found for the selected exercise.');
      }
    };

    return (
      <TouchableOpacity onPress={handleViewVideos}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.cardTitle}>{name}</Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderMenu = () => {
    return (
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterIcon}>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        }
      >
        {renderMenuItems()}
        {selectedBodyPart && (
          <Menu.Item onPress={handleClearFilter} title="Clear Filter" />
        )}
      </Menu>
    );
  };

  const renderVideos = () => {
    if (!selectedVideo) {
      return null;
    }

    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Button onPress={() => setModalVisible(false)}>Close</Button>
          <ScrollView>
            {selectedVideo.map(video => (
              <YoutubePlayer
                key={video.videoId}
                height={200}
                play={false}
                videoId={video.videoId}
              />
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        {renderMenu()}
      </View>
      <Divider />
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        <>
          {renderVideos()}
          <FlatList
            data={tutorialData}
            renderItem={renderCardItem}
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    flex: 1,
    marginBottom: 10,
  },
  filterIcon: {
    padding: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#2196F3',
  },
  loader: {
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default BodyPartVideosScreen;

















