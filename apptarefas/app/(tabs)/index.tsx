import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';

const APP_ID = 'G76STjaZy33uEp9s0cQ1byArYNUxhuhwXVUMWYDm';
const REST_API_KEY = 'BufEeo6TWGGB51uyCu5u2ALzs02E2rmdguTuxHkM';
const URL = 'https://parseapi.back4app.com/classes/APtarefas';

export default function HomeScreen() {
  const [descricao, setDescricao] = useState('');
  const [tarefas, setTarefas] = useState([]);

  const headers = {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-REST-API-Key': REST_API_KEY,
    'Content-Type': 'application/json',
  };

  const buscarTarefas = async () => {
    try {
      const response = await fetch(URL, { headers });
      const json = await response.json();
      setTarefas(json.results || []);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error.message);
    }
  };

  const adicionarTarefa = async () => {
    if (!descricao.trim()) return;

    try {
      await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ descricao, concluida: false }),
      });
      setDescricao('');
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error.message);
    }
  };

  const alternarConclusao = async (tarefa) => {
    const novaSituacao = !tarefa.concluida;
    try {
      await fetch(`${URL}/${tarefa.objectId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ concluida: novaSituacao }),
      });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error.message);
    }
  };

  const excluirTarefa = async (tarefa) => {
    try {
      await fetch(`${URL}/${tarefa.objectId}`, {
        method: 'DELETE',
        headers,
      });
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error.message);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.tarefaContainer,
        item.concluida && { borderLeftColor: '#22c55e', backgroundColor: '#e7fbe9' },
      ]}
    >
      <TouchableOpacity
        onPress={() => alternarConclusao(item)}
        style={{ flex: 1 }}
      >
        <Text
          style={[
            styles.tarefaTexto,
            item.concluida && styles.tarefaConcluida,
          ]}
        >
          {item.concluida ? '✅ ' : '⏳ '}
          {item.descricao}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => excluirTarefa(item)}>
        <Text style={styles.excluirTexto}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>📝 Lista de Tarefas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicione uma nova tarefa"
          placeholderTextColor="#94a3b8"
          value={descricao}
          onChangeText={setDescricao}
        />
        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
          <Text style={styles.botaoTexto}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.objectId}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma tarefa no momento. 💤</Text>
        }
        contentContainerStyle={tarefas.length === 0 && { flex: 1, justifyContent: 'center' }}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f7',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1e40af',
    letterSpacing: 1,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  tarefaContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tarefaTexto: {
    fontSize: 16,
    color: '#1e293b',
  },
  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  excluirTexto: {
    fontSize: 20,
    color: '#ef4444',
    paddingHorizontal: 5,
  },
  vazio: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

