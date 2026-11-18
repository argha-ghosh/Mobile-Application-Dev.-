// context/bookmark-context.tsx

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface BookmarkContextType {
    bookmarkedIds: Set<string>;
    isBookmarked: (id: string) => boolean;
    toggleBookmark: (id: string) => void;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: { children: ReactNode }) {
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

    const isBookmarked = useCallback(
        (id: string) => bookmarkedIds.has(id),
        [bookmarkedIds]
    );

    const toggleBookmark = useCallback((id: string) => {
        setBookmarkedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    return (
        <BookmarkContext.Provider value={{ bookmarkedIds, isBookmarked, toggleBookmark }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarks() {
    const ctx = useContext(BookmarkContext);
    if (!ctx) throw new Error("useBookmarks must be used inside <BookmarkProvider>");
    return ctx;
}
