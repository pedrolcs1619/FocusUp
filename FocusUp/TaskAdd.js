import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFonts, Jaro_400Regular } from '@expo-google-fonts/jaro';

export default function TaskAdd({ route, navigation }) {
  const { addTask, taskToEdit, updateTask } = route.params || {};

  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
  const [assunto, setAssunto] = useState(taskToEdit ? taskToEdit.assunto || '' : '');
  const [priority, setPriority] = useState(taskToEdit ? taskToEdit.priority : 'media');
  const [date, setDate] = useState(taskToEdit ? new Date(taskToEdit.date) : null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [fontsLoaded] = useFonts({ Jaro_400Regular });
  if (!fontsLoaded) return <Text>Carregando fontes...</Text>;

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleAddOrUpdate = () => {
    if (title.trim() === '') {
      Alert.alert('Erro', 'Digite o título da tarefa');
      return;
    }
    if (!date) {
      Alert.alert('Erro', 'Selecione a data do compromisso');
      return;
    }

    const task = {
      id: taskToEdit ? taskToEdit.id : Date.now().toString(),
      title: title.trim(),
      assunto: assunto.trim(),
      completed: taskToEdit ? taskToEdit.completed : false,
      priority,
      date: date.toISOString(),
    };

    if (taskToEdit && updateTask) {
      updateTask(task);
    } else if (addTask) {
      addTask(task);
    }

    navigation.goBack();
  };

  const formatDate = (date) => {
    if (!date) return 'Selecione a data';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  function PriorityButton({ value, label, color }) {
    const isSelected = priority === value;
    return (
      <TouchableOpacity
        style={[
          styles.priorityButton,
          { backgroundColor: isSelected ? color : '#ddd' },
        ]}
        onPress={() => setPriority(value)}
      >
        <Text style={{ color: isSelected ? '#fff' : '#333', fontWeight: 'bold' }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo centralizada */}
      <View style={styles.header}>
  <Text style={styles.headerText}>Focus Up</Text>
</View>

<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Text style={styles.backButtonText}>← Voltar</Text>
</TouchableOpacity>


      <Text style={styles.label}>Título da Tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Assunto</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Digite o assunto..."
        value={assunto}
        onChangeText={setAssunto}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Prioridade</Text>
      <View style={styles.priorityContainer}>
        <PriorityButton value="alta" label="Alta" color="#f44336" />
        <PriorityButton value="media" label="Média" color="#ff9800" />
        <PriorityButton value="baixa" label="Baixa" color="#4caf50" />
      </View>

      <Text style={styles.label}>Data do Compromisso</Text>
      <TouchableOpacity style={styles.dateInput} onPress={showDatePicker}>
        <Text style={{ fontSize: 16, color: date ? '#000' : '#666' }}>
          {formatDate(date)}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
        <Text style={styles.addButtonText}>
          {taskToEdit ? 'Salvar Alterações' : 'Adicionar Tarefa'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8BD3DD',
  },
  logo: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily: 'Jaro_400Regular',
    color: '#001858',
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'center',
    backgroundColor: '#001858',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 50, 
    left:-130,
    borderRadius: 10,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#001858',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#001858',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

 header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '#001858',
  paddingVertical: 20,
  alignItems: 'center',
  borderBottomWidth: 2,
  borderBottomColor: '#ccc',
  zIndex: 999,
},
headerText: {
  color: '#fff',
  fontSize: 26,
  fontFamily: 'Jaro_400Regular',
},

});
