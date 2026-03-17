import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light-gray">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <div className="text-3xl font-bold tracking-tight text-navy">
            t<span className="text-sky-blue">e</span>cc
          </div>
          <h1 className="text-xl font-semibold text-navy">Admin Login</h1>
          <p className="text-sm text-medium-gray">
            Sign in to manage the newsletter archive
          </p>
        </div>
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <form className="space-y-4">
      {params?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {params.error}
        </div>
      )}
      {params?.message && (
        <div className="rounded-md bg-sky-blue/10 p-3 text-sm text-sky-blue">
          {params.message}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-navy">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
        />
      </div>
      <button
        formAction={login}
        className="w-full rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-colors focus:outline-none focus:ring-2 focus:ring-sky-blue focus:ring-offset-2"
      >
        Log in
      </button>
    </form>
  );
}
