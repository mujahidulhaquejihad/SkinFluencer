"use client";

import { useState } from "react";

export default function AdminCampaignsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
        Newsletter campaigns
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Build and schedule newsletter campaigns with a drag-and-drop editor.
      </p>

      <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
          New campaign
        </h2>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Subject
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Campaign subject"
            className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Content (drag-and-drop editor placeholder)
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add blocks: text, images, buttons..."
            rows={8}
            className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-[var(--foreground)] placeholder:text-[var(--muted)]"
          />
        </label>
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            className="rounded-full border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-2.5 font-medium text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
          >
            Schedule
          </button>
          <button
            type="button"
            className="rounded-full border-2 border-[var(--border)] bg-[var(--card)] px-6 py-2.5 font-medium text-[var(--foreground)] hover:border-[var(--accent)]"
          >
            Save draft
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-serif text-lg font-semibold text-[var(--foreground)]">
          Scheduled campaigns
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          No campaigns scheduled. Create one above.
        </p>
      </div>
    </div>
  );
}
