import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    TouchableOpacity, useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';

import Card from '@/components/modular/Card';
import ModularModal from '@/components/modular/ModularModal';
import ModularButton from '@/components/modular/ModularButton';

import RoleDropdown from '@/components/modular/dropdown/RoleDropdown';

import { InsertAnnouncement } from '@/types/iAnnouncement';
import { insertAnnouncement } from '@/routes/announcement';

import { useConfirm } from '@/hooks/useConfirm';
import { useSession } from "@/utils/SessionContext";

interface Props {
    onSubmit: () => void;
}

const NewAnnouncement: React.FC<Props> = ({ onSubmit }) => {
    const { width, height } = useWindowDimensions();
    const WIDTH = width;
    const HEIGHT = height;

    const buttonHeight = HEIGHT * 0.15;

    const { user } = useSession();
    const { confirm } = useConfirm();

    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<number | null>(1);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const TITLE_MAX_CHARS = 150;
    const DESC_MAX_CHARS = 350;


    const toggleModal = () => setModalVisible(prev => !prev);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedRole(1);
    };

    const handleClose = () => {
        resetForm();
        toggleModal();
    };

    // Form Validation
    const isValidForm =
        title.trim().length > 0 &&
        description.trim().length > 0 &&
        selectedRole !== null;

    const handlePost = async () => {
        if (!user || !selectedRole) return;

        // Confirmation
        const ok = await confirm("Confirm Announcement", "Are you sure you want to post this announcement?");
        if (!ok) return;

        try {
            setLoading(true);

            const payload: InsertAnnouncement = {
                author_id: Number(user.employee_id),
                title: title,
                description: description,
                role_id: selectedRole
            }

            await insertAnnouncement(payload);

            alert("Announcement posted successfully!");
            resetForm();
            toggleModal();
            onSubmit();

        } catch (error: any) {
            console.error("Failed to post announcement:", error.message);
            alert("Failed to post announcement!");
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            {/* New Announcement Button */}
            <Card style={[styles.buttonContainer, { height: buttonHeight }]}>
                <TouchableOpacity onPress={toggleModal} style={styles.button}>
                    <Ionicons name="notifications" size={30} color="black" style={styles.icon} />
                    <Text style={GlobalStyles.boldText}>New Announcement</Text>
                </TouchableOpacity>
            </Card>

            {/* New Announcement Modal */}
            <ModularModal visible={modalVisible} onClose={handleClose} scroll={false}>

                <Text style={GlobalStyles.modalTitle}>New Announcement</Text>

                {/* Form */}
                <View style={[styles.formContainer, { maxHeight: height * 0.45 }]}>
                    <ScrollView>

                        <TextInput
                            placeholder="Title"
                            value={title}
                            onChangeText={(text) => {
                                if (text.length <= TITLE_MAX_CHARS) setTitle(text);
                            }}
                            style={[GlobalStyles.input, { marginBottom: 5 }]}
                        />
                        <Text style={{ color: Colors.gray, marginBottom: 10 }}>
                            {title.length}/{TITLE_MAX_CHARS}
                        </Text>

                        <TextInput
                            placeholder="Description"
                            value={description}
                            onChangeText={(text) => {
                                if (text.length <= DESC_MAX_CHARS) setDescription(text);
                            }}
                            multiline
                            numberOfLines={4}
                            style={[GlobalStyles.input, { marginBottom: 5 }]}
                        />
                        <Text style={{ color: Colors.gray, marginBottom: 10 }}>
                            {description.length}/{DESC_MAX_CHARS}
                        </Text>

                        <View style={{ marginBottom: 15 }}>
                            <RoleDropdown
                                selectedRole={selectedRole}
                                onRoleSelect={setSelectedRole}
                                labelText="Assign To:"
                                usePlaceholder={false}
                            />
                        </View>

                    </ScrollView>
                </View>

                {/* Buttons */}
                <View style={GlobalStyles.buttonRowContainer}>
                    <ModularButton
                        text="Post"
                        textStyle={{ color: 'white' }}
                        style={[GlobalStyles.submitButton, { flex: 1 }]}
                        onPress={handlePost}
                        enabled={isValidForm && !loading}
                    />

                    <ModularButton
                        text="Cancel"
                        textStyle={{ color: 'gray' }}
                        style={[GlobalStyles.cancelButton, { flex: 1 }]}
                        onPress={handleClose}
                    />
                </View>

            </ModularModal>
        </>

    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        minHeight: 120,
        maxHeight: 200,
        padding: 0,              // <— remove padding so Touchable can fill
        overflow: 'hidden',      // keeps ripple/press effects clean
    },
    button: {
        flex: 1,            // <— THIS is the key
        width: '100%',      // ensures full horizontal fill
        height: '100%',     // ensures full vertical fill
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    icon: {
        marginBottom: 8,
    },
    formContainer: {
        gap: 12,
        marginTop: 10,
    },
});

export default NewAnnouncement;
