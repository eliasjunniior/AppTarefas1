import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
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
      const text = await response.text(); // lê como texto bruto
      console.log('Resposta bruta:', text);

      const json = JSON.parse(text);
      setTarefas(json.results);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const adicionarTarefa = async () => {
    if (!descricao.trim()) return;

    const novaTarefa = {
      descricao,
      concluida: false,
    };

    try {
      await fetch(URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(novaTarefa),
      });

      setDescricao('');
      buscarTarefas();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite uma tarefa"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Button title="Adicionar Tarefa" onPress={adicionarTarefa} />

      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.objectId}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <Text style={styles.tarefa}>• {item.descricao}</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  tarefa: {
    fontSize: 16,
    paddingVertical: 6,
  },
});