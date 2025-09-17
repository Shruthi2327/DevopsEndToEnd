import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all todos
  useEffect(() => {
    axios.get("http://localhost:5000/api/todos")
      .then(res => setTodos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!text) return;
    if (editId) {
      // Edit existing todo
      await axios.put(`http://localhost:5000/api/todos/${editId}`, { text });
      setTodos(todos.map(t => (t._id === editId ? { ...t, text } : t)));
      setEditId(null);
    } else {
      const res = await axios.post("http://localhost:5000/api/todos", { text });
      setTodos([...todos, res.data]);
    }
    setText("");
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  // Start editing
  const startEdit = (todo) => {
    setText(todo.text);
    setEditId(todo._id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Todo App</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter a todo"
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addButton}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul style={styles.list}>
        {todos.map(t => (
          <li key={t._id} style={styles.listItem}>
            <span>{t.text}</span>
            <div>
              <button onClick={() => startEdit(t)} style={styles.editButton}>✏️</button>
              <button onClick={() => deleteTodo(t._id)} style={styles.deleteButton}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Inline CSS styles
const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px"
  },
  inputContainer: {
    display: "flex",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px 0 0 5px",
    border: "1px solid #ccc",
    fontSize: "16px"
  },
  addButton: {
    padding: "10px 20px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "0 5px 5px 0",
    cursor: "pointer"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  listItem: {
    padding: "10px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  editButton: {
    marginRight: "10px",
    padding: "5px 10px",
    border: "none",
    backgroundColor: "#ffc107",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default App;
