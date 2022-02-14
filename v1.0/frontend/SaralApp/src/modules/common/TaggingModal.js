import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';

const TaggingModal = ({
    params,
    isModalVisible,
    setIsModalVisible,
    data
}) => {

    const [tagData, setTagData] = useState(data);

    const onPressHandler = (value) => {
        let renderData = data;
        for (let data of renderData) {
            if (data.name == value) {
                data.selected = (data.selected == null) ? true : !data.selected;
            }
        }
        let updateValue = renderData.slice(0,renderData.length)
        setTagData(updateValue);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(!isModalVisible);
            }}
        >
            <View style={styles.viewContainer}>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        tagData.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 8,
                                        backgroundColor: item.selected ? 'blue' : '#808080',
                                        margin: 15

                                    }}
                                    activeOpacity={0.8}
                                    onPress={() => onPressHandler(item.name)}
                                >
                                    <Text style={styles.item}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>

            </View>
        </Modal>
    );
}

const styles = {
    item: {
        color: 'white',
        padding: 8,
    },
    viewContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

export default TaggingModal;
