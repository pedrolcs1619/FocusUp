import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import TaskAdd from './TaskAdd';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { useFonts, Jaro_400Regular } from '@expo-google-fonts/jaro';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- MOVIDO AQUI

  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Estudar React Native',
      assunto: 'Estudo para prova',
      date: '2025-05-25',
      priority: 'alta',
      completed: false,
    },
    {
      id: '2',
      title: 'Fazer compras no mercado',
      assunto: 'Leite, pão, ovos',
      date: '2025-05-23',
      priority: 'media',
      completed: true,
    },
    {
      id: '3',
      title: 'Enviar relatório do estágio',
      assunto: 'Relatório final do mês',
      date: '2025-05-26',
      priority: 'alta',
      completed: false,
    },
    {
      id: '4',
      title: 'Ler 20 páginas do livro',
      assunto: 'Capítulo 4 de Design',
      date: '2025-05-22',
      priority: 'baixa',
      completed: false,
    },
  ]);

  const [fontsLoaded] = useFonts({ Jaro_400Regular });
  if (!fontsLoaded) return <Text>Carregando fontes...</Text>;

  function toggleCompleted(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function removeTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function addTask(newTask) {
    setTasks(prev => [...prev, newTask]);
  }

  function updateTask(updatedTask) {
    setTasks(prev =>
      prev.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case 'alta': return '#f44336';
      case 'media': return '#ff9800';
      case 'baixa': return '#4caf50';
      default: return '#ccc';
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
  }

  function HomeScreen({ navigation }) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Focus Up</Text>
        </View>

        <Text style={styles.title}>Lista de Tarefas</Text>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.taskItem,
                item.completed && styles.completedTask,
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleCompleted(item.id)}
                style={{ flex: 1 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View
                    style={[
                      styles.priorityFlag,
                      { backgroundColor: getPriorityColor(item.priority) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.taskTextCompleted,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.completed ? '✔️ ' : ''}{item.title}
                  </Text>
                </View>

                {item.assunto && (
                  <Text style={styles.taskAssunto}>
                    📝 {item.assunto}
                  </Text>
                )}

                <Text style={styles.taskDate}>
                  📅 {formatDate(item.date)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removeTask(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TaskAdd', {
                    taskToEdit: item,
                    updateTask: updateTask,
                  })
                }
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TaskAdd', { addTask })}
        >
          <Text style={styles.addButtonText}>+ Adicionar Tarefa</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Agora recebe props
  function AuthFlow({ isLoggedIn, setIsLoggedIn }) {
    function onLoginSuccess() {
      setIsLoggedIn(true);
    }

    if (!isLoggedIn) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login">
            {props => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      );
    }

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TaskAdd" component={TaskAdd} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <AuthFlow isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container
: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#8BD3DD',
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
    zIndex: 1000,
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Jaro_400Regular',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Jaro_400Regular',
    color: '#172c66',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fef6e4',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    minHeight: 80,
  },
  priorityFlag: {
    width: 12,
    height: 48,
    borderRadius: 6,
    marginRight: 10,
  },
  completedTask: {
    backgroundColor: '#d5f5d5',
  },
  taskText: {
    fontSize: 18,
    fontFamily: 'Jaro_400Regular',
    color: '#001858',
    flexShrink: 1,
  },
  taskAssunto: {
    fontSize: 16,
    fontFamily: 'Jaro_400Regular',
    color: '#333',
    marginLeft: 22,
    marginTop: 4,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#555',
  },
  taskDate: {
    fontSize: 14,
    fontFamily: 'Jaro_400Regular',
    color: '#555',
    marginLeft: 22,
    marginTop: 4,
  },
  deleteButton: {
    marginLeft: 15,
    backgroundColor: '#f44336',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 18,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#001858',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Jaro_400Regular',
  },

  editButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch', // Agora o botão tem a mesma altura do botão de excluir
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
