import { prisma } from "api";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import MessageForm from "./MessageForm";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Send ${username} an anonymous message!`,
    description: `Click the link to send ${username} an anonymous message on AskO.`,
    openGraph: {
      title: `Send ${username} an anonymous message!`,
      description: `Click the link to send ${username} an anonymous message on AskO.`,
      images: [`/api/og?username=${username}`], // Placeholder for dynamic OG image
    },
  };
}

export default async function SenderPage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-linear-to-tr from-pink-500 to-yellow-500 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg ring-4 ring-white/10">
            {username[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-white text-center">
            @{username}
          </h1>
          <p className="text-white/70 text-sm mt-1">send me anonymous messages!</p>
        </div>

        <MessageForm username={username} />

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm mb-4">Get your own anonymous messages!</p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white text-xs font-medium transition-colors">
              App Store
            </button>
            <button className="px-6 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-white text-xs font-medium transition-colors">
              Play Store
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-white/30 text-xs">
        built with ❤️ on AskO
      </p>
    </div>
  );
}
