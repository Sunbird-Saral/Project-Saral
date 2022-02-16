import React, { useEffect, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import { Assets } from '../../assets';

const TaggingModal = ({
    params,
    isModalVisible,
    setIsModalVisible,
    tagData,
    setTagData,
    bgColor,
    studentsAndExamData,
    questionIdData
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

    const removeTagFromArray = (tag, questionId) => {
        
        const filteredTag = tagData.filter((item) => item.tagName !== tag);
        setTagData(filteredTag);

        studentsAndExamData.data.exams[0].questions.forEach(element => {
            if (questionId == element.questionId) {
                const index = element.tags.findIndex(item => item.tagName == tag)
                element.tags.splice(index, 1)
            }
        });
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
                                tagData.push({ tagName: newTag, selected: false, questionId: questionIdData })
                                setTagData(tagData)
                                setNewTag('')
                            }
                        }}
                        style={{
                            backgroundColor: bgColor,
                            borderRadius: 8,
                            padding: 8
                        }}
                    >
                        <Text style={styles.tagText}>Add Tag</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tagsCon}>
                    {
                        tagData.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.selectionCon, { backgroundColor: item.selected ? bgColor : '#808080', }]}
                                    activeOpacity={0.8}
                                    onPress={() => onPressHandler(item.tagName)}
                                    key={`${index.toString()}`}
                                >
                                    <Text style={styles.item}>{item.tagName}</Text>

                                    <TouchableOpacity
                                        onPress={() => {
                                            removeTagFromArray(item.tagName, item.questionId);
                                        }}
                                    >
                                        <Image
                                            source={Assets.crossImage}
                                        />
                                    </TouchableOpacity>


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
    },
    selectionCon: {
        borderRadius: 8,
        margin: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 6
    },
    tagsCon: {
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold'
    }
};

export default TaggingModal;
