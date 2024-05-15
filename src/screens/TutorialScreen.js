import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar, Card, Title, Paragraph, ActivityIndicator, Menu, Divider } from 'react-native-paper';
import axios from 'axios';
import { Image } from 'react-native';

const TutorialScreen = () => {
  const [tutorialData, setTutorialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedEquipment, searchQuery]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises', {
        params: {
          limit: 30,
          equipment: selectedEquipment || undefined,
          name: searchQuery,
        },
        headers: {
          'X-RapidAPI-Key': '8e2a28eabbmsh6b31e7bf49e2302p1aab6djsn1854cd34eeb1',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      });

      console.log('API Response:', response.data);

      // Filter data based on selected equipment
      const filteredData = response.data.filter(item => {
        if (!selectedEquipment) {
          return true; // No filter selected, include all data
        }
        return item.equipment === selectedEquipment;
      });

      // Filter data based on search query
      const searchedData = filteredData.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.equipment.toLowerCase().includes(searchLower) ||
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

      // Extract unique equipment from the response
      const allEquipment = Array.from(new Set(response.data.map(item => item.equipment)));
      setEquipmentList(allEquipment);
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

  const handleEquipmentSelect = equipment => {
    setSelectedEquipment(equipment);
    setMenuVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedEquipment(null);
  };

  const renderMenuItems = () => {
    const allEquipment = Array.from(new Set(equipmentList));

    return allEquipment.map((equipment, index) => (
      <Menu.Item key={index} onPress={() => handleEquipmentSelect(equipment)} title={equipment} />
    ));
  };

  const renderCardItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => console.log('Card pressed')}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.gifContainer}>
              {item.gifUrl && <Image source={{ uri: item.gifUrl }} style={styles.gifImage} />}
            </View>
            <Title style={styles.cardTitle}>{item.name}</Title>
            <Paragraph style={styles.cardText}>{item.instructions.join('\n')}</Paragraph>
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
            <Image source={require('../../filter.png')} style={styles.filterIconImage} />
          </TouchableOpacity>
        }
      >
        {renderMenuItems()}
        {selectedEquipment && (
          <Menu.Item onPress={handleClearFilter} title="Clear Filter" />
        )}
      </Menu>
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
        <FlatList
          data={tutorialData}
          renderItem={renderCardItem}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        />
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
    marginLeft: 10,
    padding: 10,
  },
  filterIconImage: {
    width: 24,
    height: 24,
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
  gifContainer: {
    marginBottom: 10,
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  gifImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cardTitle: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardText: {
    color: '#333333',
    textAlign: 'center',
  },
});

export default TutorialScreen;