// src/pages/u/[slug].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";

export default function UserPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/client?code=${slug}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [slug]);

  if (!user) return <p>Chargement...</p>;

  return (
    <div>
      <h1>{user.profile?.fName} {user.profile?.pName}</h1>
      <Carousel items={user.profile?.carousel || []} />
      <h2>Produits</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {user.profile?.products?.map((up: any) => (
          <ProductCard key={up.id} product={up.product} price={up.price} />
        ))}
      </div>
      <h2>Témoignages</h2>
      <ul>
        {user.profile?.testimonies?.map((t: any) => (
          <li key={t.id}>{t.content}</li>
        ))}
      </ul>
    </div>
  );
}
