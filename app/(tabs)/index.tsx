import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { HapticButton } from "@/components/HapticButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { api } from "@/utils/api";
import { useUser } from "@/hooks/useUser";

type ChartData = {
  labels: string[];
  datasets: {
    data: number[];
    color: (opacity?: number) => string;
    strokeWidth: number;
  }[];
};

const HomeScreen = () => {
  const { user, loading } = useUser();
  const [timeRange, setTimeRange] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    value: "",
    date: "",
    type: "",
  });
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        color: () => "#ff4444",
        strokeWidth: 2,
      },
      {
        data: [],
        color: () => "#00C851",
        strokeWidth: 2,
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await api.transactions.getSummary(timeRange);
        if (data) setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [timeRange]);

  const handleSubmit = async () => {
    try {
      if (
        !newTransaction.name ||
        !newTransaction.value ||
        !newTransaction.type ||
        !newTransaction.date
      ) {
        console.error("Please fill in all fields");
        return;
      }

      const result = await api.transactions.add({
        name: newTransaction.name,
        amount:
          newTransaction.type === "expense"
            ? -Math.abs(parseFloat(newTransaction.value))
            : parseFloat(newTransaction.value),
        type: newTransaction.type,
        date: new Date(newTransaction.date).toISOString(),
      });

      if (result) {
        const data = await api.transactions.getSummary(timeRange);
        if (data) setChartData(data);

        setShowAddModal(false);
        setNewTransaction({
          name: "",
          value: "",
          date: "",
          type: "",
        });
      }
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.greeting}>
          Hi, {loading ? "..." : user?.name || "User"}
        </ThemedText>

        <ThemedView style={styles.filterContainer}>
          <HapticButton
            variant="secondary"
            style={[
              styles.filterButton,
              timeRange === "all" && styles.activeFilter,
            ]}
            onPress={() => setTimeRange("all")}
          >
            <ThemedText style={styles.filterText}>All</ThemedText>
          </HapticButton>
          <HapticButton
            variant="secondary"
            style={[
              styles.filterButton,
              timeRange === "monthly" && styles.activeFilter,
            ]}
            onPress={() => setTimeRange("monthly")}
          >
            <ThemedText style={styles.filterText}>Monthly</ThemedText>
          </HapticButton>
          <HapticButton
            variant="secondary"
            style={[
              styles.filterButton,
              timeRange === "weekly" && styles.activeFilter,
            ]}
            onPress={() => setTimeRange("weekly")}
          >
            <ThemedText style={styles.filterText}>Weekly</ThemedText>
          </HapticButton>
        </ThemedView>

        <ThemedView style={styles.chartContainer}>
          <ThemedText style={styles.chartTitle}>
            expenses vs income graph
          </ThemedText>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  data: chartData.datasets[0].data,
                  color: (opacity = 1) => `rgba(255, 68, 68, ${opacity})`, // Red for expenses
                  strokeWidth: 2,
                },
                {
                  data: chartData.datasets[1].data,
                  color: (opacity = 1) => `rgba(0, 200, 81, ${opacity})`, // Green for income
                  strokeWidth: 2,
                },
              ],
            }}
            width={Dimensions.get("window").width - 48}
            height={220}
            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
              },
              propsForLabels: {
                fontSize: 12,
              },
              useShadowColorFromDataset: false,
            }}
            bezier
            style={styles.chart}
            withDots={true}
            withShadow={false}
            segments={5}
            fromZero
          />
        </ThemedView>

        <HapticButton
          variant="secondary"
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <ThemedText style={styles.addButtonText}>
            Add new transaction
          </ThemedText>
        </HapticButton>
      </ThemedView>

      <AddTransactionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        transaction={newTransaction}
        setTransaction={setNewTransaction}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 24 : 0,
  },
  greeting: {
    lineHeight: 32,
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeFilter: {
    backgroundColor: "#e0e0e0",
  },
  chartContainer: {
    flex: 1,
    height: 1000,
    backgroundColor: "#f5f5f5",
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    paddingHorizontal: -24,
  },
  chartTitle: {
    fontSize: 20,
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginRight: 16,
  },
  addButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 84 : 76,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeScreen;
