// app/(tabs)/(home)/index.tsx

import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArticleCard from "../../../components/article-card";
import { Article, ARTICLES } from "../../../data/articles";

// --- Exercise 1: get unique categories from the data ---
const CATEGORIES = [...new Set(ARTICLES.map((a) => a.category))];

export default function ArticleList() {
    // Exercise 1: state for the selected category filter (null = show all)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handlePress = (article: Article) => {
        router.push({
            pathname: "/(home)/[id]",
            params: { id: article.id },
        });
    };

    // Exercise 1: derive filtered list based on selected category
    const filtered = selectedCategory
        ? ARTICLES.filter((a) => a.category === selectedCategory)
        : ARTICLES;

    // Exercise 1: category filter pills rendered as ListHeaderComponent
    const ListHeader = (
        <View>
            {/* Category filter pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pillsContainer}
            >
                {/* "All" pill resets filter */}
                <Pressable
                    style={[styles.pill, selectedCategory === null && styles.pillActive]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Text style={[styles.pillText, selectedCategory === null && styles.pillTextActive]}>
                        All
                    </Text>
                </Pressable>

                {CATEGORIES.map((cat) => (
                    <Pressable
                        key={cat}
                        style={[styles.pill, selectedCategory === cat && styles.pillActive]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextActive]}>
                            {cat}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Story count */}
            <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                    {filtered.length} {filtered.length === 1 ? "story" : "stories"}
                    {selectedCategory ? ` in ${selectedCategory}` : ""}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.screen}>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ArticleCard article={item} onPress={handlePress} />}
                contentContainerStyle={styles.list}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No articles in "{selectedCategory}"</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F0F4F8" },
    list: { paddingBottom: 32 },

    // Category filter pills
    pillsContainer: {
        flexDirection: "row",
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 8,
    },
    pill: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    pillActive: {
        backgroundColor: "#0D9488",
        borderColor: "#0D9488",
    },
    pillText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },
    pillTextActive: {
        color: "#FFFFFF",
    },

    // Story count header
    listHeader: { paddingHorizontal: 16, paddingBottom: 8 },
    listHeaderText: { fontSize: 12, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 },

    // Empty state
    empty: { padding: 40, alignItems: "center" },
    emptyText: { fontSize: 14, color: "#94A3B8" },
});
