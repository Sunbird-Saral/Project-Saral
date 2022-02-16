import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, Button } from 'react-native';

const TaggingModal = ({
    params,
    isModalVisible,
    setIsModalVisible,
    tagData,
    setTagData,
    bgColor
}) => {

    const [newTag, setNewTag] = useState()

    const onPressHandler = (value) => {
        let renderData = tagData;
        for (let data of renderData) {
            if (data.tagName == value) {
                data.selected = (data.selected == null) ? true : !data.selected;
            }
        }
        let updatedValue = renderData.slice(0, renderData.length)
        setTagData(updatedValue);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setIsModalVisible(!isModalVisible);
                setNewTag('')
            }}
        >
            <View style={styles.viewContainer}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNewTag}
                        value={newTag}
                        placeholder="Add New Tag"
                        keyboardType="default"
                    />
                    <TouchableOpacity
                        title='Add'
                        onPress={() => {
                            if (newTag.length > 0) {
                                tagData.push({ tagName: newTag, selected: false })
                                let updatedValue = tagData.slice(0, tagData.length)
                                setTagData(updatedValue)
                                setNewTag('')
                            }
                        }}
                        style={{
                            backgroundColor: bgColor,
                            borderRadius: 8,
                            padding: 8
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Tag</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        tagData.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 8,
                                        backgroundColor: item.selected ? bgColor : '#808080',
                                        margin: 15,
                                    }}
                                    activeOpacity={0.8}
                                    onPress={() => onPressHandler(item.tagName)}
                                    key={`${index.toString()}`}
                                >
                                    <Text style={styles.item}>{item.tagName}</Text>
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
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        width: 200,
    }
};

export default TaggingModal;
