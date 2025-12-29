"use client";

import { DataLibrarian } from "@/lib/head_librarian";
import { useEffect } from "react";

export default function CacheManager() {
    useEffect(() => {
        // Verify server identity on mount (application load)
        DataLibrarian.HeadLibrarian.verifyServerIdentity();
    }, []);

    return null; // This component renders nothing
}
