import {View, Text, FlatList, StyleSheet} from 'react-native';
import React from 'react';

const ShowScannedData = ({navigation}) => {
  const data = navigation.getParam('data', 'NO-ID');
  const Item = ({title, value}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return data.length > 0 ? (
    <View>
      <FlatList
        data={data}
        renderItem={({item}) => <Item title={item.label} value={item.value} />}
        keyExtractor={item => item.label}
      />
    </View>
  ) : (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text style={{fontSize: 20, fontFamily: 'sans-serif-medium'}}>
        Scan to see data!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#bce0d7',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
  },
  value: {
    fontSize: 15,
  },
});

export default ShowScannedData;
