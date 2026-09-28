import { useState } from "react";

import registerService from "../services/registerService";
import AuthService from "../auth/AuthService";
import Logo from "../components/common/Logo";

export default function RegisterPage() {


    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await registerService.register(form);

            setSuccess(response.message);

            setTimeout(() => {
                AuthService.login();
            }, 1500);

        } catch (error) {

          const status = error.response?.status;
          const message = error.response?.data?.message;

          if (status === 400 || status === 409) {
              setError(message || "Une erreur est survenue.");
          } else {
              setError("Une erreur est survenue. Veuillez réessayer.");
          }


        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm outline-none focus:ring-2 ring-brand-500/40 focus:border-brand-500 transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4 py-10">

            <div className="w-full max-w-md">

                <div className="flex flex-col items-center mb-6">
                    <Logo size="lg" />
                    <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">ENCG Tanger</p>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8">

                    <h1 className="text-2xl font-bold text-center mb-2">
                        Créer un compte
                    </h1>

                    <p className="text-center text-neutral-500 dark:text-neutral-400 mb-8 text-sm">
                        Créez votre compte pour accéder à l'assistant ENCGT.
                    </p>

                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 px-4 py-3 text-sm text-brand-700 dark:text-brand-400">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-2 gap-3">

                            <div>
                                <label className="block text-sm font-medium mb-1.5">
                                    Prénom
                                </label>

                                <input
                                    type="text"
                                    name="firstname"
                                    value={form.firstname}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Votre prénom"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5">
                                    Nom
                                </label>

                                <input
                                    type="text"
                                    name="lastname"
                                    value={form.lastname}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="Votre nom"
                                />
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Adresse email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className={inputClass}
                                placeholder="exemple@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className={inputClass}
                                placeholder="Au moins 8 caractères"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-brand-600 py-2.5 font-semibold text-white text-sm transition hover:bg-brand-700 disabled:opacity-50 shadow-sm"
                        >
                            {loading ? "Création du compte..." : "S'inscrire"}
                        </button>

                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">

                        Vous avez déjà un compte ?{" "}

                        <button
                            type="button"
                            onClick={() => AuthService.login()}
                            className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                            Se connecter
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}
