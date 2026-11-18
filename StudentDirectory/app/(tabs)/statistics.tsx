// app/(tabs)/statistics.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StatBar from "@/components/stat-bar";
import { useStudents } from "@/context/students-context";

const BAR_COLOURS = [
  "#0D9488",
  "#185FA5",
  "#7C3AED",
  "#F59E0B",
  "#EF4444",
  "#059669",
];

export default function Statistics() {
  const { students } = useStudents();

  // ── Feature 3: useRef to track previous student count ──────────────────────
  // useRef does NOT cause a re-render when .current changes — that's the point.
  // We read prevCount.current before the effect updates it so we can compute the diff.
  const prevCount = useRef(students.length);

  // useState IS used for the badge because it must trigger a re-render to display.
  const [badge, setBadge] = useState<string | null>(null);

  useEffect(() => {
    const diff = students.length - prevCount.current;

    if (diff > 0) {
      setBadge(`↑ ${diff} added`);
    } else if (diff < 0) {
      setBadge(`↓ ${Math.abs(diff)} removed`);
    }

    // Update the ref to the current count after computing the diff
    prevCount.current = students.length;

    // Clear the badge after 2 seconds
    if (diff !== 0) {
      const timer = setTimeout(() => setBadge(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [students.length]);

  // ── Derived value 1: department breakdown ──────────────────────────────────
  // Only recomputes when students changes.
  const deptStats = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      counts[s.department] = (counts[s.department] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [students]);

  // ── Derived value 2: top-5 skill frequency ranking ─────────────────────────
  const topSkills = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      s.skills.forEach((skill) => {
        counts[skill] = (counts[skill] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [students]);

  // ── Feature 1: average skills per student ──────────────────────────────────
  // Computed with useMemo([students]) — only reruns when the list changes.
  const avgSkills = useMemo(() => {
    if (!students.length) return "0.0";
    const total = students.reduce((sum, s) => sum + s.skills.length, 0);
    return (total / students.length).toFixed(1);
  }, [students]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Summary cards row */}
        <View style={styles.summaryRow}>
          {/* Total student count */}
          <View style={[styles.summaryCard, styles.summaryCardFlex]}>
            <Text style={styles.summaryNumber}>{students.length}</Text>
            <Text style={styles.summaryLabel}>Total Students</Text>
            {/* Feature 3: change badge — only shown for 2 s after count changes */}
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>

          {/* Feature 1: average skills per student */}
          <View style={[styles.summaryCard, styles.summaryCardFlex, styles.summaryCardAlt]}>
            <Text style={styles.summaryNumber}>{avgSkills}</Text>
            <Text style={styles.summaryLabel}>Avg Skills / Student</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>By Department</Text>
        <View style={styles.card}>
          {deptStats.map(({ dept, count }, i) => (
            <StatBar
              key={dept}
              label={dept}
              count={count}
              total={students.length}
              colour={BAR_COLOURS[i % BAR_COLOURS.length]}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Top Skills</Text>
        <View style={styles.card}>
          {topSkills.map(({ skill, count }, i) => (
            <View key={skill} style={styles.skillRow}>
              <Text style={styles.rank}>#{i + 1}</Text>
              <Text style={styles.skillName}>{skill}</Text>
              <Text style={styles.skillCount}>
                {count} student{count !== 1 ? "s" : ""}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F4F8" },
  content: { padding: 16, paddingBottom: 40 },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#0D1F4E",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },
  summaryCardFlex: { flex: 1 },
  summaryCardAlt: { backgroundColor: "#185FA5" },

  summaryNumber: { fontSize: 40, fontWeight: "800", color: "#FFFFFF" },
  summaryLabel: { fontSize: 12, color: "#CCFBF1", marginTop: 4, textAlign: "center" },

  // Feature 3: badge styling
  badge: {
    marginTop: 8,
    backgroundColor: "#0D9488",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  rank: { fontSize: 14, fontWeight: "700", color: "#0D9488", width: 32 },
  skillName: { flex: 1, fontSize: 14, color: "#334155" },
  skillCount: { fontSize: 12, color: "#94A3B8" },
});
