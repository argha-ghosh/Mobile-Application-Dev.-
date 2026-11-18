// app/(tabs)/bookmarks.tsx

import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArticleCard from "../../components/article-card";
import { useBookmarks } from "../../context/bookmark-context";
import { Article, ARTICLES } from "../../data/articles";

export default function Bookmarks() {
    const { bookmarkedIds } = useBookmarks();

    const bookmarkedArticles = ARTICLES.filter((a) => bookmarkedIds.has(a.id));

    const handlePress = (article: Article) => {
        router.push({
            pathname: "/(tabs)/(home)/[id]",
            params: { id: article.id },
        });
    };

    return (
        <SafeAreaView style={styles.screen}>
            {bookmarkedArticles.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.icon}>📖</Text>
                    <Text style={styles.title}>No Bookmarks Yet</Text>
                    <Text style={styles.subtitle}>
                        Tap the bookmark icon on any article to save it here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={bookmarkedArticles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ArticleCard article={item} onPress={handlePress} />
                    )}
                    contentContainerStyle={styles.list}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <Text style={styles.listHeaderText}>
                                {bookmarkedArticles.length}{" "}
                                {bookmarkedArticles.length === 1 ? "article" : "articles"} saved
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F0F4F8" },
    list: { paddingBottom: 32 },
    listHeader: { paddingHorizontal: 16, paddingVertical: 12 },
    listHeaderText: { fontSize: 12, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1 },

    // Empty state
    empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
    icon: { fontSize: 48, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: "700", color: "#0D1F4E", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#94A3B8", textAlign: "center", lineHeight: 22 },
});
