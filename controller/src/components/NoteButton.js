import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NoteButton = ({ btnText, onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.noteButton}
                onPress={onPress}
            >
                <Text style={styles.textButton}>{btnText}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noteButton: {
        backgroundColor: '#4F5D2F',
        padding: 10,
        marginTop: 5,
    },
    textButton: {
        color: '#CFD6EA',
        alignSelf: 'center',
    }
});

export default NoteButton;