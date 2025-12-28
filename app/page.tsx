"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/utils/trpcClient";
import NoteEditor from "@/components/NoteEditor";

export default function NotepadPage() {
  const router = useRouter();

  // 🔹 ALL hooks first
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setCheckedAuth(true);
    }
  }, [router]);

  const notesQuery = trpc.notes.getAll.useQuery(undefined, {
    enabled: checkedAuth, // 🔑 important
  });

  const utils = trpc.useUtils();

  const deleteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => utils.notes.getAll.invalidate(),
  });

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (!checkedAuth) return null;

  return (
    <div className="notepad-container">
      <h1 className="notepad-title">📝 Notes</h1>

      <button className="btn-danger" onClick={logout}>
        Logout
      </button>

      <button
        className="btn-primary"
        onClick={() => {
          setSelectedNote(null);
          setTimeout(() => {
            editorRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 0);
        }}
      >
        ➕ Add New
      </button>

      {notesQuery.data?.map((note: any) => (
        <div key={note._id} className="note-card">
          <p>{String(note.text ?? "").slice(0, 80)}</p>

          <div className="note-actions">
            <button onClick={() => setSelectedNote(note)}>✏️ Edit</button>
            <button
              className="btn-danger"
              onClick={() => deleteMutation.mutate({ id: note._id })}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}

      <div className="editor-box" ref={editorRef}>
        <h3 className="editor-title">
          {selectedNote ? "Edit Note" : "New Note"}
        </h3>

        <NoteEditor
          selectedNote={selectedNote}
          onSaved={() => {
            setSelectedNote(null);
            utils.notes.getAll.invalidate();
          }}
        />
      </div>
    </div>
  );
}
