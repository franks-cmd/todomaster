import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
    } catch (err) {
      setError((err as Error).message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <Input
        label="姓名"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="你的名字"
        required
      />
      <Input
        label="邮箱"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />
      <Input
        label="密码"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <Input
        label="确认密码"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        注册
      </Button>
      <p className="text-center text-sm text-gray-500">
        已有账号？{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          去登录
        </Link>
      </p>
    </form>
  );
}
