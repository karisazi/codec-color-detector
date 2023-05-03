import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import {data} from '../../constants/data';
import Card from '../../components/Card';

import { TextButton } from "../../components";
import { COLORS, FONTS, SIZES, images } from '../../constants';

const Listwarna = ({navigation}) => {

  const renderItem = ({item}) => {
    return (
        <Card 
            itemData={item}
        />
    );
};

    return (
      <View style={styles.container}>
        <Text style={{
          marginTop: 35,
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          fontWeight: 'bold',
          color: 'black',
          marginBottom: 8,
          fontSize:25}}
        >
          Daftar Warna
        </Text>
          <FlatList 
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
          />
            
            
            {/* Footer Buttons */}
            <View
                style={{
                    paddingHorizontal: SIZES.padding,
                    marginBottom: 30,
                    alignItems: 'flex-end'
                }}
            >
                <TextButton
                    contentContainerStyle={{
                        height: 40,
                        width: 70,
                        borderRadius: SIZES.radius
                    }}
                    label="Kembali"
                    onPress={() => navigation.navigate("Realtime")}
                />

            </View>
        </View>
    );
};

export default Listwarna;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: '90%',
    alignSelf: 'center'
  },
});