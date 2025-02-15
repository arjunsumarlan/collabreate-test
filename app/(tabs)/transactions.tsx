import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HapticButton } from "@/components/HapticButton";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { api } from "@/utils/api";
import { formatDate } from "@/utils/dateFormatter";
import debounce from "lodash/debounce";

const TransactionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    value: "",
    date: "",
    type: "",
  });

  const [transactions, setTransactions] = useState([]);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((text: string) => {
        setDebouncedSearch(text);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchQuery);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await api.transactions.getAll({
          type: filter,
          search: debouncedSearch,
        });
        setTransactions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getTransactions();
  }, [filter, debouncedSearch]);

  const handleSubmit = async () => {
    try {
      // Validate required fields
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
        setTransactions([result as never, ...transactions]);
        setShowAddModal(false);
        // Reset form
        setNewTransaction({
          name: "",
          value: "",
          date: "",
          type: "",
        });
      } else {
        console.error("Error: Unable to add transaction");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.transactions.delete(id);
      setTransactions(transactions.filter((t: any) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <HapticButton onPress={() => router.back()} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color="#000"
              style={Platform.select({
                android: { marginLeft: -8 },
              })}
            />
          </HapticButton>

          <ThemedText style={styles.headerTitle}>Transactions</ThemedText>

          <HapticButton
            variant="primary"
            style={styles.addNewButton}
            onPress={() => setShowAddModal(true)}
          >
            <ThemedText style={styles.addNewButtonText}>Add new</ThemedText>
          </HapticButton>
        </ThemedView>

        <ThemedView style={styles.filterContainer}>
          <HapticButton
            style={[
              styles.filterButton,
              filter === "all" && styles.activeFilter,
            ]}
            onPress={() => setFilter("all")}
          >
            <ThemedText>All</ThemedText>
          </HapticButton>
          <HapticButton
            style={[
              styles.filterButton,
              filter === "expense" && styles.activeFilter,
            ]}
            onPress={() => setFilter("expense")}
          >
            <ThemedText>Expenses</ThemedText>
          </HapticButton>
          <HapticButton
            style={[
              styles.filterButton,
              filter === "income" && styles.activeFilter,
            ]}
            onPress={() => setFilter("income")}
          >
            <ThemedText>Income</ThemedText>
          </HapticButton>
        </ThemedView>

        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView>
          {transactions.map((transaction: any) => (
            <Pressable
              key={transaction.id}
              style={styles.transactionItem}
              onLongPress={() => {
                Alert.alert(
                  "Delete Transaction",
                  "Are you sure you want to delete this transaction?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => handleDeleteTransaction(transaction.id),
                    },
                  ]
                );
              }}
              android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            >
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionIconText}>S</Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionId}>{transaction.name}</Text>
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.amount < 0 ? styles.expense : styles.income,
                ]}
              >
                {transaction.amount < 0 ? "-" : ""}$
                {Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <AddTransactionModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          transaction={newTransaction}
          setTransaction={setNewTransaction}
          onSubmit={handleSubmit}
        />
      </ThemedView>
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
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 80 : 50,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: "#e0e0e0",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#ffe9ab",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionIconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fc8428",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionId: {
    fontWeight: "bold",
  },
  transactionDate: {
    color: "#666",
  },
  transactionAmount: {
    fontWeight: "bold",
  },
  expense: {
    color: "#ff4444",
  },
  income: {
    color: "#00C851",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  addNewButton: {
    backgroundColor: "#2A2B2E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addNewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default TransactionsScreen;
