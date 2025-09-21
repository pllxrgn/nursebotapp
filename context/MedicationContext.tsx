import type { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Medication } from "../types/medication";
import { useAuth } from "./AuthContext";

type MedicationContextType = {
  medications: Medication[];
  addMedication: (med: Omit<Medication, "id" | "created_at" | "medication_doses" | "user_id">) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  recordDose: (medicationId: string, status: "taken" | "missed") => Promise<void>;
  refreshMedications: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  session: Session | null;
};

const MedicationContext = createContext<MedicationContextType | null>(null);

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (!context) throw new Error("useMedications must be used within MedicationProvider");
  return context;
};

type Props = { children: ReactNode };

export const MedicationProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const refreshMedications = async () => {
    if (!user) {
      setMedications([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("medications")
        .select("*, medication_doses(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMedications(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = async (med: Omit<Medication, "id" | "created_at" | "medication_doses" | "user_id">) => {
    if (!user) {
      setError("User not logged in");
      return;
    }

    try {
      // 🔽 Explicitly map camelCase to lowercase
      const payload = {
        ...med,
        refillreminder: (med as any).refillreminder ?? (med as any).refillReminder ?? null,
        user_id: user.id,
      };
      delete (payload as any).refillReminder; // just in case

      const { error } = await supabase.from("medications").insert([payload]);

      if (error) throw error;
      await refreshMedications();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      const { error } = await supabase.from("medications").delete().eq("id", id);
      if (error) throw error;
      setMedications((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const recordDose = async (medicationId: string, status: "taken" | "missed") => {
    try {
      const { data, error } = await supabase
        .from("medication_doses")
        .insert([
          {
            medication_id: medicationId,
            dose_time: new Date().toISOString(),
            status,
            marked_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      if (data?.length) {
        setMedications((prev) =>
          prev.map((m) =>
            m.id === medicationId
              ? { ...m, medication_doses: [...(m.medication_doses || []), data[0]] }
              : m
          )
        );
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Remove any previous subscriptions (clears cached schema issues)
    (supabase as any).removeAllSubscriptions?.();
    if (!user) return;

    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) return setError(error.message);
      setSession(data.session);
      if (data.session?.user && user) await refreshMedications();
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user && user) refreshMedications();
      else setMedications([]);
    });

    return () => listener.subscription.unsubscribe();
  }, [user]); // ✅ Add `user` as a dependency

  return (
    <MedicationContext.Provider
      value={{
        medications,
        addMedication,
        deleteMedication,
        recordDose,
        refreshMedications,
        isLoading,
        error,
        session,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};
