"use client";

import { useState, useCallback, useEffect } from "react";

export interface EbookState {
    lastChapter: number;
    readChapters: number[];
    bookmarks: number[];
    highlights: Record<number, string[]>; // chapter → array of highlighted block keys
    notes: Record<number, string>; // chapter → note text
}

const defaultState = (): EbookState => ({
    lastChapter: 0,
    readChapters: [],
    bookmarks: [],
    highlights: {},
    notes: {},
});

export function useEbookState(ebookId: "ebook1" | "ebook2") {
    const key = `${ebookId}_state`;

    const [state, setState] = useState<EbookState>(() => {
        if (typeof window === "undefined") return defaultState();
        try {
            const saved = localStorage.getItem(key);
            return saved ? { ...defaultState(), ...JSON.parse(saved) } : defaultState();
        } catch {
            return defaultState();
        }
    });

    // Persist on every change
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch { /* ignore */ }
    }, [key, state]);

    const setChapter = useCallback((chapter: number) => {
        setState((s) => ({
            ...s,
            lastChapter: chapter,
            readChapters: s.readChapters.includes(chapter)
                ? s.readChapters
                : [...s.readChapters, chapter],
        }));
    }, []);

    const toggleBookmark = useCallback((chapter: number) => {
        setState((s) => ({
            ...s,
            bookmarks: s.bookmarks.includes(chapter)
                ? s.bookmarks.filter((b) => b !== chapter)
                : [...s.bookmarks, chapter],
        }));
    }, []);

    const toggleHighlight = useCallback((chapter: number, blockKey: string) => {
        setState((s) => {
            const existing = s.highlights[chapter] ?? [];
            return {
                ...s,
                highlights: {
                    ...s.highlights,
                    [chapter]: existing.includes(blockKey)
                        ? existing.filter((k) => k !== blockKey)
                        : [...existing, blockKey],
                },
            };
        });
    }, []);

    const saveNote = useCallback((chapter: number, note: string) => {
        setState((s) => ({
            ...s,
            notes: { ...s.notes, [chapter]: note },
        }));
    }, []);

    const progress =
        state.readChapters.length > 0
            ? Math.round((state.readChapters.length / 1) * 100) // will be divided by total in component
            : 0;

    return { state, setChapter, toggleBookmark, toggleHighlight, saveNote, progress };
}
