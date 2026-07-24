export default function GuestCard() {

    return (

        <div
            className="
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                p-8
                text-center
            "
        >

            <h2 className="text-2xl font-bold">

                Mode visiteur

            </h2>

            <p className="text-slate-400 mt-3">

                Vous utilisez actuellement le chatbot en tant que visiteur.
                Connectez-vous afin de conserver définitivement vos conversations
                et retrouver votre historique sur n'importe quel appareil.

            </p>

        </div>

    );

}