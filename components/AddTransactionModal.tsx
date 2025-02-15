import React, { useState } from "react";
import { View, TextInput, Modal, StyleSheet, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "./ThemedText";
import { HapticButton } from "./HapticButton";
import { formatDate } from "@/utils/dateFormatter";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: {
    name: string;
    value: string;
    date: string;
    type: string;
  };
  setTransaction: (transaction: any) => void;
  onSubmit: () => void;
}

export const AddTransactionModal = ({
  visible,
  onClose,
  transaction,
  setTransaction,
  onSubmit,
}: AddTransactionModalProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTransaction({ ...transaction, date: selectedDate.toISOString() });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={transaction.name}
            onChangeText={(text) =>
              setTransaction({ ...transaction, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Value"
            value={transaction.value}
            onChangeText={(text) =>
              setTransaction({ ...transaction, value: text })
            }
            keyboardType="numeric"
          />

          {/* Type Selection */}
          <View style={styles.typeContainer}>
            <HapticButton
              style={[
                styles.typeButton,
                transaction.type === "income" && styles.activeTypeButton,
              ]}
              onPress={() => setTransaction({ ...transaction, type: "income" })}
            >
              <ThemedText
                style={[
                  styles.typeButtonText,
                  transaction.type === "income" && styles.activeTypeText,
                ]}
              >
                Income
              </ThemedText>
            </HapticButton>
            <HapticButton
              style={[
                styles.typeButton,
                transaction.type === "expense" && styles.activeTypeButton,
              ]}
              onPress={() =>
                setTransaction({ ...transaction, type: "expense" })
              }
            >
              <ThemedText
                style={[
                  styles.typeButtonText,
                  transaction.type === "expense" && styles.activeTypeText,
                ]}
              >
                Expense
              </ThemedText>
            </HapticButton>
          </View>

          {/* Date Picker */}
          <Pressable 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText>
              {transaction.date ? formatDate(transaction.date) : "Select Date"}
            </ThemedText>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={transaction.date ? new Date(transaction.date) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <View style={styles.modalButtons}>
            <HapticButton style={styles.cancelButton} onPress={onClose}>
              <ThemedText>Cancel</ThemedText>
            </HapticButton>
            <HapticButton style={styles.submitButton} onPress={onSubmit}>
              <ThemedText style={styles.submitButtonText}>Add</ThemedText>
            </HapticButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  activeTypeButton: {
    backgroundColor: "#007AFF",
  },
  typeButtonText: {
    color: "#000",
  },
  activeTypeText: {
    color: "#fff",
  },
  dateButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});
