// components/Card.tsx
import Image from "next/image";

export default function Card({ title, description, image, whatsapp }: any) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-sm mx-auto">
      <Image src={image} alt={title} width={400} height={250} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
