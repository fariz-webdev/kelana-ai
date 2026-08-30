"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type MeResponse } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
  trip_count: number;
}

function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // fetch(`${API_URL}/me`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(async (res) => {
    //     if (!res.ok) {
    //       const body = await res.json().catch(() => ({}));
    //       throw new Error(body.detail ?? `Failed to load profile (${res.status})`);
    //     }
    //     return res.json() as Promise<UserProfile>;
    //   })
    getMe(token)
      .then(setProfile)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load profile.")
      )
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-red-500 text-sm">{error}</p>
      </main>
    );
  }

  if (!profile) return null;

  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md mx-auto">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
            {initial}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Member since {formatMemberSince(profile.created_at)}
          </p>
        </div>

        {/* Info card */}
        <div className="bg-gray-100 rounded-2xl divide-y divide-gray-200">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Email
            </span>
            <span className="text-sm text-gray-700">{profile.email}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              Trips Generated
            </span>
            <span className="text-sm text-gray-700">{profile.total_trips}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
