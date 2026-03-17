import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white text-2xl font-bold shadow-lg shadow-primary-200">
            T
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Todo<span className="text-primary-500">Master</span>
          </h1>
          <p className="mt-2 text-gray-500">创建账号开始使用</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
