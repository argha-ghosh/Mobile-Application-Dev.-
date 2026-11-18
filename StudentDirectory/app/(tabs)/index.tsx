// app/(tabs)/index.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import SearchBar from "@/components/search-bar";
import StudentItem from "@/components/student-item";
import StudentDetail from "@/components/student-detail";
import { Student } from "@/data/students";
import { useStudents } from "@/context/students-context";
import { useDebounce } from "@/hooks/use-debounce";

// Feature 2: debounce delay is defined once here so it is easy to adjust.
const DEBOUNCE_DELAY = 300;

export default function HomeScreen() {
  const { students, dispatch } = useStudents();

  const [query, setQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // ── useRef: hold a stable reference to the TextInput so we can call .focus()
  // without causing a re-render. TextInput is imported only for the type.
  const searchRef = useRef<TextInput>(null);

  // ── Focus the search bar ~300 ms after mount (lets tab animation finish)
  useEffect(() => {
    const timer = setTimeout(() => {
      searchRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []); // [] — run once on mount only

  // ── useDebounce: delay the filter value until the user pauses typing
  // Feature 2: pass DEBOUNCE_DELAY (also forwarded as prop to SearchBar)
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  // ── useMemo: only recomputes when students or debouncedQuery change.
  // Tapping a student (setSelectedStudent) does NOT re-run this.
  const filtered = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [students, debouncedQuery]);

  // ── Auto-deselect if the selected student gets removed from the list
  useEffect(() => {
    if (selectedStudent && !students.find((s) => s.id === selectedStudent.id)) {
      setSelectedStudent(null);
    }
  }, [students, selectedStudent]);

  // ── useCallback: stable function reference — setSelectedStudent setter is
  // guaranteed stable by React, so the empty dep array [] is correct.
  const handleSelect = useCallback((student: Student) => {
    setSelectedStudent((prev) =>
      prev?.id === student.id ? null : student
    );
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Title bar */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>
          Student Directory ({students.length})
        </Text>
        <View style={styles.titleActions}>
          <Pressable style={styles.resetButton} onPress={handleReset}>
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

      {/* SearchBar now accepts a ref (forwardRef) and an optional debounceDelay prop */}
      <SearchBar
        ref={searchRef}
        value={query}
        onChangeText={setQuery}
        debounceDelay={DEBOUNCE_DELAY}
      />

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
                No students match &quot;{query}&quot;
              </Text>
            </View>
          }
        />
      </View>

      {selectedStudent && <StudentDetail student={selectedStudent} />}
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
