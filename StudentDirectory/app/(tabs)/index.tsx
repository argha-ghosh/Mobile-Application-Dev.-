import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import StudentItem from "@/components/student-item";
import { Student } from "@/data/students";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/search-bar";
import { useEffect, useState } from "react";
import StudentDetail from "@/components/student-detail";
import { useStudents } from "@/context/students-context";
import { router } from "expo-router";

export default function HomeScreen() {
    const { students, dispatch } = useStudents();

    const [query, setQuery] = useState<string>("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Auto-deselect if the selected student gets removed from the list
    useEffect(() => {
        if (selectedStudent && !students.find((s) => s.id === selectedStudent.id)) {
            setSelectedStudent(null);
        }
    }, [students, selectedStudent]);

    const handleSelect = (student: Student) => {
        setSelectedStudent((prev) =>
            prev?.id === student.id ? null : student
        );
    };

    const handleReset = () => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm(
                "Reset Directory\n\nThis will remove all added students and restore the original list."
            );
            if (confirmed) {
                dispatch({ type: "RESET" });
            }
        } else {
            Alert.alert(
                "Reset Directory",
                "This will remove all added students and restore the original list.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Reset",
                        style: "destructive",
                        onPress: () => dispatch({ type: "RESET" }),
                    },
                ]
            );
        }
    };

    const filtered = students.filter((s) => {
        return (
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.department.toLowerCase().includes(query.toLowerCase())
        );
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Title bar */}
            <View style={styles.titleBar}>
                <Text style={styles.title}>
                    Student Directory ({students.length})
                </Text>
                <View style={styles.titleActions}>
                    <Pressable
                        style={styles.resetButton}
                        onPress={handleReset}
                    >
                        <Text style={styles.resetButtonText}>Reset</Text>
                    </Pressable>
                    <Pressable
                        style={styles.addButton}
                        onPress={() => router.push("/(tabs)/add-student")}
                    >
                        <Text style={styles.addButtonText}>+ Add</Text>
                    </Pressable>
                </View>
            </View>

            <SearchBar value={query} onChangeText={setQuery} />

            <View style={styles.listContainer}>
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <StudentItem
                            student={item}
                            onPress={handleSelect}
                            isSelected={selectedStudent?.id === item.id}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>
                                No students match "{query}"
                            </Text>
                        </View>
                    }
                />
            </View>

            {selectedStudent && (
                <StudentDetail student={selectedStudent} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#0D1F4E",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        flexShrink: 1,
    },
    titleActions: {
        flexDirection: "row",
        gap: 8,
    },
    resetButton: {
        backgroundColor: "#7F1D1D",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    resetButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 13,
    },
    addButton: {
        backgroundColor: "#0D9488",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 13,
    },
    listContainer: {
        flex: 1,
    },
    empty: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: "#94A3B8",
    },
});
