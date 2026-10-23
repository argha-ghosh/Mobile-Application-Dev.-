import { FlatList, StyleSheet, Text, View } from "react-native";
import StudentItem from "@/components/student-item";
import { Student, STUDENTS } from "@/data/students";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/search-bar";
import { useState } from "react";
import StudentDetail from "@/components/student-detail";

export default function HomeScreen() {
    // State 1: the current search query
    const [query, setQuery] = useState<string>("");

    // State 2: the currently selected student (null = none selected)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // Toggle selection: tap same student to deselect, tap different student to select
    const handleSelect = (student: Student) => {
        setSelectedStudent((prev) => (prev?.id === student.id ? null : student));
    };

    // Derived value: filter students based on query
    // This is NOT state — it is computed from state every render
    const filtered = STUDENTS.filter((s) => {
        return (
            s.name.toLowerCase().includes(query.toLowerCase()) || // check if name matches query OR
            s.department.toLowerCase().includes(query.toLowerCase()) // check if department matches query
        );
    });

    return (
        // SafeAreaView ensures content is within safe area boundaries of the device
        <SafeAreaView style={styles.container}>
            {/* Title bar */}
            <View style={styles.titleBar}>
                <Text style={styles.title}>Student Directory</Text>
                <Text style={styles.count}>{filtered.length} / {STUDENTS.length}</Text>
            </View>

            {/* Search bar — value and setter are passed as props */}
            <SearchBar value={query} onChangeText={setQuery} />

            {/* Student list using React Native's FlatList component */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                // onPress handler toggles selection; isSelected highlights the selected row
                renderItem={({ item }) => (
                    <StudentItem
                        student={item}
                        onPress={handleSelect}
                        isSelected={selectedStudent?.id === item.id}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No students match "{query}"</Text>
                    </View>
                }
            />

            {/* Detail panel — only shown when a student is selected */}
            {selectedStudent && <StudentDetail student={selectedStudent} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    // Styles for the title bar
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#0D1F4E",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    count: {
        fontSize: 12,
        color: "#CCFBF1",
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
