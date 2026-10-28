
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddStudentForm from "@/components/add-student-form";

export default function AddStudentScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <AddStudentForm />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    content: {
        flex: 1,
    },
});
