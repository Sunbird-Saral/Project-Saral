import React, { useState } from 'react';
import { Text, View, Modal, TouchableOpacity, TextInput, Image, ToastAndroid } from 'react-native';
import { Assets } from '../../assets';
import Strings from '../../utils/Strings';

const TaggingModal = ({
    isModalVisible,
    setIsModalVisible,
    tagData,
    setTagData,
    bgColor,
    studentsAndExamData,
    questionIdData,
    subject
}) => {

    const [newTag, setNewTag] = useState('')

    const onPressHandler = (value) => {
        let renderData = tagData;
        for (let data of renderData) {
            if (data.tagName == value) {
                data.selected = (data.selected == null) ? true : !data.selected;
                break;
            }
        }
        let updatedValue = renderData.slice(0, renderData.length)
        setTagData(updatedValue);
    }

    const removeTagFromArray = (tag, questionId) => {
        const filteredTag = tagData.filter((item) => item.tagName != tag);
        setTagData(filteredTag);

        //remove tag from ExamObject
        for (const element of studentsAndExamData.data.exams) {
            if (element.subject == subject) {
                for (const _el of element.questions) {
                    if (questionId == _el.questionId) {
                        const index = _el.tags.findIndex(item => item.tagName == tag)
                        _el.tags.splice(index, 1)
                        break;
                    }
                }
            }
        }
    }

    const addIntoExamObject = (data) => {
        for (const element of studentsAndExamData.data.exams) {
            if (element.subject == subject) {
                for (const _el of element.questions) {
                    if (questionIdData.trim() == (_el.hasOwnProperty("questionId") && _el.questionId.trim())) {
                        _el.tags.push(data);
                        setNewTag('');
                        setTagData(_el.tags)
                        break;
                    }
                }
            }
        }
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

                <View style={styles.txtCon}>
                    <Text style={styles.txt}>{questionIdData}</Text>
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNewTag}
                        value={newTag}
                        placeholder={Strings.add_new_tag}
                        keyboardType="default"
                        placeholderTextColor="grey"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            const isPresent = tagData.length > 0 && tagData.filter((item) => item.tagName == newTag);
                            if (newTag.length > 0 && !isPresent.length > 0) {

                                addIntoExamObject({ tagName: newTag, selected: false, questionId: questionIdData });
                            }
                            if (isPresent.length > 0) {
                                ToastAndroid.show(`${newTag} is already in list.`, ToastAndroid.SHORT);
                            }
                        }}
                        style={{
                            backgroundColor: bgColor,
                            borderRadius: 8,
                            padding: 8
                        }}
                    >
                        <Text style={styles.tagText}>{Strings.add_tag}</Text>
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
                                    key={item.tagName.toString()}
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
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        width: 200,
        color:'#000'
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
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagText: {
        color: 'white',
        fontWeight: 'bold'
    },
    txtCon: {
        padding: 10,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: 'black',
    },
    txt: {
        color: "white",
        fontWeight: 'bold'
    }
};

export default React.memo(TaggingModal);
