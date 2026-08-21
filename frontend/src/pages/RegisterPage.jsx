import { useState } from "react";

import registerService from "../services/registerService";
import AuthService from "../auth/AuthService";

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
                    Créer un compte
                </h1>

                <p className="text-center text-slate-500 mb-8">
                    Créez votre compte pour accéder à l'assistant ENCG.
                </p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Prénom
                        </label>

                        <input
                            type="text"
                            name="firstname"
                            value={form.firstname}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre prénom"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nom
                        </label>

                        <input
                            type="text"
                            name="lastname"
                            value={form.lastname}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre nom"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Adresse email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="exemple@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Mot de passe
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Au moins 8 caractères"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Création du compte..." : "S'inscrire"}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-slate-500">

                    Vous avez déjà un compte ?{" "}

                    <button
                        type="button"
                        onClick={() => AuthService.login()}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Se connecter
                    </button>

                </div>

            </div>

        </div>
    );
}