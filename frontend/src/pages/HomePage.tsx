import { Layout } from '../components/layout/Layout';
import { TodoList } from '../components/todo/TodoList';
import { TodoProvider } from '../context/TodoContext';

export function HomePage() {
  return (
    <TodoProvider>
      <Layout>
        <TodoList />
      </Layout>
    </TodoProvider>
  );
}
