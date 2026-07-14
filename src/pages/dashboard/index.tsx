// src/pages/dashboard/index.tsx
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <p>Veuillez vous connecter</p>;

  return (
    <div>
      <h1>Bienvenue {session.user?.email}</h1>
      <p>Gérez vos produits et votre abonnement ici.</p>
      {/* Ajoute des liens vers /dashboard/products et /dashboard/subscription */}
    </div>
  );
}
