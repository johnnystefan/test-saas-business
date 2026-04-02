import { LoginForm } from './login-form';
import { useLogin } from './use-login';

export function LoginPage() {
  const { login, isLoading, error } = useLogin();

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col justify-center px-6">
      {/* Logo / Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#22C55E]">The Stadium</h1>
        <p className="text-[#9CA3AF] mt-2">Your sports academy platform</p>
      </div>

      {/* Form Card */}
      <div className="bg-[#111827] rounded-2xl p-6">
        <h2 className="text-[#E5E7EB] text-xl font-semibold mb-6">Sign In</h2>
        <LoginForm onSubmit={login} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}
