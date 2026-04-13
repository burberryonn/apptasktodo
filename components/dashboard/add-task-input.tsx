"use client";

import { useRef, useState } from "react";
import { Mic, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddTaskInputProps {
  onAdd: (title: string) => void;
}

export function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const [value, setValue] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };

  const startVoice = () => {
    const SpeechRecognitionClass =
      typeof window !== "undefined" &&
      ((window as Window).webkitSpeechRecognition || (window as Window).SpeechRecognition);

    if (!SpeechRecognitionClass) {
      alert("Голосовой ввод не поддерживается в этом браузере");
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = "ru-RU";
    recognition.onresult = (event) => {
      setValue(event.results[0][0].transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Добавить задачу"
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <Button size="icon" variant="soft" onClick={startVoice} aria-label="Голосовой ввод">
        <Mic className="h-4 w-4" />
      </Button>
      <Button size="icon" onClick={submit} aria-label="Добавить">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
