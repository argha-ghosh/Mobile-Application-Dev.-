// app/(tabs)/add-student.tsx
// Screen that hosts the AddStudentForm.
// The header ("Join the Directory") is provided by the Tabs navigator in _layout.tsx,
// so we only need to supply the body container here.

import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddStudentForm from "@/components/add-student-form";

export default function AddStudentScreen() {
    return (
        // edges={["bottom"]} — the top edge is already handled by the navigator header
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <View style={styles.content}>
                <AddStudentForm />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        flex: 1,
    },
});
