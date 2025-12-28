"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/app/utils/trpcClient";

export default function NoteEditor({
  selectedNote,
  onSaved,
}: {
  selectedNote: any | null;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");

  const utils = trpc.useUtils();

  const addMutation = trpc.notes.add.useMutation({
    onSuccess: () => {
      utils.notes.getAll.invalidate();
      onSaved();
      setText("");
    },
  });

  const updateMutation = trpc.notes.update.useMutation({
    onSuccess: () => {
      utils.notes.getAll.invalidate();
      onSaved();
    },
  });

  /* Load selected note into editor */
  useEffect(() => {
    if (selectedNote) {
      setText(selectedNote.text);
    } else {
      setText("");
    }
  }, [selectedNote]);

  const saveNote = () => {
    if (selectedNote) {
      updateMutation.mutate({
        id: selectedNote._id,
        text,
      });
    } else {
      addMutation.mutate({ text });
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h3>{selectedNote ? "Edit Note" : "New Note"}</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          height: 200,
          padding: 10,
        }}
      />

      <button onClick={saveNote} style={{ marginTop: 10 }}>
        {selectedNote ? "Update" : "Save"}
      </button>
    </div>
  );
}
