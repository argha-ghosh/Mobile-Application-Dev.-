import { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { useStudents } from "@/context/students-context";
import type { Student } from "@/data/students";

function showAlert(title: string, message: string) {
    if (Platform.OS === "web") {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
}

export default function AddStudentForm() {
    const { dispatch, students } = useStudents();

    const [name, setName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [department, setDepartment] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState("");
    const [loading, setLoading] = useState(false);
    // Feature 3 — inline error for duplicate student ID
    const [studentIdError, setStudentIdError] = useState("");

    const handleSubmit = () => {
        // Reset previous ID error
        setStudentIdError("");

        if (
            !name.trim() ||
            !studentId.trim() ||
            !department.trim() ||
            !bio.trim() ||
            !skills.trim()
        ) {
            showAlert("Missing Information", "Please fill in all fields.");
            return;
        }

        // Feature 3 — block duplicate student IDs
        const isDuplicate = students.some(
            (s) => s.studentId === studentId.trim()
        );
        if (isDuplicate) {
            setStudentIdError("Student ID already exists");
            return;
        }

        setLoading(true);

        const newStudent: Student = {
            id: Date.now().toString(),
            name: name.trim(),
            studentId: studentId.trim(),
            department: department.trim(),
            bio: bio.trim(),
            skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
            avatarUrl: "https://i.pravatar.cc/150?img=12",
        };

        dispatch({
            type: "ADD_STUDENT",
            payload: newStudent,
        });

        setLoading(false);
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add New Student</Text>
            <Text style={styles.subtitle}>
                Enter the student's information below.
            </Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter full name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Student ID</Text>
            <TextInput
                style={[styles.input, studentIdError ? styles.inputError : null]}
                placeholder="e.g. 23-12345-1"
                value={studentId}
                onChangeText={(text) => {
                    setStudentId(text);
                    // Clear error when user starts typing again
                    if (studentIdError) setStudentIdError("");
                }}
            />
            {/* Feature 3 — show duplicate ID error inline */}
            {studentIdError ? (
                <Text style={styles.errorText}>{studentIdError}</Text>
            ) : null}

            <Text style={styles.label}>Department</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter department"
                value={department}
                onChangeText={setDepartment}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Write a short bio"
                value={bio}
                onChangeText={setBio}
                multiline
            />

            <Text style={styles.label}>Skills</Text>
            <TextInput
                style={styles.input}
                placeholder="React Native, TypeScript, Python"
                value={skills}
                onChangeText={setSkills}
            />
            <Text style={styles.hint}>
                Separate multiple skills with commas.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Add Student</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
            >
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#F0F4F8",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#0D1F4E",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: "#64748B",
        marginBottom: 22,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0D1F4E",
        marginBottom: 7,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 4,
    },
    inputError: {
        borderColor: "#EF4444",
        marginBottom: 4,
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
    },
    bioInput: {
        minHeight: 90,
        textAlignVertical: "top",
    },
    hint: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 2,
        marginBottom: 18,
    },
    button: {
        backgroundColor: "#0D1F4E",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 6,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    cancelButton: {
        padding: 14,
        alignItems: "center",
        marginTop: 8,
    },
    cancelText: {
        color: "#0D1F4E",
        fontSize: 15,
        fontWeight: "600",
    },
});
